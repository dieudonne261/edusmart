# STEP 08 — Démarrer l'app mobile (login + tabs + écran notes)

> **Priorité** : 🟡 P2
> **Estimation** : 12-16 heures
> **Ordre** : après [STEP_04](STEP_04.md)

## 🎯 Objectif

`apps/mobile` (Expo SDK 51) avec :
- Login email/password + Magic Link Supabase.
- Tabs : Notes / Devoirs / Messages / Profil.
- Écran notes avec graphique évolution.
- Stockage session sécurisé (Keychain/Keystore).

## 📦 Fichiers concernés (nouveaux)

```
apps/mobile/
├── app/                          ← Expo Router file-based
│   ├── _layout.tsx              ← provider Supabase + theme
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── magic-link-sent.tsx
│   └── (tabs)/
│       ├── _layout.tsx          ← Tab.Navigator
│       ├── index.tsx            ← Notes
│       ├── homework.tsx
│       ├── messages.tsx
│       └── profile.tsx
├── components/
│   ├── GradesChart.tsx
│   ├── GradesList.tsx
│   └── EmptyState.tsx
├── lib/
│   ├── supabase.ts              ← createSupabaseAnonClient + persistance secure-store
│   └── auth-context.tsx
└── app.json                     ← config Expo
```

## 🔗 Dépendances

- Bloqué par : [STEP_01](STEP_01.md), [STEP_03](STEP_03.md), [STEP_04](STEP_04.md).
- `expo-secure-store`, `expo-router`, `@react-navigation/bottom-tabs`, `victory-native` ou `react-native-chart-kit`.

## ⚙️ Setup

```bash
cd apps/mobile
npx expo install expo-router expo-secure-store expo-linking
npx expo install @react-navigation/native @react-navigation/bottom-tabs
pnpm add @supabase/supabase-js
pnpm add react-native-mmkv  # si besoin de cache rapide
pnpm add victory-native     # graphiques
```

## ⚙️ Client Supabase avec secure-store

```ts
// apps/mobile/lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem:    (key: string) => SecureStore.getItemAsync(key),
  setItem:    (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
)
```

## ⚙️ Écran login

```tsx
// apps/mobile/app/(auth)/login.tsx
import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) return setError(error.message)
    router.replace('/(tabs)')
  }

  async function magicLink() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) return setError(error.message)
    router.replace('/(auth)/magic-link-sent')
  }

  return (
    <View>
      <TextInput placeholder="Email"        value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Mot de passe" value={pass}  onChangeText={setPass}  secureTextEntry />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Se connecter" onPress={signIn} />
      <Button title="Magic Link"   onPress={magicLink} />
    </View>
  )
}
```

## ⚙️ Tabs

```tsx
// apps/mobile/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index"    options={{ title: 'Notes' }} />
      <Tabs.Screen name="homework" options={{ title: 'Devoirs' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profil' }} />
    </Tabs>
  )
}
```

## ✅ Validation

- [ ] App lance sur Expo Go (`pnpm --filter @edusmart/mobile start`).
- [ ] Login email/password fonctionne.
- [ ] Magic Link reçu + ouverture deep-link → app.
- [ ] Tabs naviguent.
- [ ] Notes parent : voit uniquement les notes de ses enfants (RLS).
- [ ] Session persistée après kill app (secure-store).

## ➡️ Prochaine étape

→ [STEP_09](STEP_09.md) — App kids (QR + PIN + mini-jeux).
→ [STEP_12](STEP_12.md) — Notifications push.
