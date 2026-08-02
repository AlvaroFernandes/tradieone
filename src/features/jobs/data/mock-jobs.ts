import type { JobAssignee, JobPriority, JobRow, JobStatus } from '@/types/job.types'

// No Jobs API exists yet — this is local placeholder data so the page can be
// designed and swapped for a real fetch once the backend endpoint lands.

const JOB_NAMES = [
  'Kitchen Renovation',
  'Inspect Building Outside',
  'Monitor Mall Area',
  'Check Own Attributes',
  'Check Visitor',
  'Checking Asset',
  'Patrols Parking Lots',
  'Bathroom Remodel',
  'Roof Repair',
  'Electrical Rewiring',
  'Deck Installation',
  'Fence Repair',
  'HVAC Maintenance',
  'Plumbing Inspection',
  'Paint Exterior',
  'Install Solar Panels',
  'Landscape Design',
  'Pool Maintenance',
  'Window Replacement',
  'Driveway Resurfacing',
]

const CLIENTS = [
  'Green Building Co',
  'Mu Group',
  'Base Corporation',
  'Delta Corporation',
  'Beta Corporation',
  'Van Group',
  'United Kingdom Co.',
  'Xian Group',
  'Life Corporation',
  'Zeta Enterprise',
  'Nova Holdings',
  'Summit Industries',
  'Harbor Group',
  'Crestline Co.',
]

const STATUS_CYCLE: JobStatus[] = [
  'In Progress',
  'Cancelled',
  'Scheduled',
  'Draft',
  'Completed',
  'In Progress',
  'Completed',
]

const PRIORITY_CYCLE: JobPriority[] = ['Urgent', 'Normal', 'Normal', 'Normal', 'Urgent', 'Normal', 'Normal']

const TIME_CYCLE = ['9:00 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '3:00 PM']

const IN_PROGRESS_STEPS = [30, 45, 55, 65, 80]

export const TEAM: JobAssignee[] = [
  { name: 'Alex Miller', initials: 'AM', color: '#0050cb' },
  { name: 'Jordan Lee', initials: 'JL', color: '#7c3aed' },
  { name: 'Sam Carter', initials: 'SC', color: '#16a34a' },
  { name: 'Priya Nair', initials: 'PN', color: '#d97706' },
  { name: 'Chris Evans', initials: 'CE', color: '#db2777' },
  { name: 'Morgan Blake', initials: 'MB', color: '#0891b2' },
  { name: 'Taylor Reid', initials: 'TR', color: '#4f46e5' },
  { name: 'Jamie Fox', initials: 'JF', color: '#059669' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(daysFromBase: number) {
  const base = new Date(2025, 0, 6) // Mon, 6 Jan 2025
  const d = new Date(base)
  d.setDate(d.getDate() + daysFromBase)
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function progressForStatus(status: JobStatus, index: number) {
  if (status === 'Completed') return 100
  if (status === 'In Progress') return IN_PROGRESS_STEPS[index % IN_PROGRESS_STEPS.length]!
  return 0
}

function buildJob(index: number): JobRow {
  const name = JOB_NAMES[index % JOB_NAMES.length]!
  const client = CLIENTS[index % CLIENTS.length]!
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length]!
  const priority = PRIORITY_CYCLE[index % PRIORITY_CYCLE.length]!
  const progress = progressForStatus(status, index)
  const teamStart = index % TEAM.length
  const assigneeCount = 3 + (index % 3)
  const assignees = Array.from(
    { length: assigneeCount },
    (_, offset) => TEAM[(teamStart + offset) % TEAM.length]!,
  )
  const value = 1800 + ((index * 733) % 9200)

  return {
    id: String(index + 1),
    code: `JOB-${1048 + index}`,
    name,
    initials: getInitials(name),
    client,
    scheduledDate: formatDate(index * 6 - 40),
    scheduledTime: TIME_CYCLE[index % TIME_CYCLE.length]!,
    priority,
    status,
    progress,
    value,
    assignees,
  }
}

export const MOCK_JOBS: JobRow[] = Array.from({ length: 42 }, (_, i) => buildJob(i))
