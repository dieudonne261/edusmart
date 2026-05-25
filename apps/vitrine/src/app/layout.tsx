import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FONT GEIST — Auto-hébergée, chargée via next/font/local
 * ─────────────────────────────────────────────────────────────────────────────
 *  Identique au layout admin — voir les commentaires détaillés là-bas.
 *  Le `.ttf` est copié dans `apps/vitrine/src/app/fonts/` car Next.js
 *  n'aime pas charger des assets situés hors du dossier de l'app.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const geist = localFont({
  src: './fonts/Geist-VariableFont_wght.ttf',
  variable: '--font-geist',
  display: 'swap',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'EduSmart Vitrine',
  description: 'Vitrines scolaires multi-écoles pour EduSmart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={geist.variable}>
      <body>{children}</body>
    </html>
  )
}
