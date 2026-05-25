# STEP 07 — Implémenter `/api/ai/generate` réel via OpenRouter

> **Priorité** : 🟡 P2
> **Estimation** : 4-6 heures
> **Ordre** : après [STEP_06](STEP_06.md)

## 🎯 Objectif

Remplacer le mock dans `apps/admin/src/app/api/ai/generate/route.ts` par un vrai streaming SSE vers OpenRouter, avec sélection de modèle selon `task`, persistance dans `ai_conversations`, et page UI `/admin/ai-tools`.

## 📦 Fichiers concernés

| Fichier | Action |
|---|---|
| `apps/admin/src/app/api/ai/generate/route.ts` | Implémenter streaming SSE |
| `apps/admin/src/app/ai-tools/page.tsx` | 6 outils (leçon, quiz, appréciations, analyse, communication, risque) |
| `apps/admin/src/app/ai-tools/_components/AIToolForm.tsx` _(nouveau)_ | Formulaire générique + zone streaming |
| `packages/shared/src/ai/models.ts` _(nouveau)_ | Mapping `task` → modèle OpenRouter |
| `packages/shared/src/ai/prompts.ts` _(nouveau)_ | System prompts par task |

## 🔗 Dépendances

- Bloqué par : [STEP_03](STEP_03.md) (auth), [STEP_06](STEP_06.md) (DB).
- `OPENROUTER_API_KEY` configurée.

## ⚙️ Implémentation route handler streaming SSE

```ts
// apps/admin/src/app/api/ai/generate/route.ts
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

  // Pipe SSE et persiste à la fin
  const supabase = createSupabaseServerClient()
  let buffer = ''
  const transformer = new TransformStream({
    transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk)
      controller.enqueue(chunk)
    },
    async flush() {
      await supabase.from('ai_conversations').insert({
        organization_id: profile.organization_id,
        user_id: profile.id,
        messages: [
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: buffer },
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
```

## ⚙️ Mapping modèle / system prompt

```ts
// packages/shared/src/ai/models.ts
export function modelFor(task: string): string {
  const map: Record<string, string> = {
    lesson:      'anthropic/claude-3-haiku',
    quiz:        'mistralai/mistral-7b-instruct',
    appraisal:   'anthropic/claude-3-haiku',
    analysis:    'anthropic/claude-3-5-sonnet',
    parent_comm: 'mistralai/mistral-7b-instruct',
    risk:        'anthropic/claude-3-haiku',
  }
  return map[task] ?? 'anthropic/claude-3-haiku'
}
```

```ts
// packages/shared/src/ai/prompts.ts
export function systemPromptFor(task: string, args: Record<string, any>): string {
  switch (task) {
    case 'lesson':
      return `Tu es un enseignant expert. Génère une leçon de ${args.subject ?? '?'} pour le niveau ${args.level ?? '?'} sur le thème : ${args.topic ?? '?'}. Structure : Introduction, 3 parties avec exemples, exercice d'application, conclusion. Style : pédagogique, clair, adapté au contexte malgache. Sortie : markdown.`
    case 'quiz':
      return `Génère un quiz de 10 questions QCM sur ${args.topic ?? '?'} pour le niveau ${args.level ?? '?'}. Format strict JSON : { "questions": [ { "id":"q1", "question":"...", "options":["A","B","C","D"], "correct":0, "points":1 } ] }`
    case 'appraisal':
      return `Tu rédiges des appréciations de bulletin scolaire. À partir des notes et observations fournies, écris 3 versions courtes (max 50 mots chacune) : bienveillante, factuelle, motivante. Sortie : JSON { "versions": ["...", "...", "..."] }`
    case 'analysis':
      return `Tu analyses les performances d'une classe. Identifie : tendances globales (forces/faiblesses), élèves en difficulté (top 3), recommandations pédagogiques actionnables. Sortie : markdown structuré.`
    case 'parent_comm':
      return `Tu rédiges une communication courte aux parents. Ton bienveillant, concret, fr-FR. Max 100 mots. Inclus : objet, corps, formule de politesse.`
    case 'risk':
      return `À partir des données d'un élève (notes récentes, absences, retards, devoirs non rendus), calcule un score de risque de décrochage (0-100) avec 3 facteurs principaux. Sortie : JSON { "score": N, "factors": ["...", "...", "..."], "recommendation": "..." }`
    default:
      return 'Tu es un assistant pédagogique bienveillant.'
  }
}
```

## ✅ Validation

- [ ] `/api/ai/generate` accepte un body valide et stream un SSE.
- [ ] Quiz retourne du JSON parseable.
- [ ] `ai_conversations` contient la trace.
- [ ] Rôle non-teacher → 403.
- [ ] Coût mesuré : ~$0.01 par génération leçon.

## ➡️ Prochaine étape

→ [STEP_08](STEP_08.md) — App mobile (login + tabs + notes).
