export type Student = {
  id: string
  organizationId: string
  firstName: string
  lastName: string
  className: string
  level: string
  status: 'active' | 'watch' | 'inactive'
  attendanceRate: number
  average: number
}
