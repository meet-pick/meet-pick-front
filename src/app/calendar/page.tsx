"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { useCalendar, CalendarEvent } from "@/hooks/useCalendar";
import { useAuth } from "@/contexts/AuthContext";

// moment 한국어 설정
moment.locale("ko");
const localizer = momentLocalizer(moment);

// 이벤트 타입별 색상과 라벨
const eventTypeColors = {
  meeting: "#2EC4B6",
  personal: "#4A90E2",
  work: "#5BC0EB",
  social: "#FFD23F",
};

const eventTypeLabels = {
  meeting: "모임",
  personal: "개인",
  work: "업무",
  social: "소셜",
};

export default function CalendarPage() {
  const { isAuthenticated } = useAuth();
  const {
    events,
    isLoading,
    error,
    clearError,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshCurrentMonth,
  } = useCalendar();

  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // 컴포넌트 마운트 시 현재 월의 일정 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      refreshCurrentMonth();
    }
  }, [isAuthenticated, refreshCurrentMonth]);

  // 날짜 변경 시 해당 월의 일정 불러오기
  useEffect(() => {
    if (isAuthenticated) {
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      fetchEvents(startOfMonth, endOfMonth);
    }
  }, [currentDate, isAuthenticated, fetchEvents]);

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    if (filterType === "all") return events;
    return events.filter((event) => event.type === filterType);
  }, [events, filterType]);

  // 이벤트 스타일 설정
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const eventColor = event.color || eventTypeColors[event.type];
    return {
      style: {
        backgroundColor: eventColor,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: eventColor,
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        padding: "2px 4px",
      },
    };
  }, []);

  // 이벤트 클릭 핸들러
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  }, []);

  // 날짜 슬롯 클릭 핸들러 (새 이벤트 생성)
  const handleSlotSelect = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (isAuthenticated) {
        setIsNewEventDialogOpen(true);
      }
    },
    [isAuthenticated]
  );

  // 새 이벤트 추가
  const handleAddEvent = async (eventData: Partial<CalendarEvent>) => {
    const success = await createEvent(eventData);
    if (success) {
      setIsNewEventDialogOpen(false);
    }
  };

  // 이벤트 수정
  const handleEditEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!selectedEvent) return;

    const success = await updateEvent(selectedEvent.id, eventData);
    if (success) {
      setIsEditEventDialogOpen(false);
      setIsEventDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  // 이벤트 삭제
  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      const success = await deleteEvent(eventId);
      if (success) {
        setIsEventDialogOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  // 커스텀 툴바
  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("PREV")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("TODAY")}
              className="px-4"
            >
              오늘
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("NEXT")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-text-primary">{label}</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* 필터 */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="meeting">모임</SelectItem>
              <SelectItem value="work">업무</SelectItem>
              <SelectItem value="personal">개인</SelectItem>
              <SelectItem value="social">소셜</SelectItem>
            </SelectContent>
          </Select>

          {/* 뷰 선택 */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={view === Views.MONTH ? "default" : "ghost"}
              size="sm"
              onClick={() => onView(Views.MONTH)}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">월</span>
            </Button>
            <Button
              variant={view === Views.WEEK ? "default" : "ghost"}
              size="sm"
              onClick={() => onView(Views.WEEK)}
              className="rounded-none border-x"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">주</span>
            </Button>
            <Button
              variant={view === Views.DAY ? "default" : "ghost"}
              size="sm"
              onClick={() => onView(Views.DAY)}
              className="rounded-l-none"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">일</span>
            </Button>
          </div>

          {isAuthenticated && (
            <Button onClick={() => setIsNewEventDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />새 일정
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-background-secondary pb-6">
        <h1 className="text-2xl font-bold text-text-primary">캘린더</h1>
        <p className="text-text-primary opacity-80 mt-1">
          일정을 관리하고 새로운 모임을 계획해보세요
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="text-danger hover:text-danger"
          >
            ×
          </Button>
        </div>
      )}

      {/* 로그인 필요 메시지 */}
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning rounded-lg text-center">
          <p className="text-warning-700">
            캘린더를 사용하려면 로그인이 필요합니다.
          </p>
        </div>
      )}

      {/* 통계 섹션 - 데스크톱용 */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-primary opacity-60">
              이번 달 모임
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {events.filter((e) => e.type === "meeting").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-primary opacity-60">
              업무 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {events.filter((e) => e.type === "work").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-primary opacity-60">
              개인 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {events.filter((e) => e.type === "personal").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-primary opacity-60">
              소셜 이벤트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600">
              {events.filter((e) => e.type === "social").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 통계 섹션 - 모바일용 아코디언 */}
      <div className="md:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stats" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="font-medium">일정 통계 보기</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary mb-1">
                    {events.filter((e) => e.type === "meeting").length}
                  </div>
                  <div className="text-xs text-text-primary opacity-60">
                    이번 달 모임
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-secondary mb-1">
                    {events.filter((e) => e.type === "work").length}
                  </div>
                  <div className="text-xs text-text-primary opacity-60">
                    업무 일정
                  </div>
                </div>

                <div className="bg-accent-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-accent mb-1">
                    {events.filter((e) => e.type === "personal").length}
                  </div>
                  <div className="text-xs text-text-primary opacity-60">
                    개인 일정
                  </div>
                </div>

                <div className="bg-warning-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-warning-600 mb-1">
                    {events.filter((e) => e.type === "social").length}
                  </div>
                  <div className="text-xs text-text-primary opacity-60">
                    소셜 이벤트
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* 캘린더 */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-text-primary opacity-60">
                  일정을 불러오는 중...
                </p>
              </div>
            </div>
          ) : (
            <div style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                view={currentView}
                onView={setCurrentView}
                date={currentDate}
                onNavigate={setCurrentDate}
                onSelectEvent={handleEventClick}
                onSelectSlot={handleSlotSelect}
                selectable={isAuthenticated}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: CustomToolbar,
                }}
                messages={{
                  month: "월",
                  week: "주",
                  day: "일",
                  today: "오늘",
                  previous: "이전",
                  next: "다음",
                  allDay: "종일",
                  noEventsInRange: "이 기간에 일정이 없습니다",
                  showMore: (count) => `+${count}개 더보기`,
                }}
                formats={{
                  monthHeaderFormat: "YYYY년 M월",
                  dayHeaderFormat: "M월 D일 dddd",
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${moment(start).format("M월 D일")} - ${moment(end).format(
                      "M월 D일"
                    )}`,
                  timeGutterFormat: "HH:mm",
                  eventTimeRangeFormat: ({ start, end }) =>
                    `${moment(start).format("HH:mm")} - ${moment(end).format(
                      "HH:mm"
                    )}`,
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 이벤트 상세 다이얼로그 */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{selectedEvent?.title}</span>
            </DialogTitle>
            <DialogDescription>일정 상세 정보</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="px-2 py-1">
                  {eventTypeLabels[selectedEvent.type]}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 mt-0.5 text-text-primary opacity-60" />
                  <div>
                    <div className="text-sm font-medium">
                      {moment(selectedEvent.start).format("M월 D일 (dddd)")}
                    </div>
                    <div className="text-sm text-text-primary opacity-60">
                      {moment(selectedEvent.start).format("HH:mm")} -{" "}
                      {moment(selectedEvent.end).format("HH:mm")}
                    </div>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-text-primary opacity-60" />
                    <div className="text-sm">{selectedEvent.location}</div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">설명</div>
                    <div className="text-sm text-text-primary opacity-80 bg-background p-3 rounded-lg">
                      {selectedEvent.description}
                    </div>
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setIsEditEventDialogOpen(true)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-danger hover:text-danger"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "삭제 중..." : "삭제"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 새 이벤트 추가 다이얼로그 */}
      <Dialog
        open={isNewEventDialogOpen}
        onOpenChange={setIsNewEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 일정 추가</DialogTitle>
            <DialogDescription>새로운 일정을 만들어보세요</DialogDescription>
          </DialogHeader>

          <NewEventForm
            onSubmit={handleAddEvent}
            onCancel={() => setIsNewEventDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
      {/* 이벤트 수정 다이얼로그 */}
      <Dialog
        open={isEditEventDialogOpen}
        onOpenChange={setIsEditEventDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일정 수정</DialogTitle>
            <DialogDescription>일정 정보를 수정하세요</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <EditEventForm
              event={selectedEvent}
              onSubmit={handleEditEvent}
              onCancel={() => setIsEditEventDialogOpen(false)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 이벤트 수정 폼 컴포넌트
function EditEventForm({
  event,
  onSubmit,
  onCancel,
  isLoading,
}: {
  event: CalendarEvent;
  onSubmit: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  // 날짜를 로컬 타임존으로 변환하는 헬퍼 함수
  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: event.title,
    type: event.type,
    start: formatDateTimeLocal(event.start), // 로컬 타임존으로 변환
    end: formatDateTimeLocal(event.end), // 로컬 타임존으로 변환
    description: event.description || "",
    location: event.location || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">제목*</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="일정 제목을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-type">유형</Label>
        <Select
          value={formData.type}
          onValueChange={(value: CalendarEvent["type"]) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">개인</SelectItem>
            <SelectItem value="work">업무</SelectItem>
            <SelectItem value="meeting">모임</SelectItem>
            <SelectItem value="social">소셜</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-start">시작 시간*</Label>
          <Input
            id="edit-start"
            type="datetime-local"
            value={formData.start}
            onChange={(e) =>
              setFormData({ ...formData, start: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-end">종료 시간*</Label>
          <Input
            id="edit-end"
            type="datetime-local"
            value={formData.end}
            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-location">장소</Label>
        <Input
          id="edit-location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="장소를 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">설명</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="일정에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "수정 중..." : "수정"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          취소
        </Button>
      </div>
    </form>
  );
}

// 새 이벤트 폼 컴포넌트
function NewEventForm({
  onSubmit,
  onCancel,
  isLoading,
}: {
  onSubmit: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    type: "personal" as CalendarEvent["type"],
    start: "",
    end: "",
    description: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">제목*</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="일정 제목을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">유형</Label>
        <Select
          value={formData.type}
          onValueChange={(value: CalendarEvent["type"]) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">개인</SelectItem>
            <SelectItem value="work">업무</SelectItem>
            <SelectItem value="meeting">모임</SelectItem>
            <SelectItem value="social">소셜</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">시작 시간*</Label>
          <Input
            id="start"
            type="datetime-local"
            value={formData.start}
            onChange={(e) =>
              setFormData({ ...formData, start: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">종료 시간*</Label>
          <Input
            id="end"
            type="datetime-local"
            value={formData.end}
            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">장소</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="장소를 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="일정에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "추가 중..." : "추가"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
