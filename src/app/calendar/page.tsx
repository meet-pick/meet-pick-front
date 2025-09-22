"use client";

import { useState, useMemo, useCallback } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// moment 한국어 설정
moment.locale("ko");
const localizer = momentLocalizer(moment);

// 이벤트 타입 정의 (Java LocalDateTime과 매핑)
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  type: "meeting" | "personal" | "work" | "social";
  location?: string;
  participants?: number;
  color?: string;
}

// 더미 데이터 (실제로는 API에서 가져올 예정)
const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "팀 회의",
    start: new Date(2025, 0, 25, 14, 0), // 2025-01-25 14:00
    end: new Date(2025, 0, 25, 15, 30),
    type: "work",
    description: "주간 팀 회의 및 진행상황 공유",
    location: "회의실 A",
    participants: 8,
    color: "#2EC4B6",
  },
  {
    id: "2",
    title: "개발자 모임",
    start: new Date(2025, 0, 26, 19, 0),
    end: new Date(2025, 0, 26, 21, 0),
    type: "social",
    description: "React 개발자 네트워킹 모임",
    location: "강남역 스터디룸",
    participants: 25,
    color: "#5BC0EB",
  },
  {
    id: "3",
    title: "프로젝트 발표",
    start: new Date(2025, 0, 28, 10, 0),
    end: new Date(2025, 0, 28, 12, 0),
    type: "work",
    description: "Q1 프로젝트 최종 발표",
    location: "대회의실",
    participants: 15,
    color: "#4A90E2",
  },
];

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
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    if (filterType === "all") return events;
    return events.filter((event) => event.type === filterType);
  }, [events, filterType]);

  // 이벤트 스타일 설정
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || eventTypeColors[event.type],
        borderColor: event.color || eventTypeColors[event.type],
        color: "white",
        border: "none",
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
      setIsNewEventDialogOpen(true);
    },
    []
  );

  // 새 이벤트 추가
  const handleAddEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventData.title || "새 이벤트",
      start: eventData.start || new Date(),
      end: eventData.end || new Date(),
      type: (eventData.type as CalendarEvent["type"]) || "personal",
      description: eventData.description,
      location: eventData.location,
      participants: eventData.participants,
      color:
        eventTypeColors[
          (eventData.type as CalendarEvent["type"]) || "personal"
        ],
    };
    setEvents((prev) => [...prev, newEvent]);
    setIsNewEventDialogOpen(false);
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

          <Button onClick={() => setIsNewEventDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />새 일정
          </Button>
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
              selectable
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

                {selectedEvent.participants && (
                  <div className="flex items-start space-x-3">
                    <Users className="h-4 w-4 mt-0.5 text-text-primary opacity-60" />
                    <div className="text-sm">
                      {selectedEvent.participants}명 참여
                    </div>
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

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-danger hover:text-danger"
                >
                  삭제
                </Button>
              </div>
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
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 새 이벤트 폼 컴포넌트
function NewEventForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Partial<CalendarEvent>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    type: "personal" as CalendarEvent["type"],
    start: "",
    end: "",
    description: "",
    location: "",
    participants: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
      participants: formData.participants
        ? parseInt(formData.participants)
        : undefined,
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
        <Label htmlFor="participants">참여 인원</Label>
        <Input
          id="participants"
          type="number"
          value={formData.participants}
          onChange={(e) =>
            setFormData({ ...formData, participants: e.target.value })
          }
          placeholder="참여 인원 수"
          min="1"
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
        <Button type="submit" className="flex-1">
          추가
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          취소
        </Button>
      </div>
    </form>
  );
}
