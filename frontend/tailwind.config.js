/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          glass: 'var(--bg-glass)',
          'glass-hover': 'var(--bg-glass-hover)',
        },
        border: {
          glass: 'var(--border-glass)',
          'glass-hover': 'var(--border-glass-hover)',
        },
        accent: {
          purple: 'var(--accent-purple)',
          'purple-hover': 'var(--accent-purple-hover)',
          cyan: 'var(--accent-cyan)',
          emerald: 'var(--accent-emerald)',
          amber: 'var(--accent-amber)',
          rose: 'var(--accent-rose)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
      borderRadius: {
        'glass-sm': 'var(--radius-sm)',
        'glass-md': 'var(--radius-md)',
        'glass-lg': 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        shake: 'shake 0.3s ease',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease',
        'slide-in-right': 'slide-in-right 0.3s ease',
        'count-up': 'count-up 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(124, 58, 237, 0.2)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(124, 58, 237, 0.1)' },
        },
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        'count-up': {
          from: { opacity: 0, transform: 'translateY(5px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
