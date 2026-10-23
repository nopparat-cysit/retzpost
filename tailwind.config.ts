import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          canvas: 'var(--bg-canvas, #F3F0E8)',
          raised: 'var(--bg-raised, #FBFAF6)',
          subtle: 'var(--bg-subtle, #EAE5D9)',
        },
        ink: {
          primary: 'var(--text-primary, #1A1A18)',
          secondary: 'var(--text-secondary, #52514B)',
          muted: '#76756D',
        },
        border: {
          rule: 'var(--border-rule, #D8D1C4)',
          strong: 'var(--border-strong, #1A1A18)',
        },
        brand: {
          indigo: 'var(--brand-indigo, #364165)',
          'indigo-hover': 'var(--brand-indigo-hover, #2B3452)',
        },
        accent: {
          terracotta: 'var(--accent-terracotta, #A24836)',
          ochre: 'var(--accent-ochre, #9A6715)',
        },
        semantic: {
          success: 'var(--status-success, #1D6F42)',
          'success-bg': '#E8F5EE',
          warning: 'var(--status-warning, #B54708)',
          'warning-bg': '#FEF0C7',
          error: 'var(--status-error, #B42318)',
          'error-bg': '#FEE4E2',
          info: 'var(--status-info, #175CD3)',
          'info-bg': '#EFF8FF',
        },
      },
      fontFamily: {
        display: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        editorial: '6px',
        card: '8px',
        dialog: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
