import { useMemo, useState } from 'react'
import './styles.css'

type Theme = 'light' | 'dark'

type Metric = {
  label: string
  value: string
  hint: string
  tone: 'default' | 'success' | 'warning'
}

type QueueItem = {
  title: string
  owner: string
  status: 'Pret' | 'A verifier' | 'Brouillon'
  time: string
}

type StudentRow = {
  name: string
  className: string
  attendance: string
  balance: string
  status: 'A jour' | 'Relance' | 'Dossier'
}

const metrics: Metric[] = [
  {
    label: 'Eleves actifs',
    value: '1 240',
    hint: '+18 inscriptions ce mois',
    tone: 'success',
  },
  {
    label: 'Dossiers a traiter',
    value: '32',
    hint: '12 urgents avant 16:00',
    tone: 'warning',
  },
  {
    label: 'Paiements suivis',
    value: '86%',
    hint: 'Mise a jour locale',
    tone: 'default',
  },
  {
    label: 'Synchro offline',
    value: '18 min',
    hint: 'Dernier passage reussi',
    tone: 'success',
  },
]

const queueItems: QueueItem[] = [
  {
    title: 'Bulletins 6eme A',
    owner: 'Secretariat',
    status: 'Pret',
    time: '09:30',
  },
  {
    title: 'Justificatifs absence',
    owner: 'Vie scolaire',
    status: 'A verifier',
    time: '10:15',
  },
  {
    title: 'Certificats scolarite',
    owner: 'Accueil',
    status: 'Brouillon',
    time: '11:00',
  },
]

const students: StudentRow[] = [
  {
    name: 'Miora Rakoto',
    className: '6eme A',
    attendance: '98%',
    balance: '0 Ar',
    status: 'A jour',
  },
  {
    name: 'Tiana Rabe',
    className: '3eme B',
    attendance: '84%',
    balance: '120 000 Ar',
    status: 'Relance',
  },
  {
    name: 'Anja Randria',
    className: 'Terminale',
    attendance: '95%',
    balance: '45 000 Ar',
    status: 'Dossier',
  },
]

const navItems = ['Accueil', 'Eleves', 'Paiements', 'Bulletins', 'Synchro']

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function Button({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
}) {
  return (
    <button
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'default' &&
          'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'outline' &&
          'border border-border bg-background text-foreground hover:bg-muted',
        variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
      type="button"
    >
      {children}
    </button>
  )
}

function Badge({
  children,
  tone = 'default',
}: {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'warning'
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md border px-2 py-1 text-xs font-medium',
        tone === 'default' && 'border-border bg-muted text-muted-foreground',
        tone === 'success' &&
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
        tone === 'warning' &&
          'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
      )}
    >
      {children}
    </span>
  )
}

function ThemeSwitch({
  theme,
  onToggle,
}: {
  theme: Theme
  onToggle: () => void
}) {
  return (
    <button
      aria-label="Changer le theme"
      aria-pressed={theme === 'dark'}
      className="relative h-6 w-11 rounded-full border border-border bg-muted transition-colors"
      onClick={onToggle}
      type="button"
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform',
          theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [activeTab, setActiveTab] = useState('Aujourd hui')

  const currentQueue = useMemo(() => {
    return activeTab === 'En retard'
      ? queueItems.filter((item) => item.status !== 'Pret')
      : queueItems
  }, [activeTab])

  return (
    <main className="min-h-screen bg-background text-foreground" data-theme={theme}>
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-card lg:block">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-sm font-bold">
                ES
              </div>
              <div>
                <p className="font-semibold leading-tight">EduSmart Desktop</p>
                <p className="text-sm text-muted-foreground">Secretariat offline</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1 p-3">
            {navItems.map((item, index) => (
              <button
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  index === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                key={item}
                type="button"
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mx-3 mt-4 rounded-md border border-border bg-background p-3">
            <p className="text-sm font-medium">Mode local</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Les donnees ci-dessous sont du mock data pour preparer les ecrans.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="border-b border-border bg-card">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Strelitzia School
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal">
                  Tableau de bord secretariat
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Exporter</Button>
                <Button>Nouveau dossier</Button>
                <ThemeSwitch
                  onToggle={() =>
                    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
                  }
                  theme={theme}
                />
              </div>
            </div>
          </header>

          <div className="space-y-5 p-4 sm:p-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <article
                  className="rounded-md border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-none"
                  key={metric.label}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <Badge tone={metric.tone}>
                      {metric.tone === 'success'
                        ? 'OK'
                        : metric.tone === 'warning'
                          ? 'Action'
                          : 'Info'}
                    </Badge>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-normal">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{metric.hint}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-md border border-border bg-card">
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Files du jour</h2>
                    <p className="text-sm text-muted-foreground">
                      Taches rapides pour l equipe administrative.
                    </p>
                  </div>
                  <div className="inline-flex rounded-md border border-border bg-muted p-1">
                    {['Aujourd hui', 'En retard'].map((tab) => (
                      <button
                        className={cn(
                          'rounded px-3 py-1.5 text-sm font-medium transition-colors',
                          activeTab === tab
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        type="button"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {currentQueue.map((item) => (
                    <div
                      className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                      key={item.title}
                    >
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.owner} - {item.time}
                        </p>
                      </div>
                      <Badge
                        tone={
                          item.status === 'Pret'
                            ? 'success'
                            : item.status === 'A verifier'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-md border border-dashed border-border bg-card p-4">
                <div className="flex h-full min-h-64 flex-col items-start justify-between gap-6">
                  <div>
                    <Badge>Composant vide</Badge>
                    <h2 className="mt-4 text-lg font-semibold">
                      Zone de synchronisation
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Emplacement pret pour afficher les conflits offline, les imports
                      CSV ou les derniers changements non envoyes au serveur.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Importer CSV</Button>
                    <Button variant="ghost">Voir journal</Button>
                  </div>
                </div>
              </article>
            </section>

            <section className="rounded-md border border-border bg-card">
              <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Eleves recents</h2>
                  <p className="text-sm text-muted-foreground">
                    Mock data pour valider la densite des tableaux.
                  </p>
                </div>
                <Button variant="outline">Filtrer</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nom</th>
                      <th className="px-4 py-3 font-medium">Classe</th>
                      <th className="px-4 py-3 font-medium">Presence</th>
                      <th className="px-4 py-3 font-medium">Solde</th>
                      <th className="px-4 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map((student) => (
                      <tr key={student.name}>
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {student.className}
                        </td>
                        <td className="px-4 py-3">{student.attendance}</td>
                        <td className="px-4 py-3">{student.balance}</td>
                        <td className="px-4 py-3">
                          <Badge
                            tone={
                              student.status === 'A jour'
                                ? 'success'
                                : student.status === 'Relance'
                                  ? 'warning'
                                  : 'default'
                            }
                          >
                            {student.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}
