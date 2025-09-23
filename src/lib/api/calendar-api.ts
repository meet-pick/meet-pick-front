// src/lib/api/calendar-api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";

// Request Types
export interface CalendarCreateRequest {
  title: string;
  description?: string;
  startDate: string; // ISO 8601 format: "2025-01-25T14:00:00"
  endDate: string; // ISO 8601 format: "2025-01-25T15:30:00"
  color: string;
  place?: string;
}

export interface CalendarUpdateRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  color?: string;
  place?: string;
}

// Response Types
export interface CalendarCreateResponse {
  message: string;
}

export interface CalendarUpdateResponse {
  message: string;
}

export interface CalendarDeleteResponse {
  message: string;
}

export interface CalendarGetResponse {
  id: number; // 백엔드에서 추가된 id 필드
  title: string;
  description?: string;
  startDate: string; // ISO 8601 format from backend
  endDate: string;
  color: string;
  place?: string;
}

// API Error Class
class CalendarApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "CalendarApiError";
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
const handleNetworkError = (error: any): CalendarApiError => {
  console.error("Calendar API Network error:", error);

  if (!navigator.onLine) {
    return new CalendarApiError(0, "인터넷 연결을 확인해주세요.");
  }

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return new CalendarApiError(
      0,
      "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
    );
  }

  if (error.name === "AbortError") {
    return new CalendarApiError(
      408,
      "요청 시간이 초과되었습니다. 다시 시도해주세요."
    );
  }

  return new CalendarApiError(500, "서버와 통신 중 오류가 발생했습니다.");
};

// 날짜 형식 변환 유틸리티 - 타임존 고려
const formatDateForBackend = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  // LocalDateTime 형식: YYYY-MM-DDTHH:mm:ss (타임존 정보 없음)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 일정 추가 API
export const createCalendarApi = async (
  calendarData: CalendarCreateRequest
): Promise<CalendarCreateResponse> => {
  try {
    // 날짜 형식을 백엔드용으로 변환
    const formattedData = {
      ...calendarData,
      startDate: formatDateForBackend(calendarData.startDate),
      endDate: formatDateForBackend(calendarData.endDate),
    };

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/calendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formattedData),
    });

    if (response.status === 401) {
      throw new CalendarApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 400) {
      throw new CalendarApiError(400, "입력 데이터를 확인해주세요.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CalendarApiError(
        response.status,
        errorData.message || "일정 추가에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CalendarApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 일정 수정 API
export const updateCalendarApi = async (
  calendarId: number,
  calendarData: CalendarUpdateRequest
): Promise<CalendarUpdateResponse> => {
  try {
    // 날짜 형식을 백엔드용으로 변환 (undefined가 아닌 경우만)
    const formattedData: any = { ...calendarData };
    if (formattedData.startDate) {
      formattedData.startDate = formatDateForBackend(formattedData.startDate);
    }
    if (formattedData.endDate) {
      formattedData.endDate = formatDateForBackend(formattedData.endDate);
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/calendar/${calendarId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formattedData),
      }
    );

    if (response.status === 401) {
      throw new CalendarApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 400) {
      throw new CalendarApiError(400, "입력 데이터를 확인해주세요.");
    }

    if (response.status === 404) {
      throw new CalendarApiError(404, "해당 일정을 찾을 수 없습니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CalendarApiError(
        response.status,
        errorData.message || "일정 수정에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CalendarApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 일정 삭제 API
export const deleteCalendarApi = async (
  calendarId: number
): Promise<CalendarDeleteResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/calendar/${calendarId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new CalendarApiError(401, "로그인이 필요합니다.");
    }

    if (response.status === 404) {
      throw new CalendarApiError(404, "해당 일정을 찾을 수 없습니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CalendarApiError(
        response.status,
        errorData.message || "일정 삭제에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CalendarApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};

// 일정 조회 API
export const getCalendarsApi = async (
  startDate: string,
  endDate: string
): Promise<CalendarGetResponse[]> => {
  try {
    // ISO 문자열을 LocalDateTime 형식으로 변환
    const formatDateForBackend = (isoString: string): string => {
      const date = new Date(isoString);
      // YYYY-MM-DDTHH:mm:ss 형식으로 변환 (밀리초와 타임존 제거)
      return date.toISOString().slice(0, 19);
    };

    const params = new URLSearchParams({
      startDate: formatDateForBackend(startDate),
      endDate: formatDateForBackend(endDate),
    });

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/v1/calendar?${params}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (response.status === 401) {
      throw new CalendarApiError(401, "로그인이 필요합니다.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CalendarApiError(
        response.status,
        errorData.message || "일정 조회에 실패했습니다."
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CalendarApiError) {
      throw error;
    }
    throw handleNetworkError(error);
  }
};
