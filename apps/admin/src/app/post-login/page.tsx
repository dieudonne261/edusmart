/**
 * Page transitoire après login : lit le rôle de l'utilisateur et redirige
 * vers sa page d'accueil par défaut.
 *   - super_admin / director  → /
 *   - teacher                 → /grades
 *   - secretary               → /students
 *   - parent / student        → /dashboard
 */
import { requireProfile, redirectByRole } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'

export default async function PostLoginPage() {
  const profile = await requireProfile()
  redirect(redirectByRole(profile.role))
}
