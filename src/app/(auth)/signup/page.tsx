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
import {
  Eye,
  EyeOff,
  User,
  Lock,
  MapPin,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const { signup, checkUsername, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 아이디 입력 시 중복확인 상태 초기화
    if (name === "username") {
      setUsernameCheck("idle");
    }
  };

  const handleCheckUsername = async () => {
    if (!formData.username.trim()) return;

    setUsernameCheck("checking");

    try {
      const isAvailable = await checkUsername(formData.username);
      setUsernameCheck(isAvailable ? "available" : "unavailable");
    } catch (error) {
      console.error("아이디 중복확인 오류:", error);
      setUsernameCheck("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 아이디 중복확인 체크
    if (usernameCheck !== "available") {
      alert("아이디 중복확인을 해주세요.");
      return;
    }

    const success = await signup({
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      location: formData.location || undefined,
    });

    if (success) {
      alert("회원가입이 완료되었습니다!");
    }
  };

  const passwordMatch =
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm;
  const passwordMismatch =
    formData.password &&
    formData.passwordConfirm &&
    formData.password !== formData.passwordConfirm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-background to-accent-50 flex items-center justify-center p-4">
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
            새로운 계정을 만들어보세요
          </p>
        </div>

        {/* 회원가입 카드 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-text-primary">
              회원가입
            </CardTitle>
            <CardDescription className="text-center text-text-primary opacity-60">
              MeetPick의 멤버가 되어보세요
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
              {/* 아이디 입력 (필수) */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-text-primary font-medium"
                >
                  아이디 <span className="text-danger">*</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
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
                    {usernameCheck === "available" && (
                      <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    )}
                    {usernameCheck === "unavailable" && (
                      <X className="absolute right-3 top-3 h-4 w-4 text-danger" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleCheckUsername}
                    disabled={
                      !formData.username.trim() || usernameCheck === "checking"
                    }
                    className="h-12 px-4 bg-secondary hover:bg-secondary-600 text-white whitespace-nowrap"
                  >
                    {usernameCheck === "checking" ? "확인중..." : "중복확인"}
                  </Button>
                </div>
                {usernameCheck === "available" && (
                  <p className="text-sm text-green-600">
                    사용 가능한 아이디입니다.
                  </p>
                )}
                {usernameCheck === "unavailable" && (
                  <p className="text-sm text-danger">
                    이미 사용중인 아이디입니다.
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 (필수) */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-text-primary font-medium"
                >
                  비밀번호 <span className="text-danger">*</span>
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

              {/* 비밀번호 확인 (필수) */}
              <div className="space-y-2">
                <Label
                  htmlFor="passwordConfirm"
                  className="text-text-primary font-medium"
                >
                  비밀번호 확인 <span className="text-danger">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 border-background-secondary focus:border-primary focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-3 text-text-primary opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {passwordMatch && (
                    <Check className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                  )}
                  {passwordMismatch && (
                    <X className="absolute right-10 top-3 h-4 w-4 text-danger" />
                  )}
                </div>
                {passwordMismatch && (
                  <p className="text-sm text-danger">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>

              {/* 닉네임 입력 (필수) */}
              <div className="space-y-2">
                <Label
                  htmlFor="nickname"
                  className="text-text-primary font-medium"
                >
                  닉네임 <span className="text-danger">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                  <Input
                    id="nickname"
                    name="nickname"
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="pl-10 h-12 border-background-secondary focus:border-primary focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* 주소 입력 (선택) */}
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-text-primary font-medium"
                >
                  주소{" "}
                  <span className="text-text-primary opacity-60">(선택)</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-primary opacity-60" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="주소를 입력하세요 (예: 서울시 강남구)"
                    value={formData.location}
                    onChange={handleChange}
                    className="pl-10 h-12 border-background-secondary focus:border-primary focus:ring-primary"
                  />
                </div>
                <p className="text-xs text-text-primary opacity-60">
                  근처 모임 추천을 위해 사용됩니다.
                </p>
              </div>

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-600 text-white font-medium text-base mt-6"
                disabled={isLoading || usernameCheck !== "available"}
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-text-primary opacity-60">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  로그인
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
