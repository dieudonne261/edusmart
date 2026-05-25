# ADR-005 — OpenRouter pour les appels IA

**Statut** : ✅ Acté
**Date** : 2026-05-17
**Auteur** : Randrianarison Dieu Donné

## Contexte
EduSmart utilise plusieurs LLMs selon le besoin : leçons (Claude Haiku), quiz (Mistral), analyses (Claude Sonnet). Quelle stratégie d'appel ?

## Options envisagées
- **A** : OpenAI SDK direct + Anthropic SDK direct (2 SDKs distincts).
- **B** : OpenRouter (API unifiée vers tous les LLMs).
- **C** : LangChain + multi-providers (overhead inutile pour notre use case).
- **D** : Self-host Llama / Mistral via Replicate ou Together.ai.

## Décision
**Option B** : OpenRouter.

## Conséquences
- ✅ **Un seul SDK** (fetch standard) pour Claude, Mistral, Llama, GPT, etc.
- ✅ **Fallback automatique** : si modèle X indispo, OpenRouter retry sur Y.
- ✅ **Coûts plus bas** que les fournisseurs directs (OpenRouter négocie en gros).
- ✅ **Streaming SSE** standard pour tous les modèles.
- ✅ **Dashboard unique** pour suivre la consommation.
- ✅ **Réponse JSON structurée** (`response_format: {type:'json_object'}`) supportée.
- ❌ **Latence légèrement plus haute** (1 hop supplémentaire vs API directe, ~50ms).
- ❌ **Dépendance à OpenRouter** comme intermédiaire (single point of failure).
- ❌ **Pas tous les modèles disponibles instantanément** (parfois lag de quelques jours).

## Alternatives à revoir si...
- OpenRouter devient indisponible / change tarification → fallback aux SDKs directs (déjà installables côté serveur).
- Besoin de latence très basse → appel direct Anthropic / Mistral.
- Volume IA explose → négocier directement avec Anthropic Enterprise.
