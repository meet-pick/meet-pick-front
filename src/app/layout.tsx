import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "MeetPick - 모임 플랫폼",
  description: "캘린더 기반 모임 및 미팅 추천 플랫폼",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
