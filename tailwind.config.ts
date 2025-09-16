// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MeetPick 브랜드 컬러
        primary: {
          DEFAULT: "#2EC4B6", // 메인 컬러
          50: "#E6F9F7",
          100: "#CCF3EF",
          200: "#99E7DF",
          300: "#66DBCF",
          400: "#33CFBF",
          500: "#2EC4B6", // 기본값
          600: "#259D92",
          700: "#1C766D",
          800: "#134E49",
          900: "#0A2724",
        },

        secondary: {
          DEFAULT: "#5BC0EB", // 서브컬러 1
          50: "#EBF7FE",
          100: "#D7EFFD",
          200: "#AFDFFA",
          300: "#87CFF8",
          400: "#5FBFF5",
          500: "#5BC0EB", // 기본값
          600: "#3FA8D9",
          700: "#2F7FA3",
          800: "#1F556D",
          900: "#102A36",
        },

        accent: {
          DEFAULT: "#4A90E2", // 서브컬러 2
          50: "#EAF2FD",
          100: "#D5E5FA",
          200: "#ABCBF5",
          300: "#81B1F0",
          400: "#5797EB",
          500: "#4A90E2", // 기본값
          600: "#2D73CB",
          700: "#225698",
          800: "#173A65",
          900: "#0B1D32",
        },

        // 포인트 컬러들
        warning: {
          DEFAULT: "#FFD23F", // 경고색
          50: "#FFFCF0",
          100: "#FFF9E1",
          200: "#FFF3C3",
          300: "#FFEDA5",
          400: "#FFE787",
          500: "#FFD23F", // 기본값
          600: "#E6BD00",
          700: "#B39200",
          800: "#806900",
          900: "#4D3F00",
        },

        danger: {
          DEFAULT: "#FF6B6B", // 위험/닫기색
          50: "#FFF0F0",
          100: "#FFE1E1",
          200: "#FFC3C3",
          300: "#FFA5A5",
          400: "#FF8787",
          500: "#FF6B6B", // 기본값
          600: "#FF4848",
          700: "#E63333",
          800: "#B32525",
          900: "#801818",
        },

        // 배경 및 텍스트 컬러
        background: {
          DEFAULT: "#F7F7F7", // 메인 배경
          secondary: "#E0E0E0", // 서브 배경
        },

        text: {
          primary: "#2D2D2D", // 메인 텍스트
          secondary: "#1B1B2F", // 강조 텍스트
        },

        // 기존 shadcn/ui 호환을 위한 매핑
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "#FF6B6B",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E0E0E0",
          foreground: "#2D2D2D",
        },
        popover: {
          DEFAULT: "#F7F7F7",
          foreground: "#2D2D2D",
        },
        card: {
          DEFAULT: "#F7F7F7",
          foreground: "#2D2D2D",
        },
      },

      // 반응형 설정
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      // 모바일 친화적 spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
