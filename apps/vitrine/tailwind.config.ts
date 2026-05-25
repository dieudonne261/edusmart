import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-deep': '#1A4D3A',
        gold: '#C9A84C',
        cream: '#FAFAF8',
      },
      fontFamily: {
        /* Geist via next/font/local — cf. layout.tsx pour le détail. */
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
