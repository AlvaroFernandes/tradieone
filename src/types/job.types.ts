export const JOB_PRIORITIES = ['Urgent', 'Normal'] as const
export type JobPriority = (typeof JOB_PRIORITIES)[number]

export const JOB_STATUSES = ['Draft', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export interface JobAssignee {
  name: string
  initials: string
  color: string
}

export interface JobRow {
  id: string
  code: string
  name: string
  initials: string
  client: string
  scheduledDate: string
  scheduledTime: string
  priority: JobPriority
  status: JobStatus
  progress: number
  value: number
  assignees: JobAssignee[]
}
