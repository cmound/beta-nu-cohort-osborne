import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react'
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useParams,
} from 'react-router'
import './App.css'

interface NavigationItem {
  readonly label: string
  readonly path: string
}

interface CourseNavigationItem {
  readonly code: string
  readonly slug: string
}

interface PageShellProps {
  readonly title: string
  readonly children: ReactNode
  readonly eyebrow?: string
}

interface PlaceholderPageProps {
  readonly title: string
  readonly description: string
}

interface ActiveCourseDashboardItem {
  readonly code: string
  readonly title: string
}

interface MeetingRoleDashboardItem {
  readonly role: string
  readonly member: string
}

interface UpcomingMeetingDashboardItem {
  readonly date: string
  readonly pacificTime: string
  readonly easternTime: string
  readonly zoomUrl: string
  readonly roles: readonly MeetingRoleDashboardItem[]
}

interface BirthdayDashboardItem {
  readonly name: string
  readonly dateLabel: string
  readonly daysAwayLabel: string
  readonly isToday: boolean
}

interface CohortValueDashboardItem {
  readonly name: string
  readonly description: string
}

type CohortTimeZone =
  | 'Eastern'
  | 'Central'
  | 'Mountain'
  | 'Arizona (MST)'
  | 'Pacific'
  | 'Alaska'
  | 'Hawaii-Aleutian'

interface CohortContactRecord {
  readonly id: string
  readonly name: string
  readonly timeZone: CohortTimeZone
  readonly phoneDigits: string
  readonly email: string
  readonly industry: string
  readonly birthdayMonth: number | null
  readonly birthdayDay: number | null
  readonly dissertationInterest: string
  readonly isMentor: boolean
}

interface CohortContactFormState {
  readonly name: string
  readonly timeZone: CohortTimeZone
  readonly phoneDigits: string
  readonly email: string
  readonly industry: string
  readonly birthdayInput: string
  readonly dissertationInterest: string
}

interface CohortContactPageProps {
  readonly contacts: readonly CohortContactRecord[]
  readonly onAddContact: (contact: CohortContactRecord) => void
}

interface ParsedBirthday {
  readonly month: number
  readonly day: number
}

type AppBackgroundStyle = CSSProperties & {
  '--bnf-background-image': string
}

const navigationItems: readonly NavigationItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Cohort Contacts', path: '/cohort-contact' },
  { label: 'Cohort Dates & Roles', path: '/cohort-dates-roles' },
  { label: 'Attendance', path: '/attendance' },
  { label: 'Norms', path: '/norms' },
  { label: 'Values and Vision', path: '/values-vision' },
  { label: 'Purpose & Research', path: '/purpose-research' },
  { label: 'Data Survey', path: '/data-survey' },
  { label: 'TLSI Dates', path: '/tlsi-dates' },
  { label: 'Book List', path: '/book-list' },
  { label: 'Transfer Courses', path: '/transfer-courses' },
  {
    label: 'Groups - Assigned by Member',
    path: '/groups-assigned-by-member',
  },
  {
    label: 'Beta Nu Fall Icons',
    path: '/beta-nu-fall-icons',
  },
  {
    label: 'Shared Files',
    path: '/shared-files',
  },
]

const courses: readonly CourseNavigationItem[] = [
  { code: 'EDDP 700', slug: 'eddp700' },
  { code: 'EDDP 740', slug: 'eddp740' },
  { code: 'EDDP 706', slug: 'eddp706' },
  { code: 'EDDP 742', slug: 'eddp742' },
  { code: 'EDDP 707', slug: 'eddp707' },
  { code: 'EDDP 743', slug: 'eddp743' },
  { code: 'EDDP 708', slug: 'eddp708' },
  { code: 'EDDP 741', slug: 'eddp741' },
  { code: 'EDDP 705', slug: 'eddp705' },
  { code: 'EDDP 781', slug: 'eddp781' },
  { code: 'EDDP 720', slug: 'eddp720' },
  { code: 'EDDP 709', slug: 'eddp709' },
  { code: 'EDDP 783', slug: 'eddp783' },
  { code: 'EDDP 721', slug: 'eddp721' },
  { code: 'EDDP 723', slug: 'eddp723' },
  { code: 'EDDP 724', slug: 'eddp724' },
  { code: 'EDDP 782', slug: 'eddp782' },
  { code: 'EDDP 791', slug: 'eddp791' },
  { code: 'EDDP 792', slug: 'eddp792' },
]

const appBackgroundStyle: AppBackgroundStyle = {
  '--bnf-background-image': `url("${import.meta.env.BASE_URL}bnf-webpage-background.png")`,
}

const sidebarHeaderBannerSrc = `${import.meta.env.BASE_URL}sidebar-header-banner.png`

const PROGRAM_START_DATE = Date.UTC(2025, 7, 25)
const PROGRAM_END_DATE = Date.UTC(2027, 5, 27)

const pacificDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/Los_Angeles',
})

const pacificTimeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'America/Los_Angeles',
  timeZoneName: 'short',
})

const easternTimeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'America/New_York',
  timeZoneName: 'short',
})

const activeCoursesDashboard: readonly ActiveCourseDashboardItem[] = [
  {
    code: 'EDDP 781',
    title: 'Developing the Dissertation, Chapter I',
  },
  {
    code: 'EDDP 720',
    title: 'Creativity, Innovation and Sustainable Change',
  },
]

const upcomingMeetingDashboard: UpcomingMeetingDashboardItem = {
  date: 'Sunday, August 23, 2026',
  pacificTime: '1:30 PM – 5:30 PM PDT',
  easternTime: '4:30 PM – 8:30 PM EDT',
  zoomUrl: 'https://umassglobal.zoom.us/my/drcmo',
  roles: [
    {
      role: 'Facilitator',
      member: 'Chris Mound',
    },
    {
      role: 'Community Builder',
      member: 'Victoria Vildosola',
    },
    {
      role: 'Timekeeper',
      member: 'Jessica Jackson',
    },
    {
      role: 'Process Observer',
      member: 'Sergiy Bryk',
    },
  ],
}

const nextBirthdayDashboard: BirthdayDashboardItem | null = null

const cohortVision =
  'The vision of Beta Nu is to build an inclusive and empowering community that inspires personal and professional growth through creativity, courage, and authenticity, while practicing transformational leadership grounded in ethical action, empathy, accountability, and a strong sense of belonging.'

const cohortValues: readonly CohortValueDashboardItem[] = [
  {
    name: 'Respect',
    description:
      'Listen to others, honor differences, and treat people with dignity.',
  },
  {
    name: 'Commitment',
    description:
      'Show up prepared, remain engaged, and follow through on responsibilities.',
  },
  {
    name: 'Communication',
    description:
      'Share information clearly, honestly, and in a timely manner.',
  },
  {
    name: 'Accountability',
    description:
      'Own actions, results, and missed commitments.',
  },
  {
    name: 'Adaptability',
    description:
      'Respond to change with flexibility while remaining focused on shared goals.',
  },
]

const cohortTimeZoneOptions: readonly CohortTimeZone[] = [
  'Eastern',
  'Central',
  'Mountain',
  'Arizona (MST)',
  'Pacific',
  'Alaska',
  'Hawaii-Aleutian',
]

const birthdayMonthLabels: readonly string[] = [
  'Jan.',
  'Feb.',
  'March',
  'April',
  'May',
  'June',
  'July',
  'Aug.',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
]

const cohortContactsSeed: readonly CohortContactRecord[] = [
  {
    id: 'cheryl-marie-osborne',
    name: 'Dr. Cheryl-Marie Osborne (Mentor)',
    timeZone: 'Pacific',
    phoneDigits: '7143431102',
    email: 'cherylosborne909@gmail.com',
    industry: 'NonProfit',
    birthdayMonth: 8,
    birthdayDay: 19,
    dissertationInterest: 'N/A',
    isMentor: true,
  },
  {
    id: 'asa-jones-mcghee',
    name: 'Asa Jones-McGhee',
    timeZone: 'Pacific',
    phoneDigits: '6619168400',
    email: 'ajonesmc@mail.umassglobal.edu',
    industry: 'NonProfit',
    birthdayMonth: 11,
    birthdayDay: 1,
    dissertationInterest:
      'Foster care and the mental health behind it.',
    isMentor: false,
  },
  {
    id: 'bashiyra-windley',
    name: 'Bashiyra Windley',
    timeZone: 'Eastern',
    phoneDigits: '6466710752',
    email: 'bwindley@mail.umassglobal.edu',
    industry: 'Private Sector',
    birthdayMonth: 9,
    birthdayDay: 13,
    dissertationInterest: '',
    isMentor: false,
  },
  {
    id: 'celia-cipres',
    name: 'Celia Cipres',
    timeZone: 'Pacific',
    phoneDigits: '5107769005',
    email: 'ccipres@mail.umassglobal.edu',
    industry: 'Center Base',
    birthdayMonth: 3,
    birthdayDay: 18,
    dissertationInterest:
      'The importance of viewing teachers as a a profession and not babysitters in the ECE field ',
    isMentor: false,
  },
  {
    id: 'chris-mound',
    name: 'Chris Mound',
    timeZone: 'Pacific',
    phoneDigits: '6616447084',
    email: 'cmound@mail.umassglobal.edu',
    industry: 'Private Sector',
    birthdayMonth: 8,
    birthdayDay: 13,
    dissertationInterest:
      'Leadership and organizational practices that support the career success and inclusion of veterans with disabilities.',
    isMentor: false,
  },
  {
    id: 'elanis-cruz',
    name: 'Elanis Cruz',
    timeZone: 'Pacific',
    phoneDigits: '8313832340',
    email: 'emagalla@mail.umassglobal.edu',
    industry: 'Higher Education',
    birthdayMonth: 3,
    birthdayDay: 6,
    dissertationInterest:
      'Impacts on coronavirus on education or community involvement in school leadership',
    isMentor: false,
  },
  {
    id: 'jessica-jackson',
    name: 'Jessica Jackson',
    timeZone: 'Eastern',
    phoneDigits: '9142824571',
    email: 'jjacks47@mail.umassglobal.edu',
    industry: 'Nonprofit',
    birthdayMonth: 7,
    birthdayDay: 7,
    dissertationInterest:
      'Reviewing the relationship between nonprofit executive leadership burnout and trauma-informed organizations',
    isMentor: false,
  },
  {
    id: 'jessica-leon',
    name: 'Jessica Leon',
    timeZone: 'Pacific',
    phoneDigits: '5594038077',
    email: 'jleon2@mail.umassglobal.edu',
    industry: 'K-12 Education',
    birthdayMonth: 2,
    birthdayDay: 25,
    dissertationInterest: '',
    isMentor: false,
  },
  {
    id: 'monica-romero',
    name: 'Monica Romero',
    timeZone: 'Pacific',
    phoneDigits: '3239750108',
    email: 'mromer27@mail.umassglobal.edu',
    industry: 'Higher Education',
    birthdayMonth: 6,
    birthdayDay: 17,
    dissertationInterest:
      'Collaborative Leadership Strategies to Improve College Access and Housing Stability for Foster Youth Transitioning to Adulthood',
    isMentor: false,
  },
  {
    id: 'reynaldo-dulaney',
    name: 'Reynaldo Dulaney',
    timeZone: 'Pacific',
    phoneDigits: '9518509029',
    email: 'rdulaney@mail.umassglobal.edu',
    industry: 'Private Sector',
    birthdayMonth: 9,
    birthdayDay: 30,
    dissertationInterest:
      'The missions of non profit organizations and the ethical responsibility of leadership',
    isMentor: false,
  },
  {
    id: 'sergiy-bryk',
    name: 'Sergiy Bryk',
    timeZone: 'Pacific',
    phoneDigits: '9168372572',
    email: 'sbryk@mail.umassglobal.edu',
    industry: 'Higher Education',
    birthdayMonth: 12,
    birthdayDay: 10,
    dissertationInterest:
      'What is the relationship between senior pastors’ leadership, as experienced by staff and volunteers, and their intention to use AI tools for church tasks in U.S. congregations?',
    isMentor: false,
  },
  {
    id: 'tracy-rico',
    name: 'Tracy Rico',
    timeZone: 'Pacific',
    phoneDigits: '3603206802',
    email: 'trico1@mail.umassglobal.edu',
    industry: 'Military',
    birthdayMonth: null,
    birthdayDay: null,
    dissertationInterest:
      "Veteran's transition from military to civlian sector, the barriers they face, and its effects",
    isMentor: false,
  },
  {
    id: 'trevor-desouza',
    name: 'Trevor Desouza',
    timeZone: 'Pacific',
    phoneDigits: '3605096739',
    email: 'tdesouza@mail.umassglobal.edu',
    industry: 'Civil Servant',
    birthdayMonth: null,
    birthdayDay: null,
    dissertationInterest: 'Lack of Diversity in Positions of Leadership',
    isMentor: false,
  },
  {
    id: 'victoria-vildosola',
    name: 'Victoria Vildosola',
    timeZone: 'Pacific',
    phoneDigits: '9094132057',
    email: 'vvildoso@mail.umassglobal.edu',
    industry: 'Retail',
    birthdayMonth: 5,
    birthdayDay: 24,
    dissertationInterest:
      'Struggles women have with leadership roles within the retail sector',
    isMentor: false,
  },
]

function createEmptyContactForm(): CohortContactFormState {
  return {
    name: '',
    timeZone: 'Pacific',
    phoneDigits: '',
    email: '',
    industry: '',
    birthdayInput: '',
    dissertationInterest: '',
  }
}

function isCohortTimeZone(value: string): value is CohortTimeZone {
  return cohortTimeZoneOptions.some((timeZone) => timeZone === value)
}

function sanitizePhoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10)
}

function formatPhoneNumber(phoneDigits: string): string {
  const digits = sanitizePhoneDigits(phoneDigits)

  if (digits.length !== 10) {
    return digits
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function normalizeCohortEmail(value: string): string {
  const trimmedValue = value.trim().toLowerCase()

  if (!trimmedValue) {
    return ''
  }

  if (trimmedValue.includes('@')) {
    return trimmedValue
  }

  return `${trimmedValue}@mail.umassglobal.edu`
}

function parseBirthdayInput(value: string): ParsedBirthday | null {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const separatedParts = trimmedValue
    .split(/\D+/)
    .filter((part) => part.length > 0)

  let month: number
  let day: number

  if (separatedParts.length >= 2) {
    const monthPart = separatedParts[0]
    const dayPart = separatedParts[1]

    if (!monthPart || !dayPart) {
      return null
    }

    month = Number(monthPart)
    day = Number(dayPart)
  } else {
    const digits = trimmedValue.replace(/\D/g, '')

    if (digits.length < 3) {
      return null
    }

    const twoDigitMonth = Number(digits.slice(0, 2))

    if (digits.length >= 4 && twoDigitMonth >= 1 && twoDigitMonth <= 12) {
      month = twoDigitMonth
      day = Number(digits.slice(2, 4))
    } else {
      month = Number(digits.slice(0, 1))
      day = Number(digits.slice(1, 3))
    }
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return null
  }

  const daysInMonth = new Date(Date.UTC(2000, month, 0)).getUTCDate()

  if (!Number.isInteger(day) || day < 1 || day > daysInMonth) {
    return null
  }

  return {
    month,
    day,
  }
}

function formatBirthday(
  birthdayMonth: number | null,
  birthdayDay: number | null,
): string {
  if (birthdayMonth === null || birthdayDay === null) {
    return ''
  }

  const monthLabel = birthdayMonthLabels[birthdayMonth - 1]

  if (!monthLabel) {
    return ''
  }

  return `${monthLabel} ${birthdayDay}`
}

function sortCohortContacts(
  contacts: readonly CohortContactRecord[],
): CohortContactRecord[] {
  return [...contacts].sort((firstContact, secondContact) => {
    if (firstContact.isMentor !== secondContact.isMentor) {
      return firstContact.isMentor ? -1 : 1
    }

    return firstContact.name.localeCompare(secondContact.name, 'en-US', {
      sensitivity: 'base',
    })
  })
}

function calculateProgramProgress(currentDate: Date): number {
  const currentTime = currentDate.getTime()
  const totalDuration = PROGRAM_END_DATE - PROGRAM_START_DATE

  if (currentTime <= PROGRAM_START_DATE) {
    return 0
  }

  if (currentTime >= PROGRAM_END_DATE) {
    return 100
  }

  return Math.round(
    ((currentTime - PROGRAM_START_DATE) / totalDuration) * 100,
  )
}

function PageShell({
  title,
  children,
  eyebrow = 'Beta Nu Fall',
}: PageShellProps) {
  return (
    <section className="page-shell">
      <header className="page-heading">
        <div>
          <p className="page-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
      </header>

      {children}
    </section>
  )
}

function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 60_000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const programProgress = calculateProgramProgress(currentDate)

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading">
        <h1>Beta Nu Cohort Dashboard</h1>

        <span className="dashboard-chair-name">
          Dr. Cheryl-Marie Osborne
        </span>

        <span className="dashboard-program-name">
          Ed.D. Organizational Leadership
        </span>
      </header>

      <div className="dashboard-primary-grid">
        <article className="dashboard-info-card dashboard-date-card">
          <p className="dashboard-card-label">Today's Date & Time</p>

          <p className="dashboard-current-date">
            {pacificDateFormatter.format(currentDate)}
          </p>

          <div className="dashboard-time-list">
            <span>{pacificTimeFormatter.format(currentDate)}</span>
            <span>{easternTimeFormatter.format(currentDate)}</span>
          </div>
        </article>

        <article className="dashboard-info-card dashboard-progress-card">
          <div className="dashboard-card-heading-row">
            <p className="dashboard-card-label">Program Progress</p>
            <strong>{programProgress}%</strong>
          </div>

          <div
            className="program-progress-track"
            role="progressbar"
            aria-label="Beta Nu program timeline progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={programProgress}
          >
            <div
              className="program-progress-fill"
              style={{ width: `${programProgress}%` }}
            />
          </div>

          <div className="program-progress-dates">
            <div>
              <span>Program Start</span>
              <strong>August 25, 2025</strong>
            </div>

            <div className="program-progress-current">
              <span>Current Progress</span>
              <strong>{programProgress}% Complete</strong>
            </div>

            <div>
              <span>Projected End</span>
              <strong>June 27, 2027</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-info-card dashboard-classes-card">
          <div className="dashboard-card-heading-row">
            <p className="dashboard-card-label">Active Classes</p>
            <strong>{activeCoursesDashboard.length} Active</strong>
          </div>

          <div className="active-course-list">
            {activeCoursesDashboard.map((course) => (
              <div className="active-course-item" key={course.code}>
                <span>{course.code}</span>
                <strong>{course.title}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="dashboard-secondary-grid">
        <article className="dashboard-info-card dashboard-meeting-card">
          <div className="dashboard-card-heading-row">
            <p className="dashboard-card-label">Upcoming Cohort Meeting</p>
            <span className="meeting-status">Next Meeting</span>
          </div>

          <div className="meeting-details">
            <h2>{upcomingMeetingDashboard.date}</h2>

            <div className="meeting-time-grid">
              <div>
                <span>Pacific</span>
                <strong>{upcomingMeetingDashboard.pacificTime}</strong>
              </div>

              <div>
                <span>Eastern</span>
                <strong>{upcomingMeetingDashboard.easternTime}</strong>
              </div>
            </div>

            <a
              className="meeting-zoom-link"
              href={upcomingMeetingDashboard.zoomUrl}
              target="_blank"
              rel="noreferrer"
            >
              Zoom Meeting
            </a>
          </div>

          <div className="meeting-role-table-wrap">
            <table className="meeting-role-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Assigned Member</th>
                </tr>
              </thead>
              <tbody>
                {upcomingMeetingDashboard.roles.map((meetingRole) => (
                  <tr key={meetingRole.role}>
                    <td>{meetingRole.role}</td>
                    <td>{meetingRole.member}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article
          className={`dashboard-info-card birthday-card${nextBirthdayDashboard?.isToday ? ' birthday-card-today' : ''
            }`}
        >
          <p className="dashboard-card-label">Birthday Board</p>

          {nextBirthdayDashboard ? (
            <div className="birthday-content">
              <span className="birthday-status">
                {nextBirthdayDashboard.isToday
                  ? "Today's Birthday"
                  : 'Next Birthday'}
              </span>

              <h2>{nextBirthdayDashboard.name}</h2>
              <strong>{nextBirthdayDashboard.dateLabel}</strong>
              <p>
                {nextBirthdayDashboard.isToday
                  ? 'Happy Birthday!'
                  : nextBirthdayDashboard.daysAwayLabel}
              </p>
            </div>
          ) : (
            <div className="birthday-empty-state">
              <strong>Birthday data will appear here.</strong>
              <p>
                Upcoming birthdays will populate from the Cohort Contact page.
              </p>
            </div>
          )}
        </article>
      </div>

      <article className="dashboard-vision-values">
        <section className="dashboard-vision-section">
          <div className="vision-title-row">
            <span />
            <h2>Our Vision</h2>
            <span />
          </div>

          <p>{cohortVision}</p>
        </section>

        <section className="dashboard-values-section">
          <div className="vision-title-row">
            <span />
            <h2>Our Values</h2>
            <span />
          </div>

          <div className="dashboard-values-list">
            {cohortValues.map((value) => (
              <div className="dashboard-value-item" key={value.name}>
                <strong>{value.name}:</strong>
                <span>{value.description}</span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </section >
  )
}

function CohortContactPage({
  contacts,
  onAddContact,
}: CohortContactPageProps) {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState(createEmptyContactForm)
  const [formError, setFormError] = useState('')
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const sortedContacts = sortCohortContacts(contacts)

  function openAddContactModal(): void {
    setNewContact(createEmptyContactForm())
    setFormError('')
    setIsAddContactOpen(true)
  }

  function closeAddContactModal(): void {
    setNewContact(createEmptyContactForm())
    setFormError('')
    setIsAddContactOpen(false)
  }

  function completeEmailAddress(): void {
    setNewContact((currentContact) => ({
      ...currentContact,
      email: normalizeCohortEmail(currentContact.email),
    }))
  }

  async function copyEmailAddress(email: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
    } catch {
      setCopiedEmail(null)
    }
  }

  function handleAddContact(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const normalizedName = newContact.name.trim()
    const normalizedEmail = normalizeCohortEmail(newContact.email)
    const normalizedIndustry = newContact.industry.trim()
    const normalizedDissertationInterest =
      newContact.dissertationInterest.trim()
    const parsedBirthday = parseBirthdayInput(newContact.birthdayInput)

    if (!normalizedName) {
      setFormError('Name is required.')
      return
    }

    if (newContact.phoneDigits.length !== 10) {
      setFormError('Phone Number must contain exactly 10 digits.')
      return
    }

    if (
      !normalizedEmail ||
      !normalizedEmail.includes('@') ||
      !normalizedEmail.includes('.')
    ) {
      setFormError('Enter a valid email address.')
      return
    }

    if (newContact.birthdayInput.trim() && !parsedBirthday) {
      setFormError(
        'Birthday must use a valid month and day, such as 813, 0813, or 8/13.',
      )
      return
    }

    const contact: CohortContactRecord = {
      id: crypto.randomUUID(),
      name: normalizedName,
      timeZone: newContact.timeZone,
      phoneDigits: newContact.phoneDigits,
      email: normalizedEmail,
      industry: normalizedIndustry,
      birthdayMonth: parsedBirthday?.month ?? null,
      birthdayDay: parsedBirthday?.day ?? null,
      dissertationInterest: normalizedDissertationInterest,
      isMentor: false,
    }

    onAddContact(contact)
    closeAddContactModal()
  }

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Contacts</h1>
      </header>

      <div className="contacts-toolbar">
        <button
          type="button"
          className="add-contact-button"
          onClick={openAddContactModal}
        >
          + Add Contact
        </button>

        <div className="contacts-total-count">
          Total Count = <strong>{contacts.length}</strong>
        </div>
      </div>

      <div className="contacts-table-frame">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time Zone</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Industry</th>
              <th>Birthday</th>
              <th>Dissertation Interest</th>
            </tr>
          </thead>

          <tbody>
            {sortedContacts.map((contact) => (
              <tr key={contact.id}>
                <td className={contact.isMentor ? 'contact-mentor-name' : ''}>
                  {contact.name}
                </td>
                <td>{contact.timeZone}</td>
                <td>{formatPhoneNumber(contact.phoneDigits)}</td>
                <td>
                  <div className="contact-email-cell">
                    <button
                      type="button"
                      className="contact-email-link"
                      title="Copy email address"
                      onClick={() => void copyEmailAddress(contact.email)}
                    >
                      {contact.email}
                    </button>

                    {copiedEmail === contact.email && (
                      <span className="contact-email-copied">Copied</span>
                    )}
                  </div>
                </td>
                <td>{contact.industry || '—'}</td>
                <td>
                  {formatBirthday(
                    contact.birthdayMonth,
                    contact.birthdayDay,
                  ) || '—'}
                </td>
                <td>{contact.dissertationInterest || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddContactOpen && (
        <div className="contact-modal-backdrop">
          <section
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-contact-title"
          >
            <header className="contact-modal-header">
              <h2 id="add-contact-title">Add New Contact to Cohort</h2>

              <button
                type="button"
                className="contact-modal-close"
                onClick={closeAddContactModal}
                aria-label="Close Add Contact window"
              >
                ×
              </button>
            </header>

            <form
              className="contact-form"
              onSubmit={handleAddContact}
            >
              <div className="contact-form-grid">
                <label className="contact-form-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="contact-form-field">
                  <span>Time Zone</span>
                  <select
                    value={newContact.timeZone}
                    onChange={(event) => {
                      const selectedTimeZone = event.target.value

                      if (isCohortTimeZone(selectedTimeZone)) {
                        setNewContact((currentContact) => ({
                          ...currentContact,
                          timeZone: selectedTimeZone,
                        }))
                      }
                    }}
                  >
                    {cohortTimeZoneOptions.map((timeZone) => (
                      <option key={timeZone} value={timeZone}>
                        {timeZone}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="contact-form-field">
                  <span>Phone Number</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newContact.phoneDigits}
                    placeholder="5551234567"
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        phoneDigits: sanitizePhoneDigits(event.target.value),
                      }))
                    }
                  />
                  <small>
                    Enter 10 digits. The table will display
                    (555) 123-4567.
                  </small>
                </label>

                <label className="contact-form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={newContact.email}
                    placeholder="sample.name"
                    onBlur={completeEmailAddress}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        completeEmailAddress()
                      }
                    }}
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        email: event.target.value,
                      }))
                    }
                  />
                  <small>
                    Example: entering sample.name becomes
                    sample.name@mail.umassglobal.edu.
                  </small>
                </label>

                <label className="contact-form-field">
                  <span>Industry</span>
                  <input
                    type="text"
                    value={newContact.industry}
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        industry: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="contact-form-field">
                  <span>Birthday</span>
                  <input
                    type="text"
                    value={newContact.birthdayInput}
                    placeholder="813 or 8/13"
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        birthdayInput: event.target.value,
                      }))
                    }
                  />
                  <small>
                    Enter MDD, MMDD, M/DD, MM/DD, or include a year.
                    The year will not be displayed.
                  </small>
                </label>

                <label className="contact-form-field contact-form-field-wide">
                  <span>Dissertation Interest</span>
                  <textarea
                    rows={4}
                    value={newContact.dissertationInterest}
                    onChange={(event) =>
                      setNewContact((currentContact) => ({
                        ...currentContact,
                        dissertationInterest: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {formError && (
                <p className="contact-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="contact-modal-actions">
                <button
                  type="button"
                  className="contact-cancel-button"
                  onClick={closeAddContactModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="contact-save-button"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}

function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <PageShell title={title}>
      <div className="content-panel">
        <div className="placeholder-content">
          <p className="panel-eyebrow">Page Structure Created</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </PageShell>
  )
}

function CoursePage() {
  const { courseCode } = useParams()

  const course = courses.find((item) => item.slug === courseCode)

  if (!course) {
    return (
      <PlaceholderPage
        title="Course Not Found"
        description="The requested course page is not currently configured."
      />
    )
  }

  return (
    <PageShell title={course.code} eyebrow="Beta Nu Fall Course">
      <div className="content-panel">
        <div className="placeholder-content">
          <p className="panel-eyebrow">Course Workspace</p>
          <h2>{course.code}</h2>
          <p>
            This course page is ready for its assignment tracker, webinar
            information, cohort responsibilities, and related course
            resources.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

function App() {
  const [coursesOpen, setCoursesOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [contacts, setContacts] =
    useState<readonly CohortContactRecord[]>(cohortContactsSeed)

  function addCohortContact(contact: CohortContactRecord): void {
    setContacts((currentContacts) => [
      ...currentContacts,
      contact,
    ])
  }

  return (
    <div
      className={`bnf-app ${sidebarCollapsed ? 'bnf-app-sidebar-collapsed' : ''
        }`}
      style={appBackgroundStyle}
    >
      <aside
        className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''
          }`}
      >
        <div className="sidebar-header">
          <img
            src={sidebarHeaderBannerSrc}
            className="sidebar-header-banner"
            alt="Beta Nu Fall Cohort Hub, Ed.D. Organizational Leadership"
          />

          <button
            type="button"
            className="sidebar-collapse-button"
            onClick={() =>
              setSidebarCollapsed((isCollapsed) => !isCollapsed)
            }
            aria-label={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            title={
              sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            {sidebarCollapsed ? '+' : '−'}
          </button>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav" aria-label="Beta Nu Fall navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              <span className="nav-marker" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="nav-group">
            <button
              type="button"
              className="nav-group-button"
              onClick={() => setCoursesOpen((isOpen) => !isOpen)}
              aria-expanded={coursesOpen}
            >
              <span className="nav-marker nav-marker-courses" aria-hidden="true" />
              <span>Courses</span>
              <span className="nav-chevron" aria-hidden="true">
                {coursesOpen ? '[-]' : '[+]'}
              </span>
            </button>

            {coursesOpen && (
              <div className="course-nav">
                {courses.map((course) => (
                  <NavLink
                    key={course.slug}
                    to={`/courses/${course.slug}`}
                    className={({ isActive }) =>
                      isActive
                        ? 'course-nav-link course-nav-link-active'
                        : 'course-nav-link'
                    }
                  >
                    <span className="course-nav-dot" aria-hidden="true" />
                    <span>{course.code}</span>
                  </NavLink>
                ))}

                <NavLink
                  to="/template-eddp-7xx"
                  className={({ isActive }) =>
                    isActive
                      ? 'course-nav-link course-nav-link-active'
                      : 'course-nav-link'
                  }
                >
                  <span className="course-nav-dot" aria-hidden="true" />
                  <span>Template EDDP 7XX</span>
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="app-main">
        <main className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />

            <Route
              path="/cohort-contact"
              element={
                <CohortContactPage
                  contacts={contacts}
                  onAddContact={addCohortContact}
                />
              }
            />

            <Route
              path="/cohort-dates-roles"
              element={
                <PlaceholderPage
                  title="Cohort Dates & Roles"
                  description="Cohort meeting dates, assignments, and rotating meeting responsibilities will be organized here."
                />
              }
            />

            <Route
              path="/attendance"
              element={
                <PlaceholderPage
                  title="Attendance"
                  description="Cohort meeting attendance and participation records will be maintained here."
                />
              }
            />

            <Route
              path="/norms"
              element={
                <PlaceholderPage
                  title="Norms"
                  description="The cohort's agreed expectations, communication standards, and shared norms will be maintained here."
                />
              }
            />

            <Route
              path="/values-vision"
              element={
                <PlaceholderPage
                  title="Values and Vision"
                  description="The cohort's shared values, accountability commitments, and vision statement will be organized here."
                />
              }
            />

            <Route
              path="/purpose-research"
              element={
                <PlaceholderPage
                  title="Purpose & Research"
                  description="Purpose statements, research questions, and dissertation development information will be organized here."
                />
              }
            />

            <Route
              path="/data-survey"
              element={
                <PlaceholderPage
                  title="Data Survey"
                  description="Cohort survey information and related shared data will be organized here."
                />
              }
            />

            <Route
              path="/tlsi-dates"
              element={
                <PlaceholderPage
                  title="TLSI Dates"
                  description="TLSI milestones, dates, responsibilities, and related reminders will be organized here."
                />
              }
            />

            <Route
              path="/book-list"
              element={
                <PlaceholderPage
                  title="Book List"
                  description="Required and recommended books and course resources will be maintained here."
                />
              }
            />

            <Route
              path="/transfer-courses"
              element={
                <PlaceholderPage
                  title="Transfer Courses"
                  description="Approved transfer courses and cohort member transfer-credit information will be organized here."
                />
              }
            />

            <Route
              path="/groups-assigned-by-member"
              element={
                <PlaceholderPage
                  title="Groups - Assigned by Member"
                  description="Course group assignments and member participation will be organized here."
                />
              }
            />

            <Route
              path="/beta-nu-fall-icons"
              element={
                <PlaceholderPage
                  title="Beta Nu Fall Icons"
                  description="Beta Nu Fall seals, Zoom wallpapers, Word document tips, and related cohort branding resources will be organized here."
                />
              }
            />

            <Route
              path="/shared-files"
              element={
                <PlaceholderPage
                  title="Shared Files"
                  description="Shared cohort documents and resources will be organized here."
                />
              }
            />

            <Route
              path="/courses/:courseCode"
              element={<CoursePage />}
            />

            <Route
              path="/template-eddp-7xx"
              element={
                <PlaceholderPage
                  title="Template EDDP 7XX"
                  description="The reusable Beta Nu Fall course-page template will be maintained here."
                />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App