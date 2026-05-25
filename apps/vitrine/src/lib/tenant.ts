import {
  getDefaultOrganization,
  getOrganizationBySlug,
  type Organization,
} from '@edusmart/shared'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export type TenantContext =
  | {
      mode: 'root'
      host: string
      isLocal: boolean
      school: Organization
      slug: '__root__'
    }
  | {
      mode: 'school'
      host: string
      isLocal: boolean
      school: Organization
      slug: string
    }

export function getTenantContext(): TenantContext {
  const headerStore = headers()
  const slug = headerStore.get('x-school-slug') ?? '__root__'
  const host = headerStore.get('x-host') ?? ''
  const isLocal =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('[::1]')

  if (slug === '__root__') {
    return {
      mode: 'root',
      host,
      isLocal,
      school: getDefaultOrganization(),
      slug,
    }
  }

  const school = getOrganizationBySlug(slug)

  if (!school) {
    notFound()
  }

  return {
    mode: 'school',
    host,
    isLocal,
    school,
    slug,
  }
}

export function schoolHref(path: string, slug: string, isLocal: boolean) {
  if (!isLocal) {
    return path
  }

  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}school=${slug}`
}
