/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HELPERS DATA — News (actualités de la vitrine)
 * ─────────────────────────────────────────────────────────────────────────────
 *  La policy publique ne renvoie QUE les articles `is_published = true`.
 *  Les brouillons ne sont visibles que par le staff de l'école.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createSupabaseServerClient } from '../supabase/server'
import type { Tables } from '../supabase'

/** Suffixé `Row` pour éviter le clash avec `NewsArticle` legacy (mocks). */
export type NewsArticleRow = Tables<'news_articles'>

/** Liste les articles publiés d'une école (les plus récents d'abord). */
export async function listPublishedNews(organizationId: string, limit = 10): Promise<NewsArticleRow[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[db/news] listPublishedNews', error)
    return []
  }
  return data ?? []
}

/** Récupère un article par son slug (pour la page détail). */
export async function getNewsBySlug(organizationId: string, slug: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from('news_articles')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('organization_id', organizationId)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) {
    console.error('[db/news] getNewsBySlug', error)
    return null
  }
  return data
}
