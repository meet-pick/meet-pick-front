import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="border-b border-background-secondary pb-6">
        <h1 className="text-2xl font-bold text-text-primary">대시보드</h1>
        <p className="text-text-primary opacity-80 mt-1">
          오늘의 일정과 모임을 확인해보세요
        </p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>오늘의 일정</CardDescription>
            <CardTitle className="text-2xl text-primary">5개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-primary opacity-60">+2 어제보다</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>활성 모임</CardDescription>
            <CardTitle className="text-2xl text-secondary">12개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-primary opacity-60">
              참여중인 모임
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>새 메시지</CardDescription>
            <CardTitle className="text-2xl text-accent">8개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-primary opacity-60">
              읽지 않은 메시지
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>이번 주 모임</CardDescription>
            <CardTitle className="text-2xl text-warning-600">3개</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-primary opacity-60">예정된 모임</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 일정</CardTitle>
            <CardDescription>오늘과 내일의 주요 일정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-primary-50 rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">팀 미팅</p>
                <p className="text-sm text-text-primary opacity-60">
                  오늘 오후 2:00
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-lg">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">프로젝트 회의</p>
                <p className="text-sm text-text-primary opacity-60">
                  내일 오전 10:00
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-accent-50 rounded-lg">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-text-primary">네트워킹 모임</p>
                <p className="text-sm text-text-primary opacity-60">
                  내일 오후 7:00
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>추천 모임</CardTitle>
            <CardDescription>관심사 기반 추천 모임</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-background-secondary rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">
                개발자 네트워킹
              </h4>
              <p className="text-sm text-text-primary opacity-80 mb-3">
                서울 지역 개발자들의 정기 모임
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-primary">25명 참여중</span>
                <Button size="sm" variant="outline">
                  참여하기
                </Button>
              </div>
            </div>

            <div className="border border-background-secondary rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">
                스터디 그룹
              </h4>
              <p className="text-sm text-text-primary opacity-80 mb-3">
                React 학습을 위한 온라인 스터디
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">12명 참여중</span>
                <Button size="sm" variant="outline">
                  참여하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
