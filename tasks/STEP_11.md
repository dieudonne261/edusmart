# STEP 11 — Génération de bulletins PDF + impression

> **Priorité** : 🟢 P3
> **Estimation** : 6-8 heures
> **Ordre** : après [STEP_06](STEP_06.md) et [STEP_10](STEP_10.md)

## 🎯 Objectif

Générer des bulletins PDF par élève par période, depuis :
- **Admin web** : bouton "Télécharger bulletin" → PDF dans Supabase Storage + lien signé.
- **Desktop** : impression directe sur imprimante locale (offline OK).

## 📦 Fichiers concernés (nouveaux)

```
packages/shared/src/pdf/
├── BulletinTemplate.tsx       ← composant React PDF
├── generateBulletin.ts        ← façade : props → Buffer PDF
└── types.ts                    ← BulletinData type

apps/admin/src/app/api/bulletin/
└── [studentId]/[period]/route.ts  ← GET → PDF stream + Storage upload

apps/desktop/electron/ipc/print.cjs
└── handleBulletinPrint(studentId, period) → generate PDF → BrowserWindow.print()
```

## ⚙️ Dépendances

```bash
pnpm --filter @edusmart/shared add @react-pdf/renderer
```

## ⚙️ Template PDF

```tsx
// packages/shared/src/pdf/BulletinTemplate.tsx
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page:     { padding: 40, fontFamily: 'Helvetica', fontSize: 11 },
  header:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: '2 solid #1A4D3A', paddingBottom: 10 },
  logo:     { width: 60, height: 60 },
  title:    { fontSize: 18, color: '#1A4D3A', fontWeight: 'bold' },
  meta:     { marginBottom: 14, color: '#666' },
  table:    { marginTop: 16 },
  row:      { flexDirection: 'row', borderBottom: '1 solid #eee', paddingVertical: 6 },
  cellSubj: { flex: 3 },
  cellNote: { flex: 1, textAlign: 'right' },
  footer:   { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 9, color: '#999', textAlign: 'center' },
})

export function BulletinTemplate({ data }: { data: BulletinData }) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{data.organization.name}</Text>
            <Text>{data.organization.address}</Text>
          </View>
          {data.organization.logo_url && <Image src={data.organization.logo_url} style={styles.logo} />}
        </View>

        <View style={styles.meta}>
          <Text>Bulletin de notes — {data.period}</Text>
          <Text>Élève : {data.student.first_name} {data.student.last_name}</Text>
          <Text>Classe : {data.student.class_id}</Text>
          <Text>Code : {data.student.student_code}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, { fontWeight: 'bold' }]}>
            <Text style={styles.cellSubj}>Matière</Text>
            <Text style={styles.cellNote}>Note</Text>
            <Text style={styles.cellNote}>Coef</Text>
          </View>
          {data.grades.map(g => (
            <View key={g.id} style={styles.row}>
              <Text style={styles.cellSubj}>{g.subject}</Text>
              <Text style={styles.cellNote}>{g.value} / {g.max_value}</Text>
              <Text style={styles.cellNote}>{g.coefficient}</Text>
            </View>
          ))}
          <View style={[styles.row, { fontWeight: 'bold', backgroundColor: '#fafaf8' }]}>
            <Text style={styles.cellSubj}>Moyenne générale</Text>
            <Text style={styles.cellNote}>{data.average.toFixed(2)} / 20</Text>
            <Text style={styles.cellNote} />
          </View>
        </View>

        {data.appreciation && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Appréciation générale</Text>
            <Text>{data.appreciation}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Bulletin généré le {new Date().toLocaleDateString('fr-FR')} via EduSmart — {data.organization.name}
        </Text>
      </Page>
    </Document>
  )
}
```

## ⚙️ Route handler admin

```ts
// apps/admin/src/app/api/bulletin/[studentId]/[period]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { BulletinTemplate, type BulletinData } from '@edusmart/shared/pdf'
import { createSupabaseServerClient } from '@edusmart/shared'

export async function GET(_: NextRequest, { params }: { params: { studentId: string, period: string } }) {
  const supabase = createSupabaseServerClient()
  const { data: student } = await supabase.from('students').select('*, organizations(*)').eq('id', params.studentId).single()
  const { data: grades  } = await supabase.from('grades').select('*').eq('student_id', params.studentId).eq('period', params.period)

  if (!student || !grades) return new NextResponse('Not found', { status: 404 })

  const data: BulletinData = {
    organization: student.organizations,
    student,
    period: params.period,
    grades,
    average: calculateAverage(grades),
  }

  const stream = await renderToStream(<BulletinTemplate data={data} />)
  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="bulletin-${student.student_code}-${params.period}.pdf"`,
    },
  })
}
```

## ⚙️ Impression desktop

```js
// apps/desktop/electron/ipc/print.cjs
const { ipcMain, BrowserWindow } = require('electron')
const { generateBulletin } = require('@edusmart/shared/pdf')
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

ipcMain.handle('print:bulletin', async (_, { studentId, period }) => {
  // 1. Récupérer data depuis SQLite local
  const data = collectBulletinData(studentId, period)  // à implémenter
  // 2. Générer PDF dans fichier temporaire
  const tmpPath = path.join(app.getPath('temp'), `bulletin-${studentId}.pdf`)
  await generateBulletin(data, tmpPath)
  // 3. Ouvrir dans BrowserWindow et imprimer
  const win = new BrowserWindow({ show: false })
  await win.loadFile(tmpPath)
  win.webContents.print({ silent: false }, success => {
    if (success) console.log('Imprimé')
    win.destroy()
  })
  return tmpPath
})
```

## ✅ Validation

- [ ] `GET /api/bulletin/<id>/T1` retourne un PDF valide.
- [ ] Desktop : clic "Imprimer bulletin" → dialog imprimante → ressort papier OK.
- [ ] Texte affiche bien les caractères accentués (Helvetica supporte).
- [ ] Logo école visible si présent.
- [ ] PDF stocké dans Supabase Storage `bulletins/<orga>/<student>/<period>.pdf` (admin web).

## ➡️ Prochaine étape

→ [STEP_12](STEP_12.md) — Notifications push Realtime.
