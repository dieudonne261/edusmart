import type { Grade } from '../types/grade'

export function calculateAverage(grades: Grade[]) {
  const totals = grades.reduce(
    (acc, grade) => {
      const coefficient = grade.coefficient ?? 1
      return {
        score: acc.score + (grade.score / grade.maxScore) * 20 * coefficient,
        weight: acc.weight + coefficient,
      }
    },
    { score: 0, weight: 0 },
  )

  return totals.weight === 0 ? 0 : totals.score / totals.weight
}
