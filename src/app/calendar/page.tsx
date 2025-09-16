export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-background-secondary pb-6">
        <h1 className="text-2xl font-bold text-text-primary">캘린더</h1>
        <p className="text-text-primary opacity-80 mt-1">
          일정을 관리하고 새로운 모임을 계획해보세요
        </p>
      </div>

      {/* 캘린더 내용 */}
      <div className="bg-white rounded-lg border border-background-secondary p-6">
        <p className="text-center text-text-primary opacity-60">
          캘린더 컴포넌트가 여기에 들어갑니다
        </p>
      </div>
    </div>
  );
}
