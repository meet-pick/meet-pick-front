"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/meet-pick-logo-noword.svg"
              alt="MeetPick Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Meet<span className="text-danger">Pick</span>
          </h1>
          <p className="text-text-primary opacity-60">
            우리 다 같이 만나는 날, 더 쉽게
          </p>
        </div>

        {/* 로그인 카드 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-text-primary">
              로그인
            </CardTitle>
            <CardDescription className="text-center text-text-primary opacity-60">
              계정에 로그인하여 시작하세요
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 아이디 입력 */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-text-primary font-medium"
                >
                  아이디
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 h-12 border-background-secondary focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-text-primary font-medium"
                >
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-background-secondary focus:border-primary focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-text-primary opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 비밀번호 찾기 */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-600 transition-colors"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-600 text-white font-medium text-base"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-background-secondary" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-text-primary opacity-60">
                  또는
                </span>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="mt-6 text-center">
              <p className="text-text-primary opacity-60">
                아직 계정이 없으신가요?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="mt-8 text-center text-sm text-text-primary opacity-60">
          © 2024 MeetPick. All rights reserved.
        </div>
      </div>
    </div>
  );
}