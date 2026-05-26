# PROMPT CLAUDE — ÉTAPE 07 : Implémenter `/api/ai/generate` réel via OpenRouter

> 🎯 **OBJECTIF** : Remplacer le mock de génération de contenu pédagogique par une véritable intégration d'IA en streaming SSE (Server-Sent Events) via OpenRouter, avec sélection dynamique du modèle selon la tâche, stockage de l'historique dans `ai_conversations` et création de l'interface `/admin/ai-tools`.

---

## 💻 CONTEXTE DU PROJET
Vous travaillez sur **EduSmart**, une plateforme SaaS multi-école (multi-tenant) de gestion scolaire. C'est un monorepo Turborepo géré avec pnpm.
Structure du monorepo :
- `apps/admin` : Next.js 14 (portail administration)
- `packages/shared` : Types, DB helpers, client Supabase partagé (`@edusmart/shared`)

Les variables d'environnement `OPENROUTER_API_KEY` et `NEXT_PUBLIC_ROOT_DOMAIN` sont déjà déclarées.

---

## 📦 FICHIERS CONCERNÉS (À CRÉER OU MODIFIER)

| Fichier | Action | Description |
|---|---|---|
| `packages/shared/src/ai/models.ts` | **Créer** | Mapping entre la tâche demandée et le modèle d'IA OpenRouter optimal. |
| `packages/shared/src/ai/prompts.ts` | **Créer** | System prompts standardisés en français selon l'outil d'IA choisi. |
| `packages/shared/src/index.ts` | **Modifier** | Exporter les nouveaux modules d'IA. |
| `apps/admin/src/app/api/ai/generate/route.ts` | **Modifier** | Remplacer la réponse mockée par un appel streaming SSE vers OpenRouter et une persistance en base. |
| `apps/admin/src/app/ai-tools/page.tsx` | **Créer** | Interface utilisateur regroupant les 6 outils d'IA (leçons, quiz, appréciations, analyse de classe, communication parents, détection décrochage). |
| `apps/admin/src/app/ai-tools/_components/AIToolForm.tsx` | **Créer** | Composant de formulaire dynamique gérant la saisie, l'appel API et l'affichage fluide en temps réel (streaming). |

---

## ⚙️ INSTRUCTIONS DE MISE EN ŒUVRE

Veuillez appliquer les modifications suivantes dans votre espace de travail :

### 1. Mettre en place le mapping des modèles d'IA (`packages/shared/src/ai/models.ts`)
Créer la fonction `modelFor(task)` retournant le modèle OpenRouter le plus adapté en termes de coût/performance :
*   `lesson` & `appraisal` & `risk` → `anthropic/claude-3-haiku` (rapide et pas cher)
*   `quiz` & `parent_comm` → `mistralai/mistral-7b-instruct` (léger et efficace)
*   `analysis` → `anthropic/claude-3-5-sonnet` (raisonnement de haute qualité)

### 2. Standardiser les invites système (`packages/shared/src/ai/prompts.ts`)
Définir `systemPromptFor(task, args)` générant les règles et formats de sortie attendus (Markdown ou JSON) adaptés au contexte (notamment l'éducation à Madagascar).

### 3. Développer le Handler de Streaming SSE (`apps/admin/src/app/api/ai/generate/route.ts`)
*   Valider l'authentification et le rôle de l'utilisateur (seuls `teacher`, `director`, et `super_admin` sont autorisés).
*   Appeler OpenRouter avec `stream: true`.
*   Utiliser un `TransformStream` pour intercepter les chunks, reconstituer la réponse complète en mémoire, et l'insérer à la fin du flux dans la table `ai_conversations` (en liant l'utilisateur et l'organisation).
*   Renvoyer une `Response` avec les en-têtes `text/event-stream`.

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentProfile } from '@/lib/auth-helpers'
import { modelFor, systemPromptFor } from '@edusmart/shared/ai'
import { createSupabaseServerClient } from '@edusmart/shared'

const schema = z.object({
  task: z.enum(['lesson', 'quiz', 'appraisal', 'analysis', 'parent_comm', 'risk']),
  subject: z.string().optional(),
  topic:   z.string().optional(),
  level:   z.string().optional(),
  context: z.record(z.any()).optional(),
})

export async function POST(req: NextRequest) {
  const profile = await getCurrentProfile()
  if (!['teacher','director','super_admin'].includes(profile.role)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json(parsed.error.flatten(), { status: 400 })

  const { task, ...args } = parsed.data
  const model = modelFor(task)
  const systemPrompt = systemPromptFor(task, args)
  const userPrompt = JSON.stringify(args)

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'https://edusmart.site',
      'X-Title': 'EduSmart',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      stream: true,
      ...(task === 'quiz' ? { response_format: { type: 'json_object' } } : {}),
    }),
  })

  if (!upstream.ok || !upstream.body) {
    return new NextResponse('OpenRouter error', { status: 502 })
  }

  const supabase = createSupabaseServerClient()
  let buffer = ''
  
  const transformer = new TransformStream({
    transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk)
      controller.enqueue(chunk)
    },
    async flush() {
      // Nettoyer les métadonnées SSE pour ne garder que le contenu textuel brut
      const content = extractContentFromStreamBuffer(buffer)
      
      await supabase.from('ai_conversations').insert({
        organization_id: profile.organization_id,
        user_id: profile.id,
        title: `${task.toUpperCase()} - ${args.topic ?? args.subject ?? 'AI Generation'}`,
        task_type: task,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content },
        ],
      })
    },
  })

  return new Response(upstream.body.pipeThrough(transformer), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}

function extractContentFromStreamBuffer(buffer: string): string {
  // Parser les lignes "data: {...}" pour concaténer le contenu des deltas de texte
  const lines = buffer.split('\n')
  let result = ''
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const dataStr = line.slice(6).trim()
      if (dataStr === '[DONE]') continue
      try {
        const parsed = JSON.parse(dataStr)
        const text = parsed.choices?.[0]?.delta?.content ?? ''
        result += text
      } catch (e) {}
    }
  }
  return result
}
```

### 4. Interface Utilisateur `/admin/ai-tools`
Créer une page listant les fonctionnalités IA avec un sélecteur dynamique.
Créer `AIToolForm.tsx` qui :
*   Envoie la requête en JSON vers `/api/ai/generate`.
*   Lit le flux de réponse en utilisant l'API `ReadableStream` du navigateur.
*   Affiche les morceaux de texte au fur et à mesure de leur réception (streaming fluide) avec un support Markdown.

---

## ✅ VALIDATION & CRITÈRES DE COMPLÈTUDE
1.  Un utilisateur non connecté ou n'ayant pas le rôle d'enseignant/directeur reçoit une erreur `403 Forbidden` en interrogeant l'API.
2.  La soumission d'une demande de génération de cours lance une animation de chargement puis affiche le contenu se rédigeant lettre par lettre en temps réel.
3.  À la fin du flux, la table `ai_conversations` contient une nouvelle ligne traçant l'invite de départ et le texte généré par l'IA.
4.  L'outil de quiz retourne un JSON structuré valide et parseable.
