# ADR-008 — 1 seul credential Google OAuth pour toutes les écoles

**Statut** : ✅ Acté
**Date** : 2026-05-19
**Auteur** : Randrianarison Dieu Donné

## Contexte
Chaque école pouvant utiliser Google OAuth pour les parents et enseignants, comment configurer côté Google Cloud Console ?

## Options envisagées
- **A** : 1 app Google Console par école (N apps).
- **B** : 1 app Google Console unique, redirect via `edusmart.site/auth/callback?school=<slug>`.

## Décision
**Option B** : 1 seul credential Google, callback unique sur le domaine racine.

## Conséquences
- ✅ **Une seule app à maintenir** côté Google Cloud Console.
- ✅ **Un seul écran de consentement** ("Vous allez vous connecter à edusmart.site").
- ✅ **Verification Google une seule fois** (au lieu de N).
- ✅ **Add/remove écoles instantané** (pas de config Google par école).
- ❌ **Toutes les écoles partagent les quotas Google** (50 000 / sec — largement suffisant).
- ❌ **Si le credential est compromis, toutes les écoles sont impactées** → rotation prudente.
- ❌ Le callback doit savoir router vers le bon sous-domaine (param `?school=...`).

## Implémentation

```ts
// Vitrine — bouton "Continuer avec Google"
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_AUTH_CALLBACK_URL}?school=${currentSlug}`,
  },
})

// edusmart.site/auth/callback/route.ts
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const slug = searchParams.get('school') ?? '__root__'
  await supabase.auth.exchangeCodeForSession(code)
  return NextResponse.redirect(`https://${slug}.edusmart.site/dashboard`)
}
```

## Alternatives à revoir si...
- Politique Google change et exige 1 app par "tenant" → migration vers option A.
- Une école demande un OAuth white-label avec son propre domaine.
