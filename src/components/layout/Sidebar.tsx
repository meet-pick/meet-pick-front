"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Home,
  Plus,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    title: "홈",
    href: "/",
    icon: Home,
    description: "대시보드",
  },
  {
    title: "일정",
    href: "/calendar",
    icon: Calendar,
    description: "캘린더 보기",
  },
  {
    title: "모임",
    href: "/meetings",
    icon: Users,
    description: "모임 관리",
  },
  {
    title: "채팅",
    href: "/chat",
    icon: MessageSquare,
    description: "메시지",
    badge: 3,
  },
  {
    title: "알림",
    href: "/notifications",
    icon: Bell,
    description: "알림 센터",
    badge: 5,
  },
];

const quickActions = [
  {
    title: "빠른 모임",
    href: "/meetings/quick",
    icon: Plus,
    color: "bg-primary hover:bg-primary-600",
  },
  {
    title: "일정 추가",
    href: "/calendar/add",
    icon: Clock,
    color: "bg-secondary hover:bg-secondary-600",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      await logout();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-background-secondary">
      {/* 로고/헤더 */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-background-secondary">
        <Link href="/" className="flex items-center space-x-3">
          {/* MeetPick 로고 SVG */}
          <div className="w-10 h-10 flex-shrink-0">
            <Image
              src="/meet-pick-logo-noword.svg"
              alt="MeetPick Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-text-primary">MeetPick</span>
        </Link>

        {/* 모바일 닫기 버튼 */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 hover:bg-background rounded-md"
        >
          <X className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      {/* 사용자 프로필 */}
      <div className="px-6 py-4 border-b border-background-secondary">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            {isAuthenticated && user ? (
              <>
                <h3 className="text-sm font-semibold text-text-primary">
                  {user.nickname}
                </h3>
                <p className="text-xs text-text-primary opacity-60">
                  @{user.username}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-text-primary">
                  게스트
                </h3>
                <p className="text-xs text-text-primary opacity-60">
                  로그인이 필요합니다
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 빠른 액션 버튼들 */}
      <div className="px-6 py-4 border-b border-background-secondary">
        <h4 className="text-xs font-semibold text-text-primary opacity-60 uppercase tracking-wide mb-3">
          빠른 액션
        </h4>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-white transition-colors text-sm",
                action.color
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <action.icon className="w-4 h-4" />
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <div className="flex-1 px-6 py-4">
        <h4 className="text-xs font-semibold text-text-primary opacity-60 uppercase tracking-wide mb-3">
          메뉴
        </h4>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-primary hover:bg-background"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive
                      ? "text-white"
                      : "text-text-primary opacity-60 group-hover:opacity-100"
                  )}
                />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      isActive
                        ? "bg-white text-primary"
                        : "bg-danger text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 하단 메뉴 */}
      <div className="px-6 py-4 border-t border-background-secondary">
        <nav className="space-y-1">
          <Link
            href="/favorites"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-text-primary hover:bg-background transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Star className="w-5 h-5 opacity-60" />
            <span>즐겨찾기</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-text-primary hover:bg-background transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Settings className="w-5 h-5 opacity-60" />
            <span>설정</span>
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-danger hover:bg-danger-50 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>로그아웃</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-primary hover:bg-primary-50 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <LogOut className="w-5 h-5" />
              <span>로그인</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-background-secondary"
      >
        <Menu className="w-6 h-6 text-text-primary" />
      </button>

      {/* 데스크톱 사이드바 */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0",
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMobile}
        />
      )}

      {/* 모바일 사이드바 */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
