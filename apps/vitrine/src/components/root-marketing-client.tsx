'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AnimatePresence,
  motion,
  type Variants,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

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
] as const

const benefits = [
  ['Gain de temps', 'Automatisez les opérations répétitives et concentrez les équipes sur les décisions importantes.', 'GT'],
  ['Centralisation des données', 'Une source fiable pour chaque élève, enseignant, paiement, note et échange familial.', 'CD'],
  ['Décisions basées sur les données', 'Pilotez l’établissement avec des indicateurs lisibles et actionnables.', 'DD'],
] as const

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
] as const

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
] as const

const premiumEase = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: premiumEase } },
}

export function RootMarketingClient({
  schoolsCount,
  isLocal,
}: {
  schoolsCount: number
  isLocal: boolean
}) {
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const adminHref = isLocal ? '/admin' : 'https://admin.edusmart.site'

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1500)
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#0F172A]">
      <MarketingStyles />
      <AnimatePresence>{loading ? <Loader /> : null}</AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
        <Header adminHref={adminHref} scrolled={scrolled} />

        <section
          id="accueil"
          className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_14%_18%,rgba(96,165,250,0.24),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(37,99,235,0.16),transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] pt-32"
        >
          <FloatingBackground />
          <Container className="grid gap-12 pb-20 pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-28">
            <motion.div
              className="relative z-10"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Badge>Plateforme scolaire nouvelle génération</Badge>
              </motion.div>
              <motion.h1
                variants={item}
                className="mt-7 max-w-4xl text-4xl font-black leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl"
              >
                Transformez la gestion de votre établissement scolaire
              </motion.h1>
              <motion.p
                variants={item}
                className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B] sm:text-xl"
              >
                Une plateforme intelligente pour gérer élèves, enseignants, finances,
                notes, présences et communication depuis une seule interface.
              </motion.p>
              <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <PrimaryLink href="/contact">Demander une démo</PrimaryLink>
                <SecondaryLink href="/inscription">Commencer gratuitement</SecondaryLink>
              </motion.div>
              <motion.div variants={item} className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ['24/7', 'Supervision'],
                  ['8 min', 'Setup moyen'],
                  ['ISO', 'Sécurité'],
                ].map(([value, label]) => (
                  <GlassMini key={label} value={value} label={label} />
                ))}
              </motion.div>
            </motion.div>

            <HeroMockup />
          </Container>
        </section>

        <section className="border-y border-slate-200/80 bg-white py-8">
          <Container>
            <p className="text-center text-sm font-bold uppercase text-slate-500">
              Ils font confiance à EduSmart
            </p>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
            >
              {trustedBy.map((name) => (
                <motion.div
                  key={name}
                  variants={item}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-center text-sm font-black text-slate-600 transition hover:border-blue-200 hover:bg-white hover:text-[#2563EB]"
                >
                  {name}
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        <section id="fonctionnalites" className="bg-[#F8FAFC] py-20 md:py-28">
          <Container>
            <SectionIntro
              eyebrow="Fonctionnalités"
              title="Tout ce dont votre établissement a besoin"
              text="EduSmart rassemble les workflows essentiels dans une expérience fluide, rapide et premium pour chaque membre de votre communauté scolaire."
            />
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {features.map(([title, text, icon]) => (
                <FeatureCard key={title} icon={icon} title={title} text={text} />
              ))}
            </motion.div>
          </Container>
        </section>

        <section className="bg-white py-20 md:py-28">
          <Container>
            <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
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
            </Reveal>
          </Container>
        </section>

        <section className="bg-[#F8FAFC] py-20 md:py-28">
          <Container>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid gap-5 lg:grid-cols-3"
            >
              {benefits.map(([title, text, icon]) => (
                <FeatureCard key={title} icon={icon} title={title} text={text} darkIcon />
              ))}
            </motion.div>
          </Container>
        </section>

        <section id="modules" className="bg-white py-20 md:py-28">
          <Container>
            <SectionIntro
              eyebrow="Modules"
              title="Une suite complète, prête pour chaque service"
              text="Activez les modules dont votre structure a besoin aujourd’hui, puis étendez votre système au rythme de votre croissance."
            />
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {modules.map((module, index) => (
                <motion.div
                  key={module}
                  variants={item}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 28px 60px rgba(37, 99, 235, 0.12)',
                  }}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <IconBadge>{String(index + 1).padStart(2, '0')}</IconBadge>
                    <p className="font-black text-slate-950">{module}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-[#0F172A] py-20 text-white md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.25),transparent_32%)]" />
          <Container className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, suffix, label, decimals]) => (
              <StatCard
                key={label}
                value={value}
                suffix={suffix}
                label={label}
                decimals={decimals}
              />
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
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-12 grid gap-5 lg:grid-cols-3"
            >
              {testimonials.map(([quote, name, role]) => (
                <motion.article
                  key={name}
                  variants={item}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 30px 70px rgba(37, 99, 235, 0.16)',
                  }}
                  className="rounded-lg border border-white/80 bg-white p-7 shadow-sm"
                >
                  <p className="text-sm font-black text-[#2563EB]">★★★★★</p>
                  <p className="mt-6 text-base leading-8 text-slate-700">{quote}</p>
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
                </motion.article>
              ))}
            </motion.div>
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
                <Reveal key={question}>
                  <details
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
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="tarifs" className="relative overflow-hidden bg-[#F8FAFC] py-20 md:py-28">
          <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <Container>
            <Reveal>
              <div
                id="contact"
                className="mx-auto max-w-5xl rounded-lg border border-blue-100 bg-white p-8 text-center shadow-2xl shadow-blue-500/10 md:p-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-black text-white shadow-xl shadow-blue-500/30"
                >
                  ES
                </motion.div>
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
            </Reveal>
          </Container>
        </section>

        <Footer adminHref={adminHref} schoolsCount={schoolsCount} />
      </motion.div>
    </main>
  )
}

function Header({ adminHref, scrolled }: { adminHref: string; scrolled: boolean }) {
  return (
    <motion.header
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.8)',
        boxShadow: scrolled
          ? '0 18px 55px rgba(15, 23, 42, 0.08)'
          : '0 0 0 rgba(15, 23, 42, 0)',
      }}
      className="fixed inset-x-0 top-0 z-40 border-b border-white/60 backdrop-blur-xl"
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
    </motion.header>
  )
}

function HeroMockup() {
  return (
    <Reveal className="relative min-h-[520px] lg:min-h-[620px]">
      <FloatingCard className="left-0 top-10 hidden md:block" title="Présences" value="94.8%" />
      <FloatingCard className="right-0 top-28 hidden sm:block" title="Messages parents" value="1 284" />
      <FloatingCard className="bottom-16 left-4" title="Revenus mensuels" value="128 400 €" accent="+18%" />
      <div className="absolute inset-x-4 top-16 rounded-lg border border-white/80 bg-white/80 p-3 shadow-2xl shadow-blue-500/20 backdrop-blur-xl md:inset-x-10 md:p-4">
        <DashboardSurface compact={false} />
      </div>
    </Reveal>
  )
}

function DashboardPreview() {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      className="rounded-lg border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-blue-500/20"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-2 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <div className="ml-4 h-6 flex-1 rounded-md bg-white/10" />
      </div>
      <DashboardSurface compact />
    </motion.div>
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
          ['Enseignants', '684'],
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
          <div className="mt-8 flex h-36 items-end gap-2">
            {bars.map((height, index) => (
              <motion.span
                key={index}
                initial={{ scaleY: 0.18, opacity: 0.35 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.04 }}
                className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
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
    <motion.article
      variants={item}
      whileHover={{
        y: -8,
        scale: 1.03,
        boxShadow: '0 30px 70px rgba(37, 99, 235, 0.16)',
      }}
      className="rounded-lg border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-colors hover:border-blue-200"
    >
      <IconBadge dark={darkIcon}>{icon}</IconBadge>
      <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#64748B]">{text}</p>
    </motion.article>
  )
}

function StatCard({
  value,
  suffix,
  label,
  decimals,
}: {
  value: number
  suffix: string
  label: string
  decimals: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.45 })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 })
  const rounded = useTransform(spring, (latest) =>
    new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(latest),
  )

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      className="rounded-lg border border-white/10 bg-white/10 p-6 shadow-2xl shadow-slate-950/10 backdrop-blur"
    >
      <p className="text-4xl font-black md:text-5xl">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </p>
      <p className="mt-3 text-sm font-bold uppercase text-blue-100">{label}</p>
    </motion.div>
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
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-black uppercase text-[#2563EB]">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-[#64748B]">{text}</p>
    </Reveal>
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
              [
                schoolsCount > 0
                  ? `${schoolsCount} école${schoolsCount > 1 ? 's' : ''}`
                  : 'Démo disponible',
                '#accueil',
              ],
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
    <motion.div
      exit={{ opacity: 0, visibility: 'hidden' }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2563EB]"
          />
          <Logo />
        </div>
        <p className="mt-5 text-xl font-black text-slate-950">EduSmart</p>
        <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-blue-100">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.35, ease: 'easeInOut' }}
            className="h-full origin-left rounded-full bg-[#2563EB]"
          />
        </div>
      </div>
    </motion.div>
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
      <motion.span
        animate={{ y: [0, -24, 0], x: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[7%] top-[18%] h-16 w-16 rounded-full bg-blue-200/35 blur-[1px]"
      />
      <motion.span
        animate={{ y: [0, -18, 0], x: [0, -14, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[12%] top-[16%] h-24 w-24 rounded-full bg-blue-300/25 blur-[1px]"
      />
      <motion.span
        animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[12%] left-[42%] h-20 w-20 rounded-full bg-slate-200/45 blur-[1px]"
      />
      {dots.map(([left, top], index) => (
        <motion.span
          key={`${left}-${top}`}
          animate={{ y: [0, -16, 0], x: [0, 10, 0], opacity: [0.28, 0.72, 0.28] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * -0.7,
          }}
          className="absolute h-1.5 w-1.5 rounded-full bg-blue-600/40"
          style={{ left: `${left}%`, top: `${top}%` } as CSSProperties}
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
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className={`absolute z-20 rounded-lg border border-white/80 bg-white/85 p-4 shadow-2xl shadow-blue-500/15 backdrop-blur ${className}`}
    >
      <p className="text-xs font-bold uppercase text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      {accent ? <p className="mt-1 text-xs font-bold text-emerald-600">{accent}</p> : null}
    </motion.div>
  )
}

function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.75, ease: premiumEase }}
      className={className}
    >
      {children}
    </motion.div>
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
    <motion.div
      animate={pulse ? { scale: [1, 1.025, 1] } : undefined}
      transition={pulse ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      <Link
        href={href}
        className="inline-flex w-full items-center justify-center rounded-md bg-[#2563EB] px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-[#1D4ED8] sm:w-auto"
      >
        {children}
      </Link>
    </motion.div>
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

function MarketingStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html { scroll-behavior: smooth; }
          details summary::-webkit-details-marker { display: none; }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: .001ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: .001ms !important;
            }
          }
        `,
      }}
    />
  )
}
