export type Organization = {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  city: string
  address: string
  phone: string
  email: string
  logoInitials: string
  colors: {
    primary: string
    secondary: string
    surface: string
  }
  stats: {
    students: number
    teachers: number
    successRate: number
    programs: number
  }
  createdAt: string
}

export type Program = {
  id: string
  organizationId: string
  slug: string
  title: string
  level: string
  duration: string
  description: string
  highlights: string[]
}

export type NewsArticle = {
  id: string
  organizationId: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
}
