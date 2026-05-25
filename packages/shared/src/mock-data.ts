import type { Grade } from './types/grade'
import type { NewsArticle, Organization, Program } from './types/organization'
import type { Student } from './types/student'

export type StaffMember = {
  id: string
  organizationId: string
  fullName: string
  role: string
  department: string
}

export type AiTool = {
  id: string
  title: string
  description: string
  status: 'ready' | 'needs_key'
}

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org-strelitzia',
    slug: 'strelitzia',
    name: 'Strelitzia School',
    tagline: 'Excellence academique et suivi personnalise',
    description:
      'Une vitrine de demonstration pour une ecole pilote avec programmes, actualites et parcours familles.',
    city: 'Toamasina',
    address: 'Toamasina, Madagascar',
    phone: '+261 34 12 722 76',
    email: 'contact@edusmart.site',
    logoInitials: 'SS',
    colors: {
      primary: '#1A4D3A',
      secondary: '#C9A84C',
      surface: '#FAFAF8',
    },
    stats: {
      students: 1240,
      teachers: 68,
      successRate: 97,
      programs: 4,
    },
    createdAt: '2026-05-17',
  },
  {
    id: 'org-uaz',
    slug: 'uaz',
    name: 'Universite Adventiste Zurcher',
    tagline: 'Former, accompagner et innover avec rigueur',
    description:
      'Exemple de tenant EduSmart pour verifier que les donnees et couleurs restent bien separees par ecole.',
    city: 'Antananarivo',
    address: 'Antananarivo, Madagascar',
    phone: '+261 34 00 000 00',
    email: 'uaz@edusmart.site',
    logoInitials: 'UZ',
    colors: {
      primary: '#3F4772',
      secondary: '#C9A84C',
      surface: '#F7F8FC',
    },
    stats: {
      students: 860,
      teachers: 42,
      successRate: 94,
      programs: 5,
    },
    createdAt: '2026-05-17',
  },
]

export const PROGRAMS: Program[] = [
  {
    id: 'program-primary',
    organizationId: 'org-strelitzia',
    slug: 'primaire',
    title: 'Ecole primaire',
    level: 'CP a CM2',
    duration: '6 ans',
    description:
      'Bases solides en lecture, mathematiques, expression orale et autonomie de travail.',
    highlights: ['Suivi hebdomadaire', 'Ateliers lecture', 'Communication parents'],
  },
  {
    id: 'program-college',
    organizationId: 'org-strelitzia',
    slug: 'college',
    title: 'College',
    level: '6eme a 3eme',
    duration: '4 ans',
    description:
      'Parcours structure pour preparer les examens et detecter les difficultes tot.',
    highlights: ['Notes centralisees', 'Alertes absences', 'Bulletins rapides'],
  },
  {
    id: 'program-lycee',
    organizationId: 'org-strelitzia',
    slug: 'lycee',
    title: 'Lycee general',
    level: '2nde a Terminale',
    duration: '3 ans',
    description:
      'Preparation aux examens, orientation et accompagnement methodologique.',
    highlights: ['Orientation', 'Suivi IA', 'Preparation bac'],
  },
  {
    id: 'program-bilingual',
    organizationId: 'org-strelitzia',
    slug: 'bilingue',
    title: 'Section bilingue',
    level: 'Tous niveaux',
    duration: 'Continu',
    description:
      'Renforcement linguistique progressif pour ouvrir les parcours internationaux.',
    highlights: ['Francais', 'Anglais', 'Projets oraux'],
  },
  {
    id: 'program-uaz-master',
    organizationId: 'org-uaz',
    slug: 'master-informatique',
    title: 'Master informatique',
    level: 'M1 a M2',
    duration: '2 ans',
    description:
      'Formation avancee en ingenierie logicielle, donnees et systemes intelligents.',
    highlights: ['Memoire', 'Architecture', 'Recherche appliquee'],
  },
  {
    id: 'program-uaz-licence',
    organizationId: 'org-uaz',
    slug: 'licence',
    title: 'Licence sciences',
    level: 'L1 a L3',
    duration: '3 ans',
    description:
      'Socle scientifique et methodologique pour construire un parcours universitaire solide.',
    highlights: ['Bases scientifiques', 'Projets encadres', 'Suivi academique'],
  },
]

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-open-house',
    organizationId: 'org-strelitzia',
    slug: 'journee-portes-ouvertes',
    title: 'Journee portes ouvertes',
    excerpt:
      'Les familles peuvent visiter les classes, rencontrer les enseignants et decouvrir EduSmart.',
    category: 'Admission',
    publishedAt: '2026-05-18',
  },
  {
    id: 'news-report-cards',
    organizationId: 'org-strelitzia',
    slug: 'bulletins-numeriques',
    title: 'Bulletins numeriques en preparation',
    excerpt:
      'Le secretariat teste une generation de bulletins plus rapide et plus fiable.',
    category: 'Numerique',
    publishedAt: '2026-05-16',
  },
  {
    id: 'news-uaz-lab',
    organizationId: 'org-uaz',
    slug: 'laboratoire-projet',
    title: 'Laboratoire projet EduSmart',
    excerpt:
      'Un espace pilote sert a tester les scenarios multi-etablissements et les donnees separees.',
    category: 'Recherche',
    publishedAt: '2026-05-15',
  },
]

export const STUDENTS: Student[] = [
  {
    id: 'student-1',
    organizationId: 'org-strelitzia',
    firstName: 'Miora',
    lastName: 'Rakoto',
    className: '6eme A',
    level: 'College',
    status: 'active',
    attendanceRate: 98,
    average: 16.4,
  },
  {
    id: 'student-2',
    organizationId: 'org-strelitzia',
    firstName: 'Tiana',
    lastName: 'Rabe',
    className: '3eme B',
    level: 'College',
    status: 'watch',
    attendanceRate: 84,
    average: 10.8,
  },
  {
    id: 'student-3',
    organizationId: 'org-strelitzia',
    firstName: 'Anja',
    lastName: 'Randria',
    className: 'Terminale',
    level: 'Lycee',
    status: 'active',
    attendanceRate: 95,
    average: 14.9,
  },
  {
    id: 'student-4',
    organizationId: 'org-uaz',
    firstName: 'Donne',
    lastName: 'R.',
    className: 'M2 Informatique',
    level: 'Master',
    status: 'active',
    attendanceRate: 96,
    average: 15.7,
  },
]

export const GRADES: Grade[] = [
  {
    id: 'grade-1',
    studentId: 'student-1',
    subject: 'Mathematiques',
    score: 17,
    maxScore: 20,
    coefficient: 3,
  },
  {
    id: 'grade-2',
    studentId: 'student-1',
    subject: 'Francais',
    score: 15,
    maxScore: 20,
    coefficient: 2,
  },
  {
    id: 'grade-3',
    studentId: 'student-2',
    subject: 'Mathematiques',
    score: 9,
    maxScore: 20,
    coefficient: 3,
  },
  {
    id: 'grade-4',
    studentId: 'student-3',
    subject: 'Sciences',
    score: 16,
    maxScore: 20,
    coefficient: 2,
  },
]

export const STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    organizationId: 'org-strelitzia',
    fullName: 'Directeur Demo',
    role: 'Directeur',
    department: 'Direction',
  },
  {
    id: 'staff-2',
    organizationId: 'org-strelitzia',
    fullName: 'Mme Rasoanaivo',
    role: 'Enseignante',
    department: 'Mathematiques',
  },
  {
    id: 'staff-3',
    organizationId: 'org-uaz',
    fullName: 'Coordination UAZ',
    role: 'Responsable',
    department: 'Informatique',
  },
]

export const AI_TOOLS: AiTool[] = [
  {
    id: 'lesson',
    title: 'Generation de cours',
    description: 'Plan de lecon, objectifs, activites et evaluation rapide.',
    status: 'needs_key',
  },
  {
    id: 'quiz',
    title: 'Quiz JSON pour app kids',
    description: 'Questions structurees par classe, matiere et difficulte.',
    status: 'needs_key',
  },
  {
    id: 'appreciation',
    title: 'Appreciations de bulletin',
    description: 'Trois variantes selon moyenne, absences et progression.',
    status: 'needs_key',
  },
]

export function getOrganizationBySlug(slug: string) {
  return ORGANIZATIONS.find((organization) => organization.slug === slug)
}

export function getDefaultOrganization() {
  return ORGANIZATIONS[0]
}

export function getProgramsByOrganizationId(organizationId: string) {
  return PROGRAMS.filter((program) => program.organizationId === organizationId)
}

export function getNewsByOrganizationId(organizationId: string) {
  return NEWS_ARTICLES.filter(
    (article) => article.organizationId === organizationId,
  )
}

export function getStudentsByOrganizationId(organizationId: string) {
  return STUDENTS.filter((student) => student.organizationId === organizationId)
}

export function getStaffByOrganizationId(organizationId: string) {
  return STAFF.filter((member) => member.organizationId === organizationId)
}

export function getGradesByOrganizationId(organizationId: string) {
  const studentIds = new Set(
    getStudentsByOrganizationId(organizationId).map((student) => student.id),
  )

  return GRADES.filter((grade) => studentIds.has(grade.studentId))
}

export function resolveOrganization(slug: string | null) {
  if (!slug || slug === '__root__') {
    return getDefaultOrganization()
  }

  return getOrganizationBySlug(slug) ?? getDefaultOrganization()
}
