import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const type = String(formData.get('type') ?? 'lesson')
  const subject = String(formData.get('subject') ?? 'Matiere')
  const theme = String(formData.get('theme') ?? 'Theme')

  return NextResponse.json({
    ok: true,
    provider: 'mock',
    type,
    result: {
      title: `${subject} - ${theme}`,
      outline: [
        'Objectifs de la seance',
        'Activite guidee',
        'Exercice individuel',
        'Evaluation rapide',
      ],
    },
  })
}
