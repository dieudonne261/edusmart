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
        /*
         * `font-sans` (utilitaire Tailwind par défaut) pointe désormais sur
         * Geist, fournie en variable CSS par next/font/local (layout.tsx).
         * Quand Next.js n'a pas encore hydraté le <html>, on retombe sur la
         * stack système — pas de FOUT.
         */
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
