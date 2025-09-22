// src/lib/api/auth-api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  nickname: string;
  location?: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  nickname: string;
  location?: string;
  createdAt: string;
}

export interface UserResponse {
  id: number;
  username: string;
  nickname: string;
  location?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

class AuthApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

// 네트워크 에러 처리 유틸리티
const handleNetworkError = (error: any): AuthApiError => {
  console.error("Network error details:", error);

  // 네트워크 연결 문제
  if (!navigator.onLine) {
    return new AuthApiError(0, "인터넷 연결을 확인해주세요.");
  }

  // CORS 에러
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return new AuthApiError(
      0,
      "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
    );
  }

  // 타임아웃 에러
  if (error.name === "AbortError") {
    return new AuthApiError(
      408,
      "요청 시간이 초과되었습니다. 다시 시도해주세요."
    );
  }

  // 기타 네트워크 에러
  return new AuthApiError(
    500,
    "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  );
};

// Fetch with timeout
const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
};

// 로그인 API - HttpOnly 쿠키 사용
export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify(credentials),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new AuthApiError(
        response.status,
        data.message || "로그인에 실패했습니다.",
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 현재 사용자 정보 가져오기 - 개선된 에러 처리
export const getMeApi = async (): Promise<UserResponse> => {
  try {
    console.log(
      `Attempting to fetch user data from: ${API_BASE_URL}/api/v1/auth/me`
    );

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함
    });

    console.log(`Response status: ${response.status}`);

    // 401 Unauthorized - 로그인이 필요한 상태
    if (response.status === 401) {
      throw new AuthApiError(401, "로그인이 필요합니다.");
    }

    // 403 Forbidden - 권한 없음
    if (response.status === 403) {
      throw new AuthApiError(403, "접근 권한이 없습니다.");
    }

    // 404 Not Found - API 엔드포인트가 없음
    if (response.status === 404) {
      throw new AuthApiError(
        404,
        "사용자 정보 API를 찾을 수 없습니다. 서버 설정을 확인해주세요."
      );
    }

    // 500대 서버 에러
    if (response.status >= 500) {
      throw new AuthApiError(
        response.status,
        "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }

    // 기타 4xx 에러
    if (!response.ok) {
      let errorMessage = "사용자 정보를 가져올 수 없습니다.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        console.warn("Failed to parse error response as JSON");
      }
      throw new AuthApiError(response.status, errorMessage);
    }

    const data = await response.json();
    console.log("Successfully fetched user data:", data);
    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 회원가입 API
export const signupApi = async (
  userData: SignupRequest
): Promise<SignupResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new AuthApiError(
        response.status,
        data.message || "회원가입에 실패했습니다.",
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 아이디 중복 확인 API - PathVariable 방식으로 수정
export const checkUsernameApi = async (
  username: string
): Promise<{ available: boolean }> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/auth/check-id/${encodeURIComponent(username)}`,
      {
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new AuthApiError(
        response.status,
        data.message || "중복 확인에 실패했습니다."
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 로그아웃 API
export const logoutApi = async (): Promise<void> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/auth/logout`,
      {
        method: "DELETE", // DELETE 메서드 사용
        credentials: "include", // 쿠키 포함
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new AuthApiError(
        response.status,
        data.message || "로그아웃에 실패했습니다."
      );
    }
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};
