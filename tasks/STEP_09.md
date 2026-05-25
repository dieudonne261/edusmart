# STEP 09 — App kids (login QR/PIN + mini-jeux)

> **Priorité** : 🟡 P2
> **Estimation** : 16-20 heures
> **Ordre** : après [STEP_08](STEP_08.md) (réutilise les patterns mobile)

## 🎯 Objectif

`apps/kids` adaptée aux enfants 6-14 ans :
- 3 modes de login : QR Code, code court + PIN, Google OAuth.
- 4-5 mini-jeux (QCM rapide, drag-drop, mémorisation, calcul, vrai/faux).
- Sync quiz publié par admin → cache MMKV local.
- Persistance `game_scores` Supabase.

## 📦 Fichiers concernés (nouveaux)

```
apps/kids/
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   │   ├── login.tsx           ← 3 modes (QR / Code+PIN / Google)
│   │   └── qr-scanner.tsx
│   └── (game)/
│       ├── _layout.tsx
│       ├── home.tsx            ← liste des quiz disponibles
│       └── play/[quizId].tsx   ← gameplay
├── components/
│   ├── QCMGame.tsx
│   ├── DragDropGame.tsx
│   ├── MemoryGame.tsx
│   ├── ScoreScreen.tsx
│   └── CharacterAvatar.tsx
├── lib/
│   ├── supabase.ts
│   ├── mmkv-storage.ts
│   └── qr-decoder.ts
└── assets/
    └── sounds/  characters/  icons/
```

## ⚙️ Dépendances

```bash
cd apps/kids
npx expo install expo-camera expo-haptics expo-av
pnpm add react-native-mmkv react-native-svg react-native-reanimated
pnpm add bcryptjs  # validation PIN côté API
```

## ⚙️ Login QR Code

```ts
// Backend : /api/kids/qr-generator (créé par enseignant)
// payload signé JWT { student_code, organization_id, exp: 24h }
import jwt from 'jsonwebtoken'
const token = jwt.sign({ student_code, organization_id }, process.env.KIDS_QR_SECRET!, { expiresIn: '24h' })
const qrPayload = `edusmart://kids-login?token=${token}`
```

```tsx
// apps/kids/app/(auth)/qr-scanner.tsx
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions()
  if (!permission?.granted) return <Button title="Autoriser la caméra" onPress={requestPermission} />
  return (
    <CameraView
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      onBarcodeScanned={async ({ data }) => {
        const token = new URL(data).searchParams.get('token')
        const res = await fetch('https://edusmart.site/api/kids/qr-login', {
          method: 'POST', body: JSON.stringify({ token }),
        })
        const { access_token, refresh_token } = await res.json()
        await supabase.auth.setSession({ access_token, refresh_token })
        router.replace('/(game)/home')
      }}
    />
  )
}
```

## ⚙️ Mini-jeu QCM exemple

```tsx
// apps/kids/components/QCMGame.tsx
import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics'

export function QCMGame({ question, onAnswer }: { question: Question, onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <View>
      <Text style={{ fontSize: 24 }}>{question.text}</Text>
      {question.options.map((opt, i) => (
        <Pressable
          key={i}
          onPress={() => {
            setPicked(i)
            const correct = i === question.correct
            Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error)
            setTimeout(() => onAnswer(correct), 800)
          }}
          style={{
            padding: 16, margin: 8, borderRadius: 16,
            backgroundColor: picked === null ? '#fafafa' : picked === i ? (i === question.correct ? '#a3e635' : '#fca5a5') : '#fafafa',
          }}
        >
          <Text style={{ fontSize: 20 }}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  )
}
```

## ⚙️ Sync quiz (Realtime + cache MMKV)

```ts
// Pull initial + souscription Realtime
const channel = supabase
  .channel('quizzes-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'quizzes', filter: `organization_id=eq.${orgId}` },
    payload => {
      mmkv.set(`quiz:${payload.new.id}`, JSON.stringify(payload.new))
    })
  .subscribe()
```

## ✅ Validation

- [ ] 3 modes login OK.
- [ ] Caméra scan QR → session valide.
- [ ] 4 mini-jeux jouables.
- [ ] Quiz cache local accessible offline.
- [ ] Score remonté à Supabase à la prochaine connexion.
- [ ] Haptics + sons rendent l'expérience ludique.

## ➡️ Prochaine étape

→ [STEP_10](STEP_10.md) — Sync offline desktop.
