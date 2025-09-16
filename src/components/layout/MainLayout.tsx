import { Sidebar } from "./Sidebar";

// src/components/layout/MainLayout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64">
        <div className="px-4 py-6 lg:px-8">
          {/* 모바일에서 햄버거 버튼 공간 확보 */}
          <div className="lg:hidden h-12 mb-4" />
          {children}
        </div>
      </main>
    </div>
  );
}
