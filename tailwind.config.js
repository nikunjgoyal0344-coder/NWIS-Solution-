/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F', // Deep Blue (Header, primary buttons)
          hover: '#152C49',
          light: '#284E7E',
          soft: '#EBF1F7',
        },
        canvas: '#F8FAFC', // Soft Off-White
        card: '#FFFFFF',
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary Slate Gray
          600: '#475569',
          700: '#334155',
          800: '#1E293B', // Main text
          900: '#0F172A',
        },
        risk: {
          low: '#16A34A',    // Green
          medium: '#D97706', // Amber
          high: '#DC2626',   // Red
          critical: '#991B1B'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 4px 0 rgba(0, 0, 0, 0.06)',
        dropdown: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        modal: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'mild': '6px',
      }
    },
  },
  plugins: [],
}
