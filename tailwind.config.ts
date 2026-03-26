import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      background: '#fdfcfb',
      foreground: '#3f3533',
      card: '#fdfbfa',
      'card-foreground': '#3f3533',
      primary: '#d97706',
      'primary-foreground': '#fefffe',
      secondary: '#0284c7',
      'secondary-foreground': '#3f3533',
      muted: '#ebe9e8',
      'muted-foreground': '#6b7280',
      accent: '#7c3aed',
      'accent-foreground': '#3f3533',
      destructive: '#dc2626',
      'destructive-foreground': '#fefffe',
      border: '#d1cecb',
      input: '#ebe9e8',
      ring: '#d97706',
      chart: {
        1: '#d97706',
        2: '#0284c7',
        3: '#7c3aed',
        4: '#16a34a',
        5: '#dc2626',
      },
      sidebar: {
        DEFAULT: '#fdfcfb',
        foreground: '#3f3533',
        primary: '#d97706',
        'primary-foreground': '#fefffe',
        accent: '#7c3aed',
        'accent-foreground': '#3f3533',
        border: '#d1cecb',
        ring: '#d97706',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        // serif: ['var(--font-serif)', 'serif'],
      },
      borderRadius: {
        lg: 'calc(var(--radius) + 4px)',
        md: 'calc(var(--radius))',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-md': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
