import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FONT GEIST — Auto-hébergée, chargée via next/font/local
 * ─────────────────────────────────────────────────────────────────────────────
 *  - Le fichier .ttf est versionné dans `apps/admin/src/app/fonts/`
 *    (copie identique de `packages/shared/src/Geist-VariableFont_wght.ttf`).
 *  - `next/font/local` génère un CSS optimisé + un nom de variable CSS
 *    (`--font-geist`) qu'on consomme côté Tailwind via `font-sans`.
 *  - `display: 'swap'` évite le FOIT (texte invisible pendant le chargement).
 *  - On n'utilise PAS Google Fonts pour éviter une requête externe + tracking.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const geist = localFont({
  src: './fonts/Geist-VariableFont_wght.ttf',
  variable: '--font-geist',
  display: 'swap',
  weight: '100 900', // police variable : tous les poids dispo dans un seul fichier
})

export const metadata: Metadata = {
  title: 'EduSmart Admin',
  description: 'Portail admin multi-écoles EduSmart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // La variable CSS de la font est exposée au niveau <html> pour qu'elle soit
    // accessible partout (Tailwind l'utilise via `font-sans`).
    <html lang="fr" className={geist.variable}>
      <body>{children}</body>
    </html>
  )
}
