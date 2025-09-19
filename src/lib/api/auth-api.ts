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

// 로그인 API - HttpOnly 쿠키 사용
export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 포함
      body: JSON.stringify(credentials),
    });

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
    throw new AuthApiError(500, "서버와 통신 중 오류가 발생했습니다.");
  }
};

// 현재 사용자 정보 가져오기
export const getMeApi = async (): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include", // 쿠키 포함
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthApiError(401, "인증이 필요합니다.");
      }
      const data = await response.json();
      throw new AuthApiError(
        response.status,
        data.message || "사용자 정보를 가져올 수 없습니다."
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }
    throw new AuthApiError(500, "서버와 통신 중 오류가 발생했습니다.");
  }
};

// 회원가입 API
export const signupApi = async (
  userData: SignupRequest
): Promise<SignupResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

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
    throw new AuthApiError(500, "서버와 통신 중 오류가 발생했습니다.");
  }
};

// 아이디 중복 확인 API - PathVariable 방식으로 수정
export const checkUsernameApi = async (
  username: string
): Promise<{ available: boolean }> => {
  try {
    const response = await fetch(
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
    throw new AuthApiError(500, "서버와 통신 중 오류가 발생했습니다.");
  }
};

// 로그아웃 API
export const logoutApi = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
      method: "DELETE", // DELETE 메서드 사용
      credentials: "include", // 쿠키 포함
    });

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
    throw new AuthApiError(500, "서버와 통신 중 오류가 발생했습니다.");
  }
};
