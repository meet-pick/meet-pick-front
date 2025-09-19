"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getMeApi,
  loginApi,
  signupApi,
  logoutApi,
  checkUsernameApi,
  UserResponse,
  LoginRequest,
  SignupRequest,
} from "@/lib/api/auth-api";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  signup: (userData: SignupRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUsername: (username: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMeApi();
        setUser(userData);
      } catch (err: any) {
        if (err.status !== 401) {
          console.error("Failed to load user:", err);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 로그인
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await loginApi(credentials);

      // 쿠키 설정 대기
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 사용자 정보 가져오기
      try {
        const userData = await getMeApi();
        setUser(userData);
      } catch (meError) {
        // 재시도
        await new Promise((resolve) => setTimeout(resolve, 200));
        const userData = await getMeApi();
        setUser(userData);
      }

      // 페이지 이동
      router.push("/");
      return true;
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입
  const signup = async (userData: SignupRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await signupApi(userData);
      router.push("/login");
      return true;
    } catch (err: any) {
      setError(err.message || "회원가입에 실패했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutApi();
      setUser(null);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "로그아웃에 실패했습니다.");
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // 아이디 중복 확인
  const checkUsername = async (username: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await checkUsernameApi(username);
      return response.available;
    } catch (err: any) {
      setError(err.message || "중복 확인에 실패했습니다.");
      return false;
    }
  };

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const userData = await getMeApi();
      setUser(userData);
    } catch (err: any) {
      if (err.status !== 401) {
        console.error("Failed to refresh user:", err);
      }
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkUsername,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
