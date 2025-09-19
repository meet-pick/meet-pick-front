export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-primary opacity-60">로딩 중...</p>
      </div>
    </div>
  );
}
