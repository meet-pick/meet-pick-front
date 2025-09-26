// src/lib/api/friend-api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

// 백엔드 FriendStatus enum과 일치
export type FriendStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCEL";

// Request Types (백엔드 DTO 기준)
export interface FriendAddRequest {
  friendId: number; // 친구로 추가할 Account의 ID
}

// Response Types (백엔드 DTO 기준)
export interface FriendAddResponse {
  message: string;
}

export interface FriendGetResponse {
  id: number; // Friend 테이블의 ID
  username: string;
  nickname: string;
  status: FriendStatus;
  sender: boolean; // true: 사용자가 친구 요청 발송자, false: 사용자가 친구 요청 수신자
}

export interface FriendUpdateStatusResponse {
  message: string;
}

export interface FriendDeleteStatusResponse {
  message: string;
}

// API Error Class
class FriendApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "FriendApiError";
  }
}

// Fetch with timeout utility
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

// Network error handler
const handleNetworkError = (error: any): FriendApiError => {
  console.error("Friend API Network error:", error);

  if (!navigator.onLine) {
    return new FriendApiError(0, "인터넷 연결을 확인해주세요.");
  }

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return new FriendApiError(
      0,
      "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
    );
  }

  if (error.name === "AbortError") {
    return new FriendApiError(
      408,
      "요청 시간이 초과되었습니다. 다시 시도해주세요."
    );
  }

  return new FriendApiError(500, "서버와 통신 중 오류가 발생했습니다.");
};

/**
 * 친구 추가 API
 * POST /api/v1/friend
 */
export const addFriendApi = async (
  request: FriendAddRequest
): Promise<FriendAddResponse> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/friend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 400) {
      throw new FriendApiError(
        400,
        "잘못된 요청입니다. 입력 데이터를 확인해주세요."
      );
    }

    if (response.status === 409) {
      throw new FriendApiError(409, "이미 친구이거나 요청이 진행 중입니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 추가에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * 친구 목록 조회 API
 * GET /api/v1/friend
 */
export const getFriendsApi = async (): Promise<FriendGetResponse[]> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/friend`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 목록 조회에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * 친구 요청 수락 API
 * PATCH /api/v1/friend/accept/{friendId}
 */
export const acceptFriendApi = async (
  friendId: number
): Promise<FriendUpdateStatusResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/friend/accept/${friendId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 404) {
      throw new FriendApiError(404, "해당 친구 요청을 찾을 수 없습니다.");
    }

    if (response.status === 400) {
      throw new FriendApiError(400, "잘못된 요청입니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 요청 수락에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * 친구 요청 거절 API
 * PATCH /api/v1/friend/reject/{friendId}
 */
export const rejectFriendApi = async (
  friendId: number
): Promise<FriendUpdateStatusResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/friend/reject/${friendId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 404) {
      throw new FriendApiError(404, "해당 친구 요청을 찾을 수 없습니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 요청 거절에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * 친구 요청 취소 API
 * PATCH /api/v1/friend/cancel/{friendId}
 */
export const cancelFriendApi = async (
  friendId: number
): Promise<FriendUpdateStatusResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/friend/cancel/${friendId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 404) {
      throw new FriendApiError(404, "해당 친구 요청을 찾을 수 없습니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 요청 취소에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

/**
 * 친구 삭제 API
 * DELETE /api/v1/friend/{friendId}
 */
export const deleteFriendApi = async (
  friendId: number
): Promise<FriendDeleteStatusResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/friend/${friendId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new FriendApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 404) {
      throw new FriendApiError(404, "해당 친구를 찾을 수 없습니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new FriendApiError(
        response.status,
        errorData.message || "친구 삭제에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FriendApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};
