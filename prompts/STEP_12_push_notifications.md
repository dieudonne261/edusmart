# PROMPT CLAUDE — ÉTAPE 12 : Notifications push Realtime (Supabase + Expo)

> 🎯 **OBJECTIF** : Permettre d'avertir instantanément les parents et élèves lors de la survenue d'un événement (saisie d'une note, publication d'un devoir, annonce de l'école) en combinant **Supabase Realtime** pour le rafraîchissement in-app et les **Notifications Push d'Expo** pour les alertes mobiles (iOS et Android).

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/mobile` : Expo 51 (React Native) — Application mobile
- `packages/shared` : Types et clients Supabase
- `supabase/functions/` : Dossier des Edge Functions de Supabase (Deno/TypeScript)

La base de données contient déjà la table `push_tokens` (qui lie le `user_id` de l'utilisateur mobile à son jeton push Expo unique).

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `apps/mobile/package.json` | **Modifier** | Installer les paquets d'intégration Expo Notifications. |
| `apps/mobile/lib/notifications.ts` | **Créer** | Script d'enregistrement de l'appareil mobile, demande de permissions push et envoi du token vers la table `push_tokens`. |
| `apps/mobile/lib/realtime.ts` | **Créer** | Helper d'abonnement in-app aux modifications PostgreSQL Supabase (Realtime). |
| `apps/mobile/app/_layout.tsx` | **Modifier** | Initialiser le service de notifications push lors du montage de l'application. |
| `supabase/functions/push_on_grade/index.ts` | **Créer** | Edge Function (Deno) déclenchée par un webhook sur ajout de note qui appelle l'API d'Expo pour envoyer les pushs. |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez appliquer les modifications suivantes :

### 1. Configurer Expo Notifications sur le projet Mobile
```bash
cd apps/mobile
npx expo install expo-notifications expo-device expo-constants
```

### 2. Initialiser l'Enregistrement Push (`apps/mobile/lib/notifications.ts`)
Créer la fonction `registerForPushNotificationsAsync()` qui :
*   Vérifie que l'application s'exécute sur un appareil physique (pas un émulateur).
*   Demande l'autorisation d'envoi de notifications à l'utilisateur.
*   Récupère le Token Push Expo : `(await Notifications.getExpoPushTokenAsync()).data`.
*   Effectue un `.upsert()` dans la table `push_tokens` de Supabase en associant le jeton et la plateforme (ios / android).

### 3. Activer les Abonnements Temps Réel (`apps/mobile/lib/realtime.ts`)
Développer la fonction de synchronisation in-app :
```typescript
import { supabase } from './supabase'

export function subscribeToGrades(studentIds: string[], onNewGrade: (grade: any) => void) {
  const channel = supabase
    .channel('grades-mine')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'grades',
        filter: `student_id=in.(${studentIds.join(',')})`,
      },
      (payload) => onNewGrade(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
```

### 4. Créer la Deno Edge Function pour le déclenchement de Push (`supabase/functions/push_on_grade/index.ts`)
Cette fonction Deno est déclenchée par un Webhook de base de données à chaque ajout d'une note.
*   Elle lit le record de la note insérée.
*   Elle interroge les profils des parents liés à l'élève (`parent_links`) pour extraire leurs tokens push associés dans la table `push_tokens`.
*   Elle envoie une requête HTTP POST à l'API d'Expo `https://exp.host/--/api/v2/push/send` contenant le titre, le message (ex : "Nouvelle note en Mathématiques : 16/20") et le payload de redirection.

```typescript
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const { record } = await req.json() // Payload du webhook
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Récupérer les ID des parents de l'élève
  const { data: links } = await supabase
    .from('parent_links')
    .select('parent_profile_id')
    .eq('student_id', record.student_id)

  const parentIds = links?.map(l => l.parent_profile_id) ?? []
  if (parentIds.length === 0) return new Response('No parents found')

  // 2. Extraire les tokens d'appareils de ces parents
  const { data: tokens } = await supabase
    .from('push_tokens')
    .select('token')
    .in('user_id', parentIds)

  if (!tokens || tokens.length === 0) return new Response('No tokens found')

  // 3. Préparer les messages pour l'API Expo
  const messages = tokens.map(t => ({
    to: t.token,
    sound: 'default',
    title: 'Nouvelle note disponible',
    body: `Note ajoutée : ${record.value}/${record.max_value} (coef ${record.coefficient})`,
    data: { studentId: record.student_id, screen: 'grades' },
  }))

  // 4. Envoyer les pushs à Expo
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })

  return new Response('OK')
})
```

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  Au premier lancement de l'application sur un smartphone réel, une boîte de dialogue demande l'autorisation d'envoyer des notifications push.
2.  Une ligne contenant le token unique de l'appareil s'ajoute dans la table `push_tokens` de Supabase.
3.  **Test d'envoi** : Insérer une note sur le portail administrateur pour un élève : le webhook se déclenche, appelle l'Edge Function et le téléphone du parent reçoit la notification push (avec le son configuré).
4.  Cliquer sur la notification sur le mobile ouvre l'application et redirige vers l'écran des notes de l'élève.
5.  Les flux d'abonnements Realtime (`subscribeToGrades`) rafraîchissent l'interface mobile sans forcer l'utilisateur à recharger la page.
