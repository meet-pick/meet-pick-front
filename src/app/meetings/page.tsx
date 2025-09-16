import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-background-secondary pb-6">
        <h1 className="text-2xl font-bold text-text-primary">모임</h1>
        <p className="text-text-primary opacity-80 mt-1">
          참여중인 모임과 새로운 모임을 찾아보세요
        </p>
      </div>

      {/* 모임 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle>모임 {item}</CardTitle>
              <CardDescription>모임 설명이 들어갑니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-primary opacity-60">
                  {10 + item}명 참여중
                </span>
                <Button size="sm">참여하기</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
