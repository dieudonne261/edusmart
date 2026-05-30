/**
 * ---------------------------------------------------------------------------
 *  / - Page d'accueil dual-mode (marketing root OU vitrine école)
 * ---------------------------------------------------------------------------
 *  - edusmart.site                -> mode 'root' (marketing global)
 *  - <slug>.edusmart.site         -> mode 'school' (vitrine de cette école)
 *
 *  Toutes les données viennent de Supabase (helpers @edusmart/shared/db).
 *  ISR 60s pour les pages publiques : modifs en DB visibles sous 1 minute
 *  sans rebuild.
 * ---------------------------------------------------------------------------
 */

import type { CSSProperties, ReactNode } from 'react'
import {
  listOrganizations,
  listProgramsByOrganization,
  listPublishedNews,
} from '@edusmart/shared'
import Image from 'next/image'
import Link from 'next/link'
import { SchoolShell } from '@/components/school-shell'
import { getTenantContext, schoolHref } from '@/lib/tenant'

export const revalidate = 60

export default async function HomePage() {
  const tenant = await getTenantContext()

  if (tenant.mode === 'root') {
    const schools = await listOrganizations()
    return <RootMarketing schools={schools} isLocal={tenant.isLocal} />
  }

  const [programs, news] = await Promise.all([
    listProgramsByOrganization(tenant.school.id),
    listPublishedNews(tenant.school.id, 3),
  ])

  return (
    <SchoolShell school={tenant.school} isLocal={tenant.isLocal} active="home">
      <main>
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
                Vitrine officielle
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
                {tenant.school.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                {tenant.school.tagline ?? tenant.school.description ?? ''}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={schoolHref('/contact', tenant.school.slug, tenant.isLocal)}
                  className="rounded-md bg-[var(--school-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Inscrire mon enfant
                </Link>
                <Link
                  href={schoolHref('/programs', tenant.school.slug, tenant.isLocal)}
                  className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Voir les programmes
                </Link>
              </div>
            </div>
            <div className="relative h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <Image
                src={
                  tenant.school.banner_url ??
                  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1400'
                }
                alt={`Bannière ${tenant.school.name}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {programs.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-[var(--school-primary)]">
                  Parcours
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">
                  Programmes disponibles
                </h2>
              </div>
              <Link
                href={schoolHref('/programs', tenant.school.slug, tenant.isLocal)}
                className="text-sm font-semibold text-[var(--school-primary)]"
              >
                Tous les programmes
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {programs.map((program) => (
                <article
                  key={program.id}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <p className="text-sm font-semibold text-[var(--school-primary)]">
                    {program.level ?? ''}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {program.description ?? ''}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        {news.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-10">
            <div className="rounded-lg bg-[var(--school-primary)] px-6 py-8 text-white md:px-8">
              <p className="text-sm font-semibold uppercase text-white/80">Actualités</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {news.slice(0, 2).map((article) => (
                  <article key={article.id} className="border-t border-white/20 pt-4">
                    <p className="text-sm text-white/70">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('fr-FR')
                        : ''}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">{article.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {article.excerpt ?? ''}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </SchoolShell>
  )
}

type SchoolListItem = Awaited<ReturnType<typeof listOrganizations>>[number]

const trustedBy = [
  'Lycée Excellence',
  'Université Horizon',
  'Collège Moderne',
  'Institut Nova',
  'Groupe Scolaire Elite',
]

const features = [
  ['Gestion des élèves', 'Dossiers, inscriptions, documents, classes et suivi individualisé depuis une interface claire.', 'EL'],
  ['Gestion des enseignants', 'Affectations, disponibilités, matières, plannings et coordination pédagogique en temps réel.', 'EN'],
  ['Emploi du temps', 'Planification rapide, conflits détectés et changements partagés instantanément avec les équipes.', 'ET'],
  ['Notes & Examens', 'Evaluations, bulletins, moyennes, appréciations et historiques académiques centralisés.', 'NE'],
  ['Comptabilité', 'Factures, paiements, relances, bourses et reporting financier pour la direction.', 'CO'],
  ['Communication parents', 'Messages, annonces, alertes et notifications ciblées pour rapprocher école et familles.', 'CP'],
]

const benefits = [
  ['Gain de temps', 'Automatisez les opérations répétitives et concentrez les équipes sur les décisions importantes.', 'GT'],
  ['Centralisation des données', 'Une source fiable pour chaque élève, enseignant, paiement, note et échange familial.', 'CD'],
  ['Décisions basées sur les données', 'Pilotez l’établissement avec des indicateurs lisibles et actionnables.', 'DD'],
]

const modules = [
  'Administration',
  'Pédagogie',
  'Finance',
  'Ressources humaines',
  'Bibliothèque',
  'Internat',
  'E-learning',
  'Rapports',
]

const stats = [
  [500, '+', 'Établissements', 0],
  [50000, '+', 'Élèves', 0],
  [5000, '+', 'Enseignants', 0],
  [99.9, '%', 'Disponibilité', 1],
] as const

const testimonials = [
  [
    'EduSmart a transformé notre pilotage quotidien. Les parents sont mieux informés et la direction dispose enfin de données fiables.',
    'Amina Benali',
    'Directrice, Lycée Excellence',
  ],
  [
    'Nous avons remplacé quatre outils dispersés par une seule plateforme claire, rapide et réellement pensée pour les équipes scolaires.',
    'Marc Laurent',
    'Secrétaire général, Institut Nova',
  ],
  [
    'Le suivi des paiements, des absences et des résultats est devenu beaucoup plus fluide sur l’ensemble de nos campus.',
    'Sarah Okafor',
    'Fondatrice, Groupe Scolaire Elite',
  ],
]

const faqs = [
  [
    'EduSmart convient-il aux groupes multi-établissements ?',
    'Oui. La plateforme gère plusieurs écoles, campus ou filiales avec des données, rôles et rapports séparés.',
  ],
  [
    'Peut-on migrer nos données existantes ?',
    'Oui. Les élèves, enseignants, classes, paiements et historiques peuvent être importés progressivement.',
  ],
  [
    'Les parents ont-ils un espace dédié ?',
    'Oui. Les familles suivent les présences, notes, annonces, paiements et messages importants.',
  ],
  [
    'La plateforme gère-t-elle la comptabilité scolaire ?',
    'Oui. EduSmart couvre facturation, encaissements, relances, bourses et tableaux de bord financiers.',
  ],
  [
    'EduSmart est-il adapté au mobile ?',
    'Oui. Les interfaces sont responsives pour ordinateur, tablette et mobile.',
  ],
  [
    'Comment démarrer une démonstration ?',
    'Demandez une démo depuis cette page. L’équipe configure ensuite un environnement adapté à votre établissement.',
  ],
]

function RootMarketing({
  schools,
  isLocal,
}: {
  schools: SchoolListItem[]
  isLocal: boolean
}) {
  const adminHref = isLocal ? '/admin' : 'https://admin.edusmart.site'

  return (
    <main className="edusmart-root min-h-screen overflow-hidden bg-white text-[#0F172A]">
      <MarketingStyles />
      <Loader />
      <div className="page-reveal">
        <Header adminHref={adminHref} />

        <section
          id="accueil"
          className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_14%_18%,rgba(96,165,250,0.24),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(37,99,235,0.16),transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] pt-32"
        >
          <FloatingBackground />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-28">
            <div className="stagger relative z-10">
              <Badge>Plateforme scolaire nouvelle génération</Badge>
              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">
                Transformez la gestion de votre établissement scolaire
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B] sm:text-xl">
                Une plateforme intelligente pour gérer élèves, enseignants, finances,
                notes, présences et communication depuis une seule interface.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/contact">Demander une démo</PrimaryLink>
                <SecondaryLink href="/inscription">Commencer gratuitement</SecondaryLink>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ['24/7', 'Supervision'],
                  ['8 min', 'Setup moyen'],
                  ['ISO', 'Sécurité'],
                ].map(([value, label]) => (
                  <GlassMini key={label} value={value} label={label} />
                ))}
              </div>
            </div>
            <HeroMockup />
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-white py-8">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-bold uppercase text-slate-500">
              Ils font confiance à EduSmart
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {trustedBy.map((name) => (
                <div
                  key={name}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-center text-sm font-black text-slate-600 transition hover:border-blue-200 hover:bg-white hover:text-[#2563EB]"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="bg-[#F8FAFC] py-20 md:py-28">
          <Container>
            <SectionIntro
              eyebrow="Fonctionnalités"
              title="Tout ce dont votre établissement a besoin"
              text="EduSmart rassemble les workflows essentiels dans une expérience fluide, rapide et premium pour chaque membre de votre communauté scolaire."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map(([title, text, icon]) => (
                <FeatureCard key={title} icon={icon} title={title} text={text} />
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-white py-20 md:py-28">
          <Container>
            <div className="reveal grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <Badge>Dashboard preview</Badge>
                <h2 className="mt-5 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                  Une vision claire de tout votre établissement.
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#64748B]">
                  Suivez inscriptions, présences, paiements et performances académiques
                  avec des tableaux de bord conçus pour décider vite.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    ['92%', 'Taux de présence'],
                    ['18%', 'Impayés réduits'],
                    ['3.2x', 'Traitement plus rapide'],
                    ['42K', 'Messages envoyés'],
                  ].map(([value, label]) => (
                    <GlassMini key={label} value={value} label={label} solid />
                  ))}
                </div>
              </div>
              <DashboardPreview />
            </div>
          </Container>
        </section>

        <section className="bg-[#F8FAFC] py-20 md:py-28">
          <Container>
            <div className="grid gap-5 lg:grid-cols-3">
              {benefits.map(([title, text, icon]) => (
                <FeatureCard key={title} icon={icon} title={title} text={text} darkIcon />
              ))}
            </div>
          </Container>
        </section>

        <section id="modules" className="bg-white py-20 md:py-28">
          <Container>
            <SectionIntro
              eyebrow="Modules"
              title="Une suite complète, prête pour chaque service"
              text="Activez les modules dont votre structure a besoin aujourd’hui, puis étendez votre système au rythme de votre croissance."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module, index) => (
                <div
                  key={module}
                  className="reveal rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-center gap-4">
                    <IconBadge>{String(index + 1).padStart(2, '0')}</IconBadge>
                    <p className="font-black text-slate-950">{module}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-[#0F172A] py-20 text-white md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.25),transparent_32%)]" />
          <Container className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, suffix, label, decimals]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur"
              >
                <p className="text-4xl font-black md:text-5xl">
                  <span data-count-to={value} data-decimals={decimals}>
                    0
                  </span>
                  {suffix}
                </p>
                <p className="mt-3 text-sm font-bold uppercase text-blue-100">{label}</p>
              </div>
            ))}
          </Container>
        </section>

        <section className="bg-[#F8FAFC] py-20 md:py-28">
          <Container>
            <SectionIntro
              eyebrow="Témoignages"
              title="Des directions plus sereines, des équipes mieux alignées"
              text="EduSmart aide les établissements à moderniser leurs opérations sans complexifier le quotidien."
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {testimonials.map(([quote, name, role]) => (
                <article
                  key={name}
                  className="reveal rounded-lg border border-white/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-500/15"
                >
                  <p className="text-sm font-black text-[#2563EB]">★★★★★</p>
                  <p className="mt-6 text-base leading-8 text-slate-700">"{quote}"</p>
                  <div className="mt-7 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-sm font-black text-white">
                      {name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-black text-slate-950">{name}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-white py-20 md:py-28">
          <Container className="max-w-4xl">
            <SectionIntro
              eyebrow="FAQ"
              title="Questions fréquentes"
              text="Tout ce qu’une direction demande avant de déplacer son système scolaire vers EduSmart."
            />
            <div className="mt-10 space-y-3">
              {faqs.map(([question, answer], index) => (
                <details
                  key={question}
                  className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm open:border-blue-200 open:shadow-xl open:shadow-blue-500/10"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-black text-slate-950">
                    {question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-[#64748B]">{answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section id="tarifs" className="relative overflow-hidden bg-[#F8FAFC] py-20 md:py-28">
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <Container>
            <div
              id="contact"
              className="reveal mx-auto max-w-5xl rounded-lg border border-blue-100 bg-white p-8 text-center shadow-2xl shadow-blue-500/10 md:p-12"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-black text-white shadow-xl shadow-blue-500/30">
                ES
              </div>
              <p className="mt-6 text-sm font-black uppercase text-[#2563EB]">
                Offre adaptée à votre établissement
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                Prêt à digitaliser votre établissement ?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#64748B]">
                Lancez une évaluation gratuite, découvrez les modules essentiels et
                construisez un déploiement aligné sur vos équipes.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <PrimaryLink href="/inscription" pulse>
                  Essayer gratuitement
                </PrimaryLink>
                <SecondaryLink href="/contact">Planifier une démonstration</SecondaryLink>
              </div>
            </div>
          </Container>
        </section>

        <Footer adminHref={adminHref} schoolsCount={schools.length} />
      </div>
      <CounterScript />
    </main>
  )
}

function Header({ adminHref }: { adminHref: string }) {
  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl transition-all duration-300"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="EduSmart">
          <Logo />
          <div className="leading-none">
            <p className="text-lg font-black text-slate-950">EduSmart</p>
            <p className="mt-1 hidden text-xs font-semibold uppercase text-slate-500 sm:block">
              School OS
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
          {[
            ['Accueil', '#accueil'],
            ['Fonctionnalités', '#fonctionnalites'],
            ['Modules', '#modules'],
            ['Tarifs', '#tarifs'],
            ['Contact', '#contact'],
          ].map(([label, href]) => (
            <a key={href} className="transition hover:text-[#2563EB]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={adminHref}
            className="hidden rounded-md px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 md:inline-flex"
          >
            Connexion
          </a>
          <Link
            href="/inscription"
            className="inline-flex rounded-md bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
          >
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </header>
  )
}

function HeroMockup() {
  return (
    <div className="reveal relative min-h-[520px] lg:min-h-[620px]">
      <FloatingCard className="left-0 top-10 hidden md:block" title="Présences" value="94.8%" />
      <FloatingCard className="right-0 top-28 hidden sm:block" title="Messages parents" value="1 284" />
      <FloatingCard className="bottom-16 left-4" title="Revenus mensuels" value="128 400 €" accent="+18%" />
      <div className="absolute inset-x-4 top-16 rounded-lg border border-white/80 bg-white/80 p-3 shadow-2xl shadow-blue-500/20 backdrop-blur-xl md:inset-x-10 md:p-4">
        <DashboardSurface compact={false} />
      </div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-blue-500/20">
      <div className="flex items-center gap-2 border-b border-white/10 px-2 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-4 h-6 flex-1 rounded-md bg-white/10" />
      </div>
      <DashboardSurface compact />
    </div>
  )
}

function DashboardSurface({ compact }: { compact: boolean }) {
  const bars = compact
    ? [52, 66, 44, 72, 81, 69, 91, 78, 88, 96, 84, 99]
    : [42, 58, 49, 72, 64, 88, 76, 92, 84]

  return (
    <div className="rounded-lg bg-white p-4 md:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-black text-slate-950">Dashboard EduSmart</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Vue direction générale
          </p>
        </div>
        <div className="hidden rounded-md bg-blue-50 px-3 py-2 text-xs font-black text-[#2563EB] sm:block">
          Live
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          ['Élèves actifs', compact ? '11.8K' : '12 840'],
          ['Enseignants', compact ? '684' : '684'],
          ['Paiements', compact ? '96%' : '97%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#F8FAFC] p-4">
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-slate-950">Évolution académique</p>
            <p className="text-xs font-bold text-emerald-600">+12.4%</p>
          </div>
          <div className="chart-bars mt-8 flex h-36 items-end gap-2">
            {bars.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-md bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-white p-4">
          <p className="text-sm font-black text-slate-950">Répartition</p>
          <div className="relative mx-auto mt-6 flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#2563EB_0_48%,#60A5FA_48%_72%,#DBEAFE_72%_100%)]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
              <div>
                <p className="text-2xl font-black text-slate-950">72%</p>
                <p className="text-xs font-bold text-slate-500">Objectif</p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-xs font-bold text-slate-500">
            <p>Primaire - 48%</p>
            <p>Secondaire - 24%</p>
            <p>Supérieur - 28%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
  darkIcon = false,
}: {
  icon: string
  title: string
  text: string
  darkIcon?: boolean
}) {
  return (
    <article className="reveal rounded-lg border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/15">
      <IconBadge dark={darkIcon}>{icon}</IconBadge>
      <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#64748B]">{text}</p>
    </article>
  )
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="reveal mx-auto max-w-3xl text-center">
      <p className="text-sm font-black uppercase text-[#2563EB]">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-[#64748B]">{text}</p>
    </div>
  )
}

function Footer({ adminHref, schoolsCount }: { adminHref: string; schoolsCount: number }) {
  return (
    <footer className="bg-[#0F172A] py-12 text-white">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo dark />
              <div>
                <p className="text-lg font-black">EduSmart</p>
                <p className="mt-1 text-sm text-slate-400">
                  Plateforme multi-établissements
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Le système d’exploitation moderne pour les écoles, collèges, lycées
              et universités ambitieuses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-300 sm:grid-cols-4">
            {[
              ['Accueil', '#accueil'],
              ['Fonctionnalités', '#fonctionnalites'],
              ['Modules', '#modules'],
              ['Tarifs', '#tarifs'],
              ['Contact', '/contact'],
              ['Inscription', '/inscription'],
              ['Connexion', adminHref],
              [schoolsCount > 0 ? `${schoolsCount} école${schoolsCount > 1 ? 's' : ''}` : 'Démo disponible', '#accueil'],
            ].map(([label, href]) => (
              <a key={`${label}-${href}`} className="hover:text-white" href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex gap-3 md:justify-end">
            {['in', 'x', 'yt'].map((network) => (
              <a
                key={network}
                href="#accueil"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-black uppercase text-slate-300 transition hover:bg-white hover:text-[#2563EB]"
                aria-label={`EduSmart ${network}`}
              >
                {network}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          Copyright 2026 EduSmart. Tous droits réservés.
        </div>
      </Container>
    </footer>
  )
}

function Loader() {
  return (
    <div className="loader fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="loader-ring absolute inset-0 rounded-full border-4 border-transparent border-t-[#2563EB]" />
          <Logo />
        </div>
        <p className="mt-5 text-xl font-black text-slate-950">EduSmart</p>
        <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-blue-100">
          <div className="loader-progress h-full rounded-full bg-[#2563EB]" />
        </div>
      </div>
    </div>
  )
}

function FloatingBackground() {
  const dots = [
    [8, 34],
    [16, 76],
    [26, 18],
    [38, 68],
    [48, 24],
    [61, 82],
    [72, 28],
    [83, 72],
    [93, 42],
    [53, 58],
  ]

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="float-shape left-[7%] top-[18%] h-16 w-16 bg-blue-200/35" />
      <span className="float-shape right-[12%] top-[16%] h-24 w-24 bg-blue-300/25" />
      <span className="float-shape bottom-[12%] left-[42%] h-20 w-20 bg-slate-200/45" />
      {dots.map(([left, top], index) => (
        <span
          key={`${left}-${top}`}
          className="floating-dot"
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `-${index * 0.7}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function FloatingCard({
  className,
  title,
  value,
  accent,
}: {
  className: string
  title: string
  value: string
  accent?: string
}) {
  return (
    <div
      className={`float-card absolute z-20 rounded-lg border border-white/80 bg-white/85 p-4 shadow-2xl shadow-blue-500/15 backdrop-blur ${className}`}
    >
      <p className="text-xs font-bold uppercase text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      {accent ? <p className="mt-1 text-xs font-bold text-emerald-600">{accent}</p> : null}
    </div>
  )
}

function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

function PrimaryLink({
  href,
  children,
  pulse = false,
}: {
  href: string
  children: ReactNode
  pulse?: boolean
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md bg-[#2563EB] px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-[#1D4ED8] ${
        pulse ? 'cta-pulse' : ''
      }`}
    >
      {children}
    </Link>
  )
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white/80 px-6 py-4 text-sm font-black text-slate-900 shadow-lg shadow-slate-200/70 backdrop-blur transition hover:-translate-y-1 hover:border-blue-200 hover:text-[#2563EB]"
    >
      {children}
    </Link>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-blue-200/80 bg-white/70 px-3 py-2 text-sm font-bold text-[#1D4ED8] shadow-sm backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
      {children}
    </div>
  )
}

function GlassMini({
  value,
  label,
  solid = false,
}: {
  value: string
  label: string
  solid?: boolean
}) {
  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        solid
          ? 'border-slate-200 bg-[#F8FAFC]'
          : 'border-white/80 bg-white/65 backdrop-blur'
      }`}
    >
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </div>
  )
}

function IconBadge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-lg text-xs font-black ${
        dark
          ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/25'
          : 'bg-blue-50 text-[#2563EB] ring-1 ring-blue-100'
      }`}
    >
      {children}
    </div>
  )
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-lg ${
        dark ? 'bg-white text-[#2563EB]' : 'bg-[#2563EB] text-white'
      } shadow-lg shadow-blue-500/25`}
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6" fill="none">
        <path
          d="M6 11.5 16 6l10 5.5-10 5.5L6 11.5Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M10 15.5v5.2c0 1.7 2.7 3.3 6 3.3s6-1.6 6-3.3v-5.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function CounterScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (() => {
            const header = document.getElementById('site-header');
            const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });

            const format = (value, decimals) => new Intl.NumberFormat('fr-FR', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            }).format(value);

            const animate = (node) => {
              const target = Number(node.dataset.countTo || 0);
              const decimals = Number(node.dataset.decimals || 0);
              const start = performance.now();
              const duration = 1800;
              const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                node.textContent = format(target * eased, decimals);
                if (progress < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            };

            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.target.dataset.counted) return;
                entry.target.dataset.counted = 'true';
                animate(entry.target);
              });
            }, { threshold: 0.45 });

            document.querySelectorAll('[data-count-to]').forEach((node) => observer.observe(node));
          })();
        `,
      }}
    />
  )
}

function MarketingStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html { scroll-behavior: smooth; }
          #site-header.is-scrolled {
            background: rgba(255,255,255,.92);
            border-color: rgba(226,232,240,.9);
            box-shadow: 0 18px 55px rgba(15,23,42,.08);
          }
          .loader { animation: loaderFade 1.5s ease forwards; }
          .loader-ring { animation: spin .85s linear infinite; }
          .loader-progress { transform-origin: left; animation: progress 1.35s ease forwards; }
          .page-reveal { opacity: 0; animation: pageReveal .6s ease forwards; animation-delay: 1.25s; }
          .stagger > * { opacity: 0; transform: translateY(24px); animation: slideUp .8s cubic-bezier(.22,1,.36,1) forwards; }
          .stagger > *:nth-child(1) { animation-delay: 1.35s; }
          .stagger > *:nth-child(2) { animation-delay: 1.46s; }
          .stagger > *:nth-child(3) { animation-delay: 1.57s; }
          .stagger > *:nth-child(4) { animation-delay: 1.68s; }
          .stagger > *:nth-child(5) { animation-delay: 1.79s; }
          .float-shape {
            position: absolute;
            border-radius: 9999px;
            filter: blur(1px);
            animation: floatShape 10s ease-in-out infinite;
          }
          .float-shape:nth-child(2) { animation-delay: -2s; animation-duration: 12s; }
          .float-shape:nth-child(3) { animation-delay: -4s; animation-duration: 14s; }
          .floating-dot {
            position: absolute;
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: rgba(37,99,235,.36);
            animation: floatDot 8s ease-in-out infinite;
          }
          .float-card { animation: floatCard 7s ease-in-out infinite; }
          .chart-bars span { transform-origin: bottom; animation: growBar 1.1s ease both; }
          .chart-bars span:nth-child(2n) { animation-delay: .12s; }
          .chart-bars span:nth-child(3n) { animation-delay: .22s; }
          .cta-pulse { animation: ctaPulse 2.8s ease-in-out infinite; }
          details summary::-webkit-details-marker { display: none; }
          @supports (animation-timeline: view()) {
            .reveal {
              opacity: 0;
              transform: translateY(28px);
              animation: revealOnScroll .8s cubic-bezier(.22,1,.36,1) forwards;
              animation-timeline: view();
              animation-range: entry 8% cover 32%;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: .001ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: .001ms !important;
            }
            .loader { display: none; }
            .page-reveal { opacity: 1; }
          }
          @keyframes loaderFade {
            0%, 82% { opacity: 1; visibility: visible; }
            100% { opacity: 0; visibility: hidden; }
          }
          @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @keyframes pageReveal { to { opacity: 1; transform: translateY(0); } }
          @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
          @keyframes revealOnScroll { to { opacity: 1; transform: translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes floatShape {
            0%, 100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(18px,-24px,0) scale(1.08); }
          }
          @keyframes floatDot {
            0%, 100% { transform: translate3d(0,0,0); opacity: .28; }
            50% { transform: translate3d(10px,-16px,0); opacity: .72; }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }
          @keyframes growBar {
            from { transform: scaleY(.2); opacity: .35; }
            to { transform: scaleY(1); opacity: 1; }
          }
          @keyframes ctaPulse {
            0%, 100% { box-shadow: 0 18px 40px rgba(37,99,235,.22); }
            50% { box-shadow: 0 24px 55px rgba(37,99,235,.36); }
          }
        `,
      }}
    />
  )
}
