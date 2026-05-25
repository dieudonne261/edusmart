# STEP 10 — Sync offline desktop (IPC + SQLite + worker 5 min)

> **Priorité** : 🟡 P2
> **Estimation** : 12-16 heures
> **Ordre** : après [STEP_06](STEP_06.md)

## 🎯 Objectif

Rendre `apps/desktop` réellement fonctionnel offline :
- IPC channels Electron pour auth + data + sync + print.
- SQLite local (better-sqlite3) miroir des tables Supabase critiques.
- Worker de sync 5 min (pull diff + push pending).
- UI indicateur réseau + queue pending.

## 📦 Fichiers concernés (nouveaux ou modifiés)

```
apps/desktop/
├── electron/                    ← processus main
│   ├── main.cjs                  ← (existant)
│   ├── preload.cjs               ← expose API contextBridge
│   ├── ipc/
│   │   ├── auth.cjs              ← login, logout
│   │   ├── db.cjs                ← students, grades
│   │   ├── sync.cjs              ← worker 5min
│   │   └── print.cjs             ← bulletins PDF
│   └── db/
│       ├── schema.sql            ← création SQLite local
│       └── migrations/
├── src/
│   ├── lib/
│   │   ├── ipc.ts                ← wrapper typé window.electron.api.*
│   │   └── sync-status.ts       ← store Zustand
│   └── components/
│       ├── SyncIndicator.tsx
│       └── PendingQueue.tsx
└── package.json (ajouter better-sqlite3)
```

## ⚙️ Dépendances

```bash
pnpm --filter @edusmart/desktop add better-sqlite3 electron-store
pnpm --filter @edusmart/desktop add -D @types/better-sqlite3 electron-rebuild
```

Après install : `pnpm --filter @edusmart/desktop exec electron-rebuild` (compile native bindings).

## ⚙️ preload.cjs (contextBridge)

```js
// apps/desktop/electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  auth: {
    login:  (email, pwd) => ipcRenderer.invoke('auth:login', { email, pwd }),
    logout: ()            => ipcRenderer.invoke('auth:logout'),
  },
  db: {
    studentsList: ()      => ipcRenderer.invoke('db:students:list'),
    gradesSave:   (data)  => ipcRenderer.invoke('db:grades:save', data),
  },
  sync: {
    tick:       ()        => ipcRenderer.invoke('sync:tick'),
    onStatus:   (cb)      => ipcRenderer.on('sync:status', (_, status) => cb(status)),
    getPending: ()        => ipcRenderer.invoke('sync:pending'),
  },
  print: {
    bulletin: (studentId, period) => ipcRenderer.invoke('print:bulletin', { studentId, period }),
  },
})
```

## ⚙️ Schéma SQLite miroir

```sql
-- apps/desktop/electron/db/schema.sql
create table if not exists students (
  id text primary key,
  organization_id text not null,
  student_code text not null,
  first_name text not null,
  last_name text not null,
  class_id text,
  level text,
  status text default 'active',
  attendance_rate real,
  average real,
  updated_at integer,           -- unix ms UTC
  pending_sync integer default 0
);

create table if not exists grades (
  id text primary key,
  organization_id text not null,
  student_id text not null,
  subject text,
  value real,
  max_value real default 20,
  coefficient real default 1,
  period text,
  recorded_at integer,
  updated_at integer,
  pending_sync integer default 0
);

create index if not exists idx_students_org on students(organization_id);
create index if not exists idx_grades_student on grades(student_id);
create index if not exists idx_pending on grades(pending_sync);
```

## ⚙️ Worker sync 5 min

```js
// apps/desktop/electron/ipc/sync.cjs
const { ipcMain } = require('electron')
const Database = require('better-sqlite3')
const { createClient } = require('@supabase/supabase-js')

const db = new Database('edusmart-local.db')
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

async function tick() {
  const lastSync = db.prepare('select max(updated_at) as m from students').get().m ?? 0

  // PULL — diff depuis dernière sync
  const { data: remote } = await supabase
    .from('students')
    .select('*')
    .gt('updated_at', new Date(lastSync).toISOString())

  const upsert = db.prepare(`insert or replace into students
    (id, organization_id, student_code, first_name, last_name, class_id, level, status, attendance_rate, average, updated_at, pending_sync)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`)
  remote?.forEach(r => upsert.run(r.id, r.organization_id, r.student_code, r.first_name, r.last_name, r.class_id, r.level, r.status, r.attendance_rate, r.average, new Date(r.updated_at).getTime()))

  // PUSH — lignes pending
  const pending = db.prepare('select * from grades where pending_sync = 1').all()
  for (const g of pending) {
    const { error } = await supabase.from('grades').upsert({
      id: g.id, organization_id: g.organization_id, student_id: g.student_id,
      subject: g.subject, value: g.value, max_value: g.max_value, coefficient: g.coefficient,
      period: g.period, recorded_at: new Date(g.recorded_at).toISOString(),
    })
    if (!error) db.prepare('update grades set pending_sync = 0 where id = ?').run(g.id)
  }
}

ipcMain.handle('sync:tick',    tick)
ipcMain.handle('sync:pending', () => db.prepare('select count(*) as c from grades where pending_sync = 1').get().c)
setInterval(() => tick().catch(e => console.error('[sync]', e)), 5 * 60 * 1000)
```

## ⚙️ UI indicateur

```tsx
// apps/desktop/src/components/SyncIndicator.tsx
import { useEffect, useState } from 'react'

export function SyncIndicator() {
  const [online, setOnline] = useState(navigator.onLine)
  const [pending, setPending] = useState(0)

  useEffect(() => {
    window.addEventListener('online',  () => setOnline(true))
    window.addEventListener('offline', () => setOnline(false))
    const id = setInterval(() => window.api.sync.getPending().then(setPending), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={online ? 'text-green-600' : 'text-orange-600'}>
      {online ? '✓ En ligne' : '⚠ Hors-ligne'} — {pending} en attente
    </div>
  )
}
```

## ✅ Validation

- [ ] `pnpm --filter @edusmart/desktop dev` lance app + sync 5min.
- [ ] Saisir une note offline → ligne en SQLite avec `pending_sync=1`.
- [ ] Reconnecter → ligne uploadée → `pending_sync=0`.
- [ ] Conflit (modif distant + local) résolu par `updated_at` plus récent.
- [ ] Indicateur visuel synchro et queue pending.

## ➡️ Prochaine étape

→ [STEP_11](STEP_11.md) — Bulletins PDF + impression depuis desktop.
