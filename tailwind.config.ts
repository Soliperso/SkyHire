import type { Config } from 'tailwindcss'

/**
 * Single source of truth for the design system.
 * Every color, font size, radius and shadow used in the app is a token defined
 * here — components never hardcode hex values or arbitrary pixel sizes (DRY).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand "Trust Blue" — used for primary actions, links, focus rings.
        brand: {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bfd4fe',
          300: '#93b6fd',
          400: '#6494f8',
          500: '#3b76f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Neutral ink/surface scale (slate-aligned) for text and chrome.
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#080d1c',
        },
        // Semantic tokens.
        verified: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        star: '#f59e0b',
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Cyan glow accent — pairs with brand blue for gradients & highlights.
        accent: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        display: ['Sora', '"Inter Tight"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typographic hierarchy: display → h1 → h2 → h3 → body → caption.
        display: ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.55' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)',
        'card-hover': '0 4px 8px -2px rgb(15 23 42 / 0.08), 0 12px 28px -8px rgb(15 23 42 / 0.16)',
        focus: '0 0 0 3px rgb(37 99 235 / 0.35)',
        glow: '0 8px 24px -6px rgb(37 99 235 / 0.45), 0 0 0 1px rgb(56 189 248 / 0.15)',
        'glow-lg': '0 18px 50px -12px rgb(37 99 235 / 0.55)',
      },
      maxWidth: {
        container: '76rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.96)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-pan': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        aurora: 'aurora 18s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
