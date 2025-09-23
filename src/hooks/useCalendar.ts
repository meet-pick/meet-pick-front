// src/hooks/useCalendar.ts

import { useState, useCallback } from "react";
import {
  createCalendarApi,
  updateCalendarApi,
  deleteCalendarApi,
  getCalendarsApi,
  CalendarCreateRequest,
  CalendarUpdateRequest,
  CalendarGetResponse,
} from "@/lib/api/calendar-api";

// 프론트엔드 캘린더 이벤트 타입 (React Big Calendar용)
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color: string;
  location?: string;
  type: "meeting" | "personal" | "work" | "social";
}

// API 응답을 프론트엔드 이벤트로 변환
const convertApiResponseToEvent = (
  apiResponse: CalendarGetResponse
): CalendarEvent => {
  // color 값을 기반으로 type 추론 (임시 로직)
  const getTypeFromColor = (color: string): CalendarEvent["type"] => {
    switch (color.toLowerCase()) {
      case "#2ec4b6":
        return "meeting";
      case "#5bc0eb":
        return "work";
      case "#4a90e2":
        return "personal";
      case "#ffd23f":
        return "social";
      default:
        return "personal";
    }
  };

  return {
    id: apiResponse.id.toString(), // 백엔드에서 받은 실제 id 사용
    title: apiResponse.title,
    start: new Date(apiResponse.startDate),
    end: new Date(apiResponse.endDate),
    description: apiResponse.description,
    color: apiResponse.color,
    location: apiResponse.place,
    type: getTypeFromColor(apiResponse.color),
  };
};

// 프론트엔드 이벤트를 API 요청으로 변환
const convertEventToApiRequest = (
  event: Partial<CalendarEvent>
): CalendarCreateRequest => {
  return {
    title: event.title || "",
    description: event.description,
    startDate: event.start?.toISOString() || new Date().toISOString(),
    endDate: event.end?.toISOString() || new Date().toISOString(),
    color: event.color || "#2EC4B6",
    place: event.location,
  };
};

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 일정 조회
  const fetchEvents = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      // Date 객체를 ISO string으로 변환
      const apiResponse = await getCalendarsApi(
        startDate.toISOString(),
        endDate.toISOString()
      );

      const convertedEvents = apiResponse.map(convertApiResponseToEvent);
      setEvents(convertedEvents);
    } catch (err: any) {
      setError(err.message || "일정을 불러오는데 실패했습니다.");
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 일정 추가
  const createEvent = useCallback(
    async (eventData: Partial<CalendarEvent>): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const apiRequest = convertEventToApiRequest(eventData);
        await createCalendarApi(apiRequest);

        // 성공 시 현재 보고 있는 월의 일정을 다시 불러오기
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await fetchEvents(startOfMonth, endOfMonth);

        return true;
      } catch (err: any) {
        setError(err.message || "일정 추가에 실패했습니다.");
        console.error("Failed to create event:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEvents]
  );

  // 일정 수정 - 실제 id 사용
  const updateEvent = useCallback(
    async (
      eventId: string,
      eventData: Partial<CalendarEvent>
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const numericId = parseInt(eventId); // string id를 number로 변환

        const apiRequest: any = {};
        if (eventData.title !== undefined) apiRequest.title = eventData.title;
        if (eventData.description !== undefined)
          apiRequest.description = eventData.description;
        if (eventData.start)
          apiRequest.startDate = eventData.start.toISOString();
        if (eventData.end) apiRequest.endDate = eventData.end.toISOString();
        if (eventData.color !== undefined) apiRequest.color = eventData.color;
        if (eventData.location !== undefined)
          apiRequest.place = eventData.location;

        await updateCalendarApi(numericId, apiRequest);

        // 성공 시 현재 보고 있는 월의 일정을 다시 불러오기
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await fetchEvents(startOfMonth, endOfMonth);

        return true;
      } catch (err: any) {
        setError(err.message || "일정 수정에 실패했습니다.");
        console.error("Failed to update event:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEvents]
  );

  // 일정 삭제 - 실제 id 사용
  const deleteEvent = useCallback(
    async (eventId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const numericId = parseInt(eventId); // string id를 number로 변환

        await deleteCalendarApi(numericId);

        // 성공 시 현재 보고 있는 월의 일정을 다시 불러오기
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await fetchEvents(startOfMonth, endOfMonth);

        return true;
      } catch (err: any) {
        setError(err.message || "일정 삭제에 실패했습니다.");
        console.error("Failed to delete event:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchEvents]
  );

  // 현재 월의 일정 불러오기
  const refreshCurrentMonth = useCallback(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    await fetchEvents(startOfMonth, endOfMonth);
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    clearError,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshCurrentMonth,
  };
};
