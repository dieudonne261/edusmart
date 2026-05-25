# STEP 12 — Notifications push Realtime (Supabase + Expo)

> **Priorité** : 🟡 P2
> **Estimation** : 6-8 heures
> **Ordre** : après [STEP_08](STEP_08.md)

## 🎯 Objectif

Notifier en temps réel les utilisateurs :
- **Parents** : nouvelle note saisie pour leur enfant.
- **Élèves** : nouveau devoir / quiz publié.
- **Tous** : nouvel article news publié.

Stack : **Supabase Realtime** (broadcast SQL changes) + **Expo Notifications** (push iOS/Android).

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `apps/mobile/lib/notifications.ts` _(nouveau)_ | Setup Expo + permissions + token |
| `apps/mobile/lib/realtime.ts` _(nouveau)_ | Subscribe channels Supabase |
| `apps/mobile/app/_layout.tsx` | Wrapper qui boot push + realtime |
| `apps/admin/src/app/api/push/send/route.ts` _(nouveau)_ | Endpoint Expo Push API |
| Supabase : nouvelle table `push_tokens` |
| Supabase : trigger DB → Edge Function → push |

## ⚙️ Setup Expo

```bash
cd apps/mobile
npx expo install expo-notifications expo-device expo-constants
```

```ts
// apps/mobile/lib/notifications.ts
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from './supabase'

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return null
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return null

  const token = (await Notifications.getExpoPushTokenAsync()).data
  // Persiste en DB pour qu'on puisse pousser depuis le backend
  const { data: { user } } = await supabase.auth.getUser()
  if (user) await supabase.from('push_tokens').upsert({ user_id: user.id, token, platform: Platform.OS })
  return token
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true,
  }),
})
```

## ⚙️ Supabase — table + trigger

```sql
create table push_tokens (
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  platform text not null,
  created_at timestamptz default now(),
  primary key (user_id, token)
);
alter table push_tokens enable row level security;
create policy "own_tokens" on push_tokens for all using (user_id = auth.uid());
```

## ⚙️ Edge Function push (Deno)

```ts
// supabase/functions/push_on_grade/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const { record } = await req.json()  // payload database webhook (new grade)

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Trouver les parents de l'élève → leurs push tokens
  const { data: parents } = await supabase
    .from('profiles')
    .select('id, full_name, push_tokens(token)')
    .eq('role', 'parent')
    .in('id', /* fonction qui retourne les parent_ids du student_id */ [])

  const messages = parents?.flatMap(p =>
    (p.push_tokens ?? []).map(t => ({
      to: t.token,
      title: 'Nouvelle note',
      body: `${record.subject} : ${record.value}/${record.max_value}`,
      data: { studentId: record.student_id },
    }))
  ) ?? []

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })

  return new Response('OK')
})
```

## ⚙️ Database Webhook Supabase

Dashboard → Database → Webhooks → Add :
- Table : `grades`
- Events : `INSERT`, `UPDATE`
- Type : HTTP Request
- URL : `https://<project>.supabase.co/functions/v1/push_on_grade`
- HTTP Header : `Authorization: Bearer <service-role-key>`

## ⚙️ Realtime côté mobile

```ts
// apps/mobile/lib/realtime.ts
import { supabase } from './supabase'

export function subscribeToGrades(studentIds: string[], onNew: (grade) => void) {
  const channel = supabase
    .channel('grades-mine')
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'grades',
      filter: `student_id=in.(${studentIds.join(',')})`,
    }, payload => onNew(payload.new))
    .subscribe()
  return () => supabase.removeChannel(channel)
}
```

## ✅ Validation

- [ ] Permission push demandée au premier launch.
- [ ] Token enregistré en `push_tokens`.
- [ ] Création d'une note admin → push reçu sur mobile parent.
- [ ] Tap notification → ouvre l'écran notes du bon enfant.
- [ ] Désinstallation app → token nettoyé (FCM/APN error → cron delete).

## ➡️ Prochaine étape

→ [STEP_13](STEP_13.md) — Tests automatisés.
