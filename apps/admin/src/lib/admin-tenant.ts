import {
  getDefaultOrganization,
  getOrganizationBySlug,
  type Organization,
} from '@edusmart/shared'
import { headers } from 'next/headers'

export type AdminTenant = {
  school: Organization
  slug: string
  host: string
  isLocal: boolean
}

export function getAdminTenant(): AdminTenant {
  const headerStore = headers()
  const host = headerStore.get('x-host') ?? ''
  const slug = headerStore.get('x-school-slug') ?? 'strelitzia'
  const school = getOrganizationBySlug(slug) ?? getDefaultOrganization()

  return {
    school,
    slug: school.slug,
    host,
    isLocal:
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.includes('[::1]'),
  }
}

export function adminHref(path: string, slug: string, isLocal: boolean) {
  if (!isLocal) {
    return path
  }

  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}school=${slug}`
}
