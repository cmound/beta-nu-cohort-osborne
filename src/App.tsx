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
  readonly imageFileName: string
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

type CohortContactStatus = 'Active' | 'Inactive'

type CohortContactStatusState = Record<string, CohortContactStatus>

type CohortContactUpdate = Partial<
  Omit<CohortContactRecord, 'id' | 'isMentor'>
>

interface CohortContactPageProps {
  readonly contacts: readonly CohortContactRecord[]
  readonly contactStatuses: Readonly<CohortContactStatusState>
  readonly onAddContact: (contact: CohortContactRecord) => void
  readonly onUpdateContact: (
    contactId: string,
    updates: CohortContactUpdate,
  ) => void
  readonly onUpdateStatus: (
    contactId: string,
    status: CohortContactStatus,
  ) => void
}

type CohortAttendanceMark = '' | 'X' | 'A'

type CohortAttendanceState = Record<string, CohortAttendanceMark>

interface CohortAttendancePageProps {
  readonly contacts: readonly CohortContactRecord[]
  readonly meetings: readonly CohortMeetingRecord[]
  readonly attendance: CohortAttendanceState
  readonly onUpdateAttendance: (
    contactId: string,
    meetingId: string,
    mark: CohortAttendanceMark,
  ) => void
}

type CohortProgramYear = 'Year 1' | 'Year 2'

type CohortMeetingRoleField =
  | 'facilitator'
  | 'communityBuilder'
  | 'recorder'
  | 'timeKeeper'
  | 'processObserver'

interface CohortMeetingRecord {
  readonly id: string
  readonly year: CohortProgramYear
  readonly date: string
  readonly term: string
  readonly meetingNumber: string
  readonly facilitator: string
  readonly communityBuilder: string
  readonly recorder: string
  readonly timeKeeper: string
  readonly processObserver: string
}

interface CohortMeetingFormState {
  readonly date: string
  readonly term: string
  readonly calendarYear: string
  readonly meetingNumber: string
}

interface CohortDatesRolesPageProps {
  readonly contacts: readonly CohortContactRecord[]
  readonly meetings: readonly CohortMeetingRecord[]
  readonly onAddMeeting: (meeting: CohortMeetingRecord) => void
  readonly onUpdateRole: (
    meetingId: string,
    roleField: CohortMeetingRoleField,
    value: string,
  ) => void
}

interface FormerCohortMemberRecord {
  readonly id: string
  readonly name: string
  readonly timeZone: CohortTimeZone
  readonly phoneNumber: string
  readonly email: string
  readonly industry: string
  readonly birthdayMonth: number | null
  readonly birthdayDay: number | null
  readonly dissertationInterest: string
  readonly inactiveAfterDate: string
}

interface CohortRoleSummaryRecord {
  readonly name: string
  readonly facilitator: number
  readonly communityBuilder: number
  readonly recorder: number
  readonly timeKeeper: number
  readonly processObserver: number
  readonly total: number
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

const pacificDateKeyFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'America/Los_Angeles',
})

const cohortMeetingWeekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  timeZone: 'UTC',
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
    imageFileName: 'respect-handshake.png',
  },
  {
    name: 'Commitment',
    description:
      'Show up prepared, remain engaged, and follow through on responsibilities.',
    imageFileName: 'commitment.png',
  },
  {
    name: 'Communication',
    description:
      'Share information clearly, honestly, and in a timely manner.',
    imageFileName: 'communication.png',
  },
  {
    name: 'Accountability',
    description:
      'Own actions, results, and missed commitments.',
    imageFileName: 'accountability.png',
  },
  {
    name: 'Adaptability',
    description:
      'Respond to change with flexibility while remaining focused on shared goals.',
    imageFileName: 'adaptability.png',
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

const cohortTermOptions: readonly string[] = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
]

const COHORT_YEAR_TWO_START_DATE = '2026-08-24'

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

function createCohortContactStatusSeed(
  contacts: readonly CohortContactRecord[],
): CohortContactStatusState {
  const statuses: CohortContactStatusState = {}

  for (const contact of contacts) {
    if (!contact.isMentor) {
      statuses[contact.id] = 'Active'
    }
  }

  return statuses
}

const cohortContactStatusSeed =
  createCohortContactStatusSeed(cohortContactsSeed)

const formerCohortMembers: readonly FormerCohortMemberRecord[] = [
  {
    id: 'patrick-j-harris',
    name: 'Patrick J. Harris',
    timeZone: 'Pacific',
    phoneNumber: 'Email Please',
    email: 'pharri10@mail.umassglobal.edu',
    industry: 'K-12 Education/Music Education',
    birthdayMonth: 7,
    birthdayDay: 31,
    dissertationInterest:
      'Building High-Performance Music Programs: Applying Performance Psychology to Develop Organizational Leadership and Resilience in Student Musicians from Lower Socioeconomic Communities.',
    inactiveAfterDate: '2026-07-26',
  },
]

const cohortMeetingsSeed: readonly CohortMeetingRecord[] = [
  {
    id: 'meeting-2025-09-21',
    year: 'Year 1',
    date: '2025-09-21',
    term: 'Fall I 2025',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Dr. CMO',
    communityBuilder: 'Jessica Jackson',
    recorder: 'Elanis Cruz',
    timeKeeper: 'Patrick J. Harris',
    processObserver: 'Tracy Rico',
  },
  {
    id: 'meeting-2025-10-12',
    year: 'Year 1',
    date: '2025-10-12',
    term: 'Fall I 2025',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Patrick J. Harris',
    communityBuilder: 'Reynaldo Dulaney',
    recorder: 'Tracy Rico',
    timeKeeper: 'Asa Jones-McGhee',
    processObserver: 'Jessica Jackson',
  },
  {
    id: 'meeting-2025-11-16',
    year: 'Year 1',
    date: '2025-11-16',
    term: 'Fall II 2025',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Jessica Leon',
    communityBuilder: 'Victoria Vildosola',
    recorder: 'Sergiy Bryk',
    timeKeeper: 'Reynaldo Dulaney',
    processObserver: 'Elanis Cruz',
  },
  {
    id: 'meeting-2025-12-07',
    year: 'Year 1',
    date: '2025-12-07',
    term: 'Fall II 2025',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Monica Romero',
    communityBuilder: 'Tracy Rico',
    recorder: 'Jessica Leon',
    timeKeeper: 'Victoria Vildosola',
    processObserver: 'Celia Cipres',
  },
  {
    id: 'meeting-2026-02-01',
    year: 'Year 1',
    date: '2026-02-01',
    term: 'Spring I 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Bashiyra Windley',
    communityBuilder: 'Chris Mound',
    recorder: 'Celia Cipres',
    timeKeeper: 'Monica Romero',
    processObserver: 'Asa Jones-McGhee',
  },
  {
    id: 'meeting-2026-03-01',
    year: 'Year 1',
    date: '2026-03-01',
    term: 'Spring I 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Jessica Jackson',
    communityBuilder: 'Bashiyra Windley',
    recorder: 'Asa Jones-McGhee',
    timeKeeper: 'Tracy Rico',
    processObserver: 'Chris Mound',
  },
  {
    id: 'meeting-2026-03-29',
    year: 'Year 1',
    date: '2026-03-29',
    term: 'Spring II 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Tracy Rico',
    communityBuilder: 'Celia Cipres',
    recorder: 'Bashiyra Windley',
    timeKeeper: 'Elanis Cruz',
    processObserver: 'Victoria Vildosola',
  },
  {
    id: 'meeting-2026-04-19',
    year: 'Year 1',
    date: '2026-04-19',
    term: 'Spring II 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Reynaldo Dulaney',
    communityBuilder: 'Victoria Vildosola',
    recorder: 'Jessica Jackson',
    timeKeeper: 'Sergiy Bryk',
    processObserver: 'Elanis Cruz',
  },
  {
    id: 'meeting-2026-05-31',
    year: 'Year 1',
    date: '2026-05-31',
    term: 'Summer I 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Celia Cipres',
    communityBuilder: 'Sergiy Bryk',
    recorder: 'Bashiyra Windley',
    timeKeeper: 'Chris Mound',
    processObserver: 'Elanis Cruz',
  },
  {
    id: 'meeting-2026-06-14',
    year: 'Year 1',
    date: '2026-06-14',
    term: 'Summer I 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Jessica Leon',
    communityBuilder: 'Chris Mound',
    recorder: 'Tracy Rico',
    timeKeeper: 'Victoria Vildosola',
    processObserver: 'Jessica Jackson',
  },
  {
    id: 'meeting-2026-07-26',
    year: 'Year 1',
    date: '2026-07-26',
    term: 'Summer II 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Chris Mound',
    communityBuilder: 'Victoria Vildosola',
    recorder: 'Reynaldo Dulaney',
    timeKeeper: 'Jessica Jackson',
    processObserver: 'Sergiy Bryk',
  },
  {
    id: 'meeting-2026-08-23',
    year: 'Year 1',
    date: '2026-08-23',
    term: 'Summer II 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Victoria Vildosola',
    communityBuilder: 'Jessica Jackson',
    recorder: 'Sergiy Bryk',
    timeKeeper: 'Tracy Rico',
    processObserver: 'Monica Romero',
  },
  {
    id: 'meeting-2026-09-20',
    year: 'Year 2',
    date: '2026-09-20',
    term: 'Fall I 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Sergiy Bryk',
    communityBuilder: 'Celia Cipres',
    recorder: 'Chris Mound',
    timeKeeper: 'Victoria Vildosola',
    processObserver: '',
  },
  {
    id: 'meeting-2026-10-18',
    year: 'Year 2',
    date: '2026-10-18',
    term: 'Fall I 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Jessica Jackson',
    communityBuilder: 'Victoria Vildosola',
    recorder: 'Tracy Rico',
    timeKeeper: 'Monica Romero',
    processObserver: 'Jessica Leon',
  },
  {
    id: 'meeting-2026-11-15',
    year: 'Year 2',
    date: '2026-11-15',
    term: 'Fall II 2026',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Jessica Leon',
    communityBuilder: 'Tracy Rico',
    recorder: 'Victoria Vildosola',
    timeKeeper: 'Reynaldo Dulaney',
    processObserver: 'Bashiyra Windley',
  },
  {
    id: 'meeting-2026-12-13',
    year: 'Year 2',
    date: '2026-12-13',
    term: 'Fall II 2026',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Elanis Cruz',
    communityBuilder: 'Bashiyra Windley',
    recorder: 'Asa Jones-McGhee',
    timeKeeper: '',
    processObserver: 'Chris Mound',
  },
  {
    id: 'meeting-2027-01-31',
    year: 'Year 2',
    date: '2027-01-31',
    term: 'Spring I 2027',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Chris Mound',
    communityBuilder: 'Jessica Jackson',
    recorder: 'Reynaldo Dulaney',
    timeKeeper: 'Tracy Rico',
    processObserver: 'Sergiy Bryk',
  },
  {
    id: 'meeting-2027-02-21',
    year: 'Year 2',
    date: '2027-02-21',
    term: 'Spring I 2027',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Asa Jones-McGhee',
    communityBuilder: 'Jessica Leon',
    recorder: 'Chris Mound',
    timeKeeper: 'Bashiyra Windley',
    processObserver: 'Reynaldo Dulaney',
  },
  {
    id: 'meeting-2027-03-21',
    year: 'Year 2',
    date: '2027-03-21',
    term: 'Spring II 2027',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Tracy Rico',
    communityBuilder: 'Asa Jones-McGhee',
    recorder: 'Patrick J. Harris',
    timeKeeper: 'Chris Mound',
    processObserver: 'Celia Cipres',
  },
  {
    id: 'meeting-2027-04-11',
    year: 'Year 2',
    date: '2027-04-11',
    term: 'Spring II 2027',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Celia Cipres',
    communityBuilder: 'Sergiy Bryk',
    recorder: 'Bashiyra Windley',
    timeKeeper: 'Elanis Cruz',
    processObserver: 'Tracy Rico',
  },
  {
    id: 'meeting-2027-05-23',
    year: 'Year 2',
    date: '2027-05-23',
    term: 'Summer I 2027',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Bashiyra Windley',
    communityBuilder: 'Elanis Cruz',
    recorder: '',
    timeKeeper: 'Asa Jones-McGhee',
    processObserver: 'Patrick J. Harris',
  },
  {
    id: 'meeting-2027-06-13',
    year: 'Year 2',
    date: '2027-06-13',
    term: 'Summer I 2027',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Celia Cipres',
    communityBuilder: 'Monica Romero',
    recorder: 'Jessica Jackson',
    timeKeeper: 'Patrick J. Harris',
    processObserver: 'Asa Jones-McGhee',
  },
  {
    id: 'meeting-2027-07-11',
    year: 'Year 2',
    date: '2027-07-11',
    term: 'Summer II 2027',
    meetingNumber: 'Cohort Meeting 1',
    facilitator: 'Monica Romero',
    communityBuilder: 'Reynaldo Dulaney',
    recorder: '',
    timeKeeper: 'Celia Cipres',
    processObserver: 'Jessica Jackson',
  },
  {
    id: 'meeting-2027-08-01',
    year: 'Year 2',
    date: '2027-08-01',
    term: 'Summer II 2027',
    meetingNumber: 'Cohort Meeting 2',
    facilitator: 'Patrick J. Harris',
    communityBuilder: 'Chris Mound',
    recorder: '',
    timeKeeper: 'Sergiy Bryk',
    processObserver: 'Elanis Cruz',
  },
]

function createCohortAttendanceSeed(): CohortAttendanceState {
  const attendance: CohortAttendanceState = {}

  for (const contact of cohortContactsSeed) {
    attendance[
      getAttendanceKey(
        contact.id,
        'meeting-2025-09-21',
      )
    ] =
      contact.id === 'asa-jones-mcghee'
        ? 'A'
        : 'X'

    attendance[
      getAttendanceKey(
        contact.id,
        'meeting-2025-10-12',
      )
    ] = 'X'
  }

  return attendance
}

const cohortAttendanceSeed = createCohortAttendanceSeed()

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

function createEmptyMeetingForm(): CohortMeetingFormState {
  return {
    date: '',
    term: '',
    calendarYear: '',
    meetingNumber: '',
  }
}

function sanitizeMeetingYear(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

function buildCohortMeetingTerm(
  termInput: string,
  calendarYear: string,
): string {
  const normalizedTerm = termInput
    .trim()
    .replace(/\s+\d{4}$/, '')
    .replace(/\s+/g, ' ')

  const normalizedYear = sanitizeMeetingYear(calendarYear)

  if (!normalizedTerm || normalizedYear.length !== 4) {
    return ''
  }

  return `${normalizedTerm} ${normalizedYear}`
}

function normalizeCohortMeetingNumber(value: string): string {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return ''
  }

  if (/^\d+$/.test(normalizedValue)) {
    return `Cohort Meeting ${Number(normalizedValue)}`
  }

  return normalizedValue
}

function getNextCohortMeetingLabel(
  meetings: readonly CohortMeetingRecord[],
  term: string,
): string {
  let highestMeetingNumber = 0

  for (const meeting of meetings) {
    if (
      meeting.term.localeCompare(term, 'en-US', {
        sensitivity: 'base',
      }) !== 0
    ) {
      continue
    }

    const match = /^Cohort Meeting\s+(\d+)$/i.exec(
      meeting.meetingNumber.trim(),
    )

    if (!match?.[1]) {
      continue
    }

    highestMeetingNumber = Math.max(
      highestMeetingNumber,
      Number(match[1]),
    )
  }

  return `Cohort Meeting ${highestMeetingNumber + 1}`
}

function getCohortProgramYear(
  meetingDate: string,
): CohortProgramYear {
  return meetingDate < COHORT_YEAR_TWO_START_DATE
    ? 'Year 1'
    : 'Year 2'
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

function getAttendanceKey(
  contactId: string,
  meetingId: string,
): string {
  return `${contactId}::${meetingId}`
}

function normalizeAttendanceMark(
  value: string,
): CohortAttendanceMark {
  const normalizedValue = value.trim().toUpperCase()

  if (normalizedValue === 'X') {
    return 'X'
  }

  if (normalizedValue === 'A') {
    return 'A'
  }

  return ''
}

function getAttendanceMeetingCode(
  meeting: CohortMeetingRecord,
): string {
  const yearCode = meeting.year === 'Year 1' ? 'Y1' : 'Y2'

  const termParts = meeting.term.split(' ')
  const season = termParts[0] ?? ''
  const termSequence = termParts[1] ?? ''

  let seasonCode = season

  switch (season) {
    case 'Fall':
      seasonCode = 'F'
      break

    case 'Spring':
      seasonCode = 'S'
      break

    case 'Summer':
      seasonCode = 'SU'
      break

    case 'Winter':
      seasonCode = 'W'
      break
  }

  const sequenceCode =
    termSequence === 'I'
      ? '1'
      : termSequence === 'II'
        ? '2'
        : ''

  const meetingMatch = /^Cohort Meeting\s+(\d+)$/i.exec(
    meeting.meetingNumber.trim(),
  )

  const meetingCode = meetingMatch?.[1]
    ? `C${meetingMatch[1]}`
    : meeting.meetingNumber.trim() || '—'

  return `${yearCode}, ${seasonCode}${sequenceCode}, ${meetingCode}`
}

function normalizeRoleParticipantName(value: string): string {
  const normalizedValue = value.trim().toLocaleLowerCase('en-US')

  if (normalizedValue === 'patrick harris') {
    return 'patrick j. harris'
  }

  if (
    normalizedValue === 'dr. cmo' ||
    normalizedValue === 'dr. cheryl-marie osborne'
  ) {
    return 'dr. cheryl-marie osborne (mentor)'
  }

  return normalizedValue
}

function getPacificDateKey(currentDate: Date): string {
  const dateParts = pacificDateKeyFormatter.formatToParts(currentDate)

  const year = dateParts.find((part) => part.type === 'year')?.value
  const month = dateParts.find((part) => part.type === 'month')?.value
  const day = dateParts.find((part) => part.type === 'day')?.value

  if (!year || !month || !day) {
    return currentDate.toISOString().slice(0, 10)
  }

  return `${year}-${month}-${day}`
}

function formatCohortMeetingDate(date: string): string {
  const meetingDate = new Date(`${date}T12:00:00Z`)
  const monthLabel =
    birthdayMonthLabels[meetingDate.getUTCMonth()]

  if (!monthLabel) {
    return date
  }

  return `${cohortMeetingWeekdayFormatter.format(meetingDate)}, ${monthLabel} ${meetingDate.getUTCDate()}, ${meetingDate.getUTCFullYear()}`
}

function getRoleNameOptions(
  contacts: readonly CohortContactRecord[],
): string[] {
  const names = [
    ...contacts.map((contact) => contact.name),
    ...formerCohortMembers.map((member) => member.name),
  ]

  return [...new Set(names)].sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'en-US', {
      sensitivity: 'base',
    }),
  )
}

function isFormerMemberAssignmentInvalid(
  meetingDate: string,
  value: string,
): boolean {
  const normalizedValue = normalizeRoleParticipantName(value)

  return formerCohortMembers.some(
    (member) =>
      normalizeRoleParticipantName(member.name) === normalizedValue &&
      meetingDate > member.inactiveAfterDate,
  )
}

function doesRoleMatchSearch(
  value: string,
  searchValue: string,
): boolean {
  const normalizedSearch = searchValue
    .trim()
    .toLocaleLowerCase('en-US')

  if (!normalizedSearch) {
    return false
  }

  return value
    .trim()
    .toLocaleLowerCase('en-US')
    .includes(normalizedSearch)
}

function isDuplicateMeetingRoleAssignment(
  meeting: CohortMeetingRecord,
  value: string,
): boolean {
  const normalizedValue = normalizeRoleParticipantName(value)

  if (!normalizedValue) {
    return false
  }

  const meetingRoleValues = [
    meeting.facilitator,
    meeting.communityBuilder,
    meeting.recorder,
    meeting.timeKeeper,
    meeting.processObserver,
  ]

  const matchingRoleCount = meetingRoleValues.filter(
    (roleValue) =>
      normalizeRoleParticipantName(roleValue) === normalizedValue,
  ).length

  return matchingRoleCount > 1
}

function isCountableRoleAssignment(
  meeting: CohortMeetingRecord,
  roleValue: string,
  participantName: string,
): boolean {
  if (!roleValue.trim()) {
    return false
  }

  if (isFormerMemberAssignmentInvalid(meeting.date, roleValue)) {
    return false
  }

  return (
    normalizeRoleParticipantName(roleValue) ===
    normalizeRoleParticipantName(participantName)
  )
}

function buildCohortRoleSummary(
  meetings: readonly CohortMeetingRecord[],
  contacts: readonly CohortContactRecord[],
): CohortRoleSummaryRecord[] {
  const mentorNames = new Set(
    contacts
      .filter((contact) => contact.isMentor)
      .map((contact) => normalizeRoleParticipantName(contact.name)),
  )

  const participantNames = getRoleNameOptions(contacts)
    .filter(
      (name) =>
        !mentorNames.has(normalizeRoleParticipantName(name)),
    )
    .sort((firstName, secondName) =>
      firstName.localeCompare(secondName, 'en-US', {
        sensitivity: 'base',
      }),
    )

  return participantNames.map((name) => {
    let facilitator = 0
    let communityBuilder = 0
    let recorder = 0
    let timeKeeper = 0
    let processObserver = 0

    for (const meeting of meetings) {
      if (
        isCountableRoleAssignment(
          meeting,
          meeting.facilitator,
          name,
        )
      ) {
        facilitator += 1
      }

      if (
        isCountableRoleAssignment(
          meeting,
          meeting.communityBuilder,
          name,
        )
      ) {
        communityBuilder += 1
      }

      if (
        isCountableRoleAssignment(
          meeting,
          meeting.recorder,
          name,
        )
      ) {
        recorder += 1
      }

      if (
        isCountableRoleAssignment(
          meeting,
          meeting.timeKeeper,
          name,
        )
      ) {
        timeKeeper += 1
      }

      if (
        isCountableRoleAssignment(
          meeting,
          meeting.processObserver,
          name,
        )
      ) {
        processObserver += 1
      }
    }

    return {
      name,
      facilitator,
      communityBuilder,
      recorder,
      timeKeeper,
      processObserver,
      total:
        facilitator +
        communityBuilder +
        recorder +
        timeKeeper +
        processObserver,
    }
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
  contactStatuses,
  onAddContact,
  onUpdateContact,
  onUpdateStatus,
}: CohortContactPageProps) {
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState(createEmptyContactForm)
  const [formError, setFormError] = useState('')

  const sortedContacts = sortCohortContacts(contacts)

  const activeContacts = sortedContacts.filter(
    (contact) =>
      contact.isMentor ||
      (contactStatuses[contact.id] ?? 'Active') === 'Active',
  )

  const inactiveContacts = sortedContacts.filter(
    (contact) =>
      !contact.isMentor &&
      (contactStatuses[contact.id] ?? 'Active') === 'Inactive',
  )

  const inactiveContactNames = [
    ...new Set([
      ...formerCohortMembers.map((member) => member.name),
      ...inactiveContacts.map((contact) => contact.name),
    ]),
  ].sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'en-US', {
      sensitivity: 'base',
    }),
  )

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

  function resizeContactTextarea(
    textarea: HTMLTextAreaElement,
  ): void {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
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
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {activeContacts.map((contact) => {
              const contactStatus =
                contactStatuses[contact.id] ?? 'Active'

              return (
                <tr key={contact.id}>
                  <td
                    className={
                      contact.isMentor
                        ? 'contact-mentor-name'
                        : undefined
                    }
                  >
                    <input
                      type="text"
                      className="contact-cell-input"
                      defaultValue={contact.name}
                      aria-label={`${contact.name} name`}
                      onBlur={(event) => {
                        const nextName =
                          event.currentTarget.value.trim()

                        if (!nextName) {
                          event.currentTarget.value = contact.name
                          return
                        }

                        event.currentTarget.value = nextName

                        if (nextName !== contact.name) {
                          onUpdateContact(contact.id, {
                            name: nextName,
                          })
                        }
                      }}
                    />
                  </td>

                  <td>
                    <select
                      className="contact-cell-select"
                      value={contact.timeZone}
                      aria-label={`${contact.name} time zone`}
                      onChange={(event) => {
                        const nextTimeZone = event.target.value

                        if (!isCohortTimeZone(nextTimeZone)) {
                          return
                        }

                        onUpdateContact(contact.id, {
                          timeZone: nextTimeZone,
                        })
                      }}
                    >
                      {cohortTimeZoneOptions.map((timeZone) => (
                        <option key={timeZone} value={timeZone}>
                          {timeZone}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="text"
                      inputMode="tel"
                      className="contact-cell-input"
                      defaultValue={formatPhoneNumber(
                        contact.phoneDigits,
                      )}
                      aria-label={`${contact.name} phone number`}
                      onBlur={(event) => {
                        const phoneDigits = sanitizePhoneDigits(
                          event.currentTarget.value,
                        )

                        if (phoneDigits.length !== 10) {
                          event.currentTarget.value =
                            formatPhoneNumber(contact.phoneDigits)
                          return
                        }

                        event.currentTarget.value =
                          formatPhoneNumber(phoneDigits)

                        if (phoneDigits !== contact.phoneDigits) {
                          onUpdateContact(contact.id, {
                            phoneDigits,
                          })
                        }
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="email"
                      className="contact-cell-input contact-email-input"
                      defaultValue={contact.email}
                      aria-label={`${contact.name} email address`}
                      onBlur={(event) => {
                        const normalizedEmail =
                          normalizeCohortEmail(
                            event.currentTarget.value,
                          )

                        if (
                          !normalizedEmail ||
                          !normalizedEmail.includes('@') ||
                          !normalizedEmail.includes('.')
                        ) {
                          event.currentTarget.value =
                            contact.email
                          return
                        }

                        event.currentTarget.value =
                          normalizedEmail

                        if (normalizedEmail !== contact.email) {
                          onUpdateContact(contact.id, {
                            email: normalizedEmail,
                          })
                        }
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="contact-cell-input"
                      defaultValue={contact.industry}
                      aria-label={`${contact.name} industry`}
                      onBlur={(event) => {
                        const nextIndustry =
                          event.currentTarget.value.trim()

                        event.currentTarget.value = nextIndustry

                        if (nextIndustry !== contact.industry) {
                          onUpdateContact(contact.id, {
                            industry: nextIndustry,
                          })
                        }
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="contact-cell-input"
                      defaultValue={formatBirthday(
                        contact.birthdayMonth,
                        contact.birthdayDay,
                      )}
                      placeholder="M/DD"
                      aria-label={`${contact.name} birthday`}
                      onBlur={(event) => {
                        const birthdayValue =
                          event.currentTarget.value.trim()

                        const currentBirthday = formatBirthday(
                          contact.birthdayMonth,
                          contact.birthdayDay,
                        )

                        if (!birthdayValue) {
                          event.currentTarget.value = ''

                          if (
                            contact.birthdayMonth !== null ||
                            contact.birthdayDay !== null
                          ) {
                            onUpdateContact(contact.id, {
                              birthdayMonth: null,
                              birthdayDay: null,
                            })
                          }

                          return
                        }

                        if (birthdayValue === currentBirthday) {
                          return
                        }

                        const parsedBirthday =
                          parseBirthdayInput(birthdayValue)

                        if (!parsedBirthday) {
                          event.currentTarget.value =
                            currentBirthday
                          return
                        }

                        event.currentTarget.value =
                          formatBirthday(
                            parsedBirthday.month,
                            parsedBirthday.day,
                          )

                        onUpdateContact(contact.id, {
                          birthdayMonth: parsedBirthday.month,
                          birthdayDay: parsedBirthday.day,
                        })
                      }}
                    />
                  </td>

                  <td>
                    <textarea
                      className="contact-cell-textarea"
                      rows={1}
                      defaultValue={contact.dissertationInterest}
                      aria-label={`${contact.name} dissertation interest`}
                      ref={(textarea) => {
                        if (textarea !== null) {
                          resizeContactTextarea(textarea)
                        }
                      }}
                      onInput={(event) => {
                        resizeContactTextarea(event.currentTarget)
                      }}
                      onBlur={(event) => {
                        const nextInterest =
                          event.currentTarget.value.trim()

                        event.currentTarget.value = nextInterest
                        resizeContactTextarea(event.currentTarget)

                        if (
                          nextInterest !==
                          contact.dissertationInterest
                        ) {
                          onUpdateContact(contact.id, {
                            dissertationInterest: nextInterest,
                          })
                        }
                      }}
                    />
                  </td>

                  <td className="contact-status-cell">
                    {contact.isMentor ? (
                      <span className="contact-status-mentor">
                        —
                      </span>
                    ) : (
                      <select
                        className="contact-status-select"
                        value={contactStatus}
                        aria-label={`${contact.name} status`}
                        onChange={(event) => {
                          const nextStatus =
                            event.target.value

                          if (
                            nextStatus !== 'Active' &&
                            nextStatus !== 'Inactive'
                          ) {
                            return
                          }

                          onUpdateStatus(
                            contact.id,
                            nextStatus,
                          )
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section
        className="contacts-inactive-section"
        aria-labelledby="inactive-contacts-title"
      >
        <div className="contacts-inactive-heading">
          <h2 id="inactive-contacts-title">Inactive</h2>
          <span>{inactiveContactNames.length}</span>
        </div>

        {inactiveContactNames.length === 0 ? (
          <p className="contacts-inactive-empty">
            No inactive cohort members.
          </p>
        ) : (
          <ul className="contacts-inactive-list">
            {inactiveContactNames.map((contactName) => (
              <li key={contactName}>{contactName}</li>
            ))}
          </ul>
        )}
      </section>

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

function CohortDatesRolesPage({
  contacts,
  meetings,
  onAddMeeting,
  onUpdateRole,
}: CohortDatesRolesPageProps) {
  const [nameSearch, setNameSearch] = useState('')
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false)
  const [newMeeting, setNewMeeting] = useState(createEmptyMeetingForm)
  const [meetingFormError, setMeetingFormError] = useState('')

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 60_000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const currentPacificDate = getPacificDateKey(currentDate)

  const totalMeetings = meetings.length

  const meetingsCompleted = meetings.filter(
    (meeting) => meeting.date < currentPacificDate,
  ).length

  const percentCompleted =
    totalMeetings === 0
      ? 0
      : Math.round((meetingsCompleted / totalMeetings) * 100)

  const nextUpcomingMeetingId =
    meetings.find((meeting) => meeting.date >= currentPacificDate)?.id ?? null

  const newMeetingTerm = buildCohortMeetingTerm(
    newMeeting.term,
    newMeeting.calendarYear,
  )

  const suggestedMeetingLabel = newMeetingTerm
    ? getNextCohortMeetingLabel(meetings, newMeetingTerm)
    : ''

  const roleNameOptions = getRoleNameOptions(contacts)
  const roleSummary = buildCohortRoleSummary(meetings, contacts)

  const roleSummaryTotals = roleSummary.reduce(
    (totals, summary) => ({
      facilitator: totals.facilitator + summary.facilitator,
      communityBuilder:
        totals.communityBuilder + summary.communityBuilder,
      recorder: totals.recorder + summary.recorder,
      timeKeeper: totals.timeKeeper + summary.timeKeeper,
      processObserver:
        totals.processObserver + summary.processObserver,
      total: totals.total + summary.total,
    }),
    {
      facilitator: 0,
      communityBuilder: 0,
      recorder: 0,
      timeKeeper: 0,
      processObserver: 0,
      total: 0,
    },
  )

  function openAddMeetingModal(): void {
    setNewMeeting(createEmptyMeetingForm())
    setMeetingFormError('')
    setIsAddMeetingOpen(true)
  }

  function closeAddMeetingModal(): void {
    setNewMeeting(createEmptyMeetingForm())
    setMeetingFormError('')
    setIsAddMeetingOpen(false)
  }

  function handleAddMeeting(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()

    const normalizedDate = newMeeting.date.trim()
    const normalizedTerm = buildCohortMeetingTerm(
      newMeeting.term,
      newMeeting.calendarYear,
    )
    const normalizedMeetingNumber =
      normalizeCohortMeetingNumber(newMeeting.meetingNumber)

    if (!normalizedDate) {
      setMeetingFormError('Meeting Date is required.')
      return
    }

    if (!normalizedTerm) {
      setMeetingFormError(
        'Enter a Term and a four-digit Year.',
      )
      return
    }

    const meeting: CohortMeetingRecord = {
      id: crypto.randomUUID(),
      year: getCohortProgramYear(normalizedDate),
      date: normalizedDate,
      term: normalizedTerm,
      meetingNumber: normalizedMeetingNumber,
      facilitator: '',
      communityBuilder: '',
      recorder: '',
      timeKeeper: '',
      processObserver: '',
    }

    onAddMeeting(meeting)
    closeAddMeetingModal()
  }

  function renderRoleCell(
    meeting: CohortMeetingRecord,
    roleField: CohortMeetingRoleField,
    value: string,
  ): ReactNode {
    const isBlank = value.trim().length === 0
    const isInactive = isFormerMemberAssignmentInvalid(
      meeting.date,
      value,
    )
    const isSearchMatch = doesRoleMatchSearch(value, nameSearch)
    const isDuplicate = isDuplicateMeetingRoleAssignment(
      meeting,
      value,
    )

    const className = [
      'cohort-meeting-role-input',
      isBlank ? 'cohort-meeting-role-input-empty' : '',
      isInactive ? 'cohort-meeting-role-input-inactive' : '',
      isSearchMatch ? 'cohort-meeting-role-input-search-match' : '',
      isDuplicate ? 'cohort-meeting-role-input-duplicate' : '',
    ]
      .filter((classItem) => classItem.length > 0)
      .join(' ')

    let title = value || 'Role unassigned'

    if (isDuplicate) {
      title =
        'QC warning: This person is assigned to more than one role for this cohort meeting.'
    } else if (isInactive) {
      title =
        'Patrick J. Harris left the cohort after July 26, 2026. Reassign this role.'
    }

    return (
      <td className="cohort-meeting-role-cell">
        <input
          type="text"
          list="cohort-role-name-options"
          className={className}
          value={value}
          title={title}
          onChange={(event) =>
            onUpdateRole(
              meeting.id,
              roleField,
              event.target.value,
            )
          }
        />
      </td>
    )
  }

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Dates & Roles</h1>
      </header>

      <div className="cohort-dates-toolbar">
        <div className="cohort-dates-toolbar-controls">
          <label className="cohort-dates-search">
            <span>Name Search</span>

            <input
              type="text"
              list="cohort-role-name-options"
              value={nameSearch}
              placeholder="Start typing a cohort member name"
              onChange={(event) =>
                setNameSearch(event.target.value)
              }
            />
          </label>

          <button
            type="button"
            className="cohort-add-meeting-button"
            onClick={openAddMeetingModal}
          >
            <span aria-hidden="true">+</span>
            Add Meeting
          </button>

          <button
            type="button"
            className="cohort-delete-meeting-button"
            aria-disabled="true"
            title="Delete behavior will be enabled after the meeting-selection workflow is defined."
          >
            <span aria-hidden="true">🗑️</span>
            Delete
          </button>
        </div>

        <div className="cohort-meeting-stats">
          <article className="cohort-meeting-stat-card">
            <span
              className="cohort-meeting-stat-icon"
              aria-hidden="true"
            >
              <svg
                className="cohort-meeting-stat-svg"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M7 3v4M17 3v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M3 9h18"
                  fill="none"
                  stroke="#C69214"
                  strokeWidth="2"
                />
                <rect
                  x="8.5"
                  y="12"
                  width="7"
                  height="6"
                  rx="1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 13.4v3.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <div>
              <span>Total Meetings</span>
              <strong>{totalMeetings}</strong>
            </div>
          </article>

          <article className="cohort-meeting-stat-card">
            <span
              className="cohort-meeting-stat-icon"
              aria-hidden="true"
            >
              <svg
                className="cohort-meeting-stat-svg"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                />
                <path
                  d="M7.5 12.2l3 3.1 6.2-6.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <div>
              <span>Meetings Completed</span>
              <strong>{meetingsCompleted}</strong>
            </div>
          </article>

          <article className="cohort-meeting-stat-card">
            <span
              className="cohort-meeting-stat-icon"
              aria-hidden="true"
            >
              <svg
                className="cohort-meeting-stat-svg"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <rect
                  x="3"
                  y="15"
                  width="3.5"
                  height="6"
                  rx="0.8"
                  fill="currentColor"
                />
                <rect
                  x="9"
                  y="11"
                  width="3.5"
                  height="10"
                  rx="0.8"
                  fill="currentColor"
                />
                <rect
                  x="15"
                  y="7"
                  width="3.5"
                  height="14"
                  rx="0.8"
                  fill="currentColor"
                />
                <path
                  d="M4.5 12.5l5-4 4 1.5 6-6"
                  fill="none"
                  stroke="#C69214"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 4H20v3.5"
                  fill="none"
                  stroke="#C69214"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <div>
              <span>Percent Completed</span>
              <strong>{percentCompleted}%</strong>
            </div>
          </article>
        </div>
      </div>

      <datalist id="cohort-role-name-options">
        {roleNameOptions.map((name) => (
          <option key={name} value={name}>
            {name === 'Patrick J. Harris'
              ? 'Former cohort member'
              : name}
          </option>
        ))}
      </datalist>

      <datalist id="cohort-term-options">
        {cohortTermOptions.map((term) => (
          <option key={term} value={term} />
        ))}
      </datalist>

      <div className="cohort-dates-layout">
        <section className="cohort-meetings-panel">
          <div className="cohort-meetings-table-frame">
            <table className="cohort-meetings-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Date</th>
                  <th>Term</th>
                  <th>Meeting #</th>
                  <th>Facilitator</th>
                  <th>Community Builder</th>
                  <th>Recorder</th>
                  <th>Timekeeper</th>
                  <th>Process Observer</th>
                </tr>
              </thead>

              <tbody>
                {meetings.map((meeting, index) => {
                  const previousMeeting =
                    index > 0 ? meetings[index - 1] : undefined

                  const isYearTwoStart =
                    meeting.year === 'Year 2' &&
                    previousMeeting?.year === 'Year 1'

                  const isPast =
                    meeting.date < currentPacificDate

                  const isUpcoming =
                    meeting.id === nextUpcomingMeetingId

                  const rowClassName = [
                    isPast
                      ? 'cohort-meeting-row-past'
                      : '',
                    isUpcoming
                      ? 'cohort-meeting-row-upcoming'
                      : '',
                    isYearTwoStart
                      ? 'cohort-meeting-year-two-start'
                      : '',
                  ]
                    .filter(
                      (classItem) => classItem.length > 0,
                    )
                    .join(' ')

                  return (
                    <tr
                      key={meeting.id}
                      className={rowClassName}
                    >
                      <td>{meeting.year}</td>
                      <td>
                        {formatCohortMeetingDate(
                          meeting.date,
                        )}
                      </td>
                      <td>{meeting.term}</td>
                      <td>{meeting.meetingNumber}</td>

                      {renderRoleCell(
                        meeting,
                        'facilitator',
                        meeting.facilitator,
                      )}

                      {renderRoleCell(
                        meeting,
                        'communityBuilder',
                        meeting.communityBuilder,
                      )}

                      {renderRoleCell(
                        meeting,
                        'recorder',
                        meeting.recorder,
                      )}

                      {renderRoleCell(
                        meeting,
                        'timeKeeper',
                        meeting.timeKeeper,
                      )}

                      {renderRoleCell(
                        meeting,
                        'processObserver',
                        meeting.processObserver,
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="cohort-role-summary-panel">
          <div className="cohort-role-summary-heading">
            <h2>Role Assignment Summary</h2>
            <p>
              Valid historical and scheduled assignments
            </p>
          </div>

          <div className="cohort-role-summary-table-frame">
            <table className="cohort-role-summary-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Facilitator</th>
                  <th>Community Builder</th>
                  <th>Recorder</th>
                  <th>Time Keeper</th>
                  <th>Process Observer</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {roleSummary.map((summary) => (
                  <tr
                    key={summary.name}
                    className={
                      doesRoleMatchSearch(
                        summary.name,
                        nameSearch,
                      )
                        ? 'cohort-role-summary-row-search-match'
                        : undefined
                    }
                  >
                    <td
                      className={
                        summary.name === 'Patrick J. Harris'
                          ? 'cohort-role-summary-former-member-name'
                          : undefined
                      }
                    >
                      {summary.name}
                    </td>
                    <td>{summary.facilitator}</td>
                    <td>{summary.communityBuilder}</td>
                    <td>{summary.recorder}</td>
                    <td>{summary.timeKeeper}</td>
                    <td>{summary.processObserver}</td>
                    <td>{summary.total}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="cohort-role-summary-totals-row">
                  <td>TOTALS</td>
                  <td>{roleSummaryTotals.facilitator}</td>
                  <td>{roleSummaryTotals.communityBuilder}</td>
                  <td>{roleSummaryTotals.recorder}</td>
                  <td>{roleSummaryTotals.timeKeeper}</td>
                  <td>{roleSummaryTotals.processObserver}</td>
                  <td>{roleSummaryTotals.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </aside>
      </div>

      <div className="cohort-dates-former-note cohort-dates-former-note-bottom">
        Patrick J. Harris is retained for historical accuracy.
        Assignments after July 26, 2026 are flagged in orange and
        excluded from role totals until reassigned.
      </div>

      {isAddMeetingOpen && (
        <div className="meeting-modal-backdrop">
          <section
            className="meeting-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-meeting-title"
          >
            <header className="meeting-modal-header">
              <h2 id="add-meeting-title">
                Add Cohort Meeting
              </h2>

              <button
                type="button"
                className="meeting-modal-close"
                onClick={closeAddMeetingModal}
                aria-label="Close Add Cohort Meeting window"
              >
                ×
              </button>
            </header>

            <form
              className="meeting-form"
              onSubmit={handleAddMeeting}
            >
              <div className="meeting-form-grid">
                <label className="meeting-form-field">
                  <span>Meeting Date</span>

                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(event) =>
                      setNewMeeting((currentMeeting) => ({
                        ...currentMeeting,
                        date: event.target.value,
                      }))
                    }
                  />

                  <small>
                    Select or enter the meeting date. The table
                    will apply the standard display format.
                  </small>
                </label>

                <label className="meeting-form-field">
                  <span>Term</span>

                  <input
                    type="text"
                    list="cohort-term-options"
                    value={newMeeting.term}
                    placeholder="Example: Summer II"
                    onChange={(event) =>
                      setNewMeeting((currentMeeting) => ({
                        ...currentMeeting,
                        term: event.target.value,
                      }))
                    }
                  />

                  <small>
                    Start typing Spring, Summer, Fall, or Winter.
                    You may add I or II when needed.
                  </small>
                </label>

                <label className="meeting-form-field">
                  <span>Year</span>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={newMeeting.calendarYear}
                    placeholder="YYYY"
                    onChange={(event) =>
                      setNewMeeting((currentMeeting) => ({
                        ...currentMeeting,
                        calendarYear:
                          sanitizeMeetingYear(event.target.value),
                      }))
                    }
                  />

                  <small>
                    Enter the four-digit calendar year.
                  </small>
                </label>

                <label className="meeting-form-field">
                  <span>Cohort Meeting</span>

                  <input
                    type="text"
                    value={newMeeting.meetingNumber}
                    placeholder={
                      suggestedMeetingLabel ||
                      'Example: 1 or Special Meeting'
                    }
                    onChange={(event) =>
                      setNewMeeting((currentMeeting) => ({
                        ...currentMeeting,
                        meetingNumber: event.target.value,
                      }))
                    }
                  />

                  <small>
                    Entering 1 becomes Cohort Meeting 1.
                    Custom text is preserved. Leave blank if this
                    field should remain blank.
                    {suggestedMeetingLabel
                      ? ` Suggested: ${suggestedMeetingLabel}.`
                      : ''}
                  </small>
                </label>
              </div>

              {meetingFormError && (
                <p className="meeting-form-error" role="alert">
                  {meetingFormError}
                </p>
              )}

              <div className="meeting-modal-actions">
                <button
                  type="button"
                  className="meeting-cancel-button"
                  onClick={closeAddMeetingModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="meeting-save-button"
                >
                  Save
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}

function CohortAttendancePage({
  contacts,
  meetings,
  attendance,
  onUpdateAttendance,
}: CohortAttendancePageProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentDate(new Date())
    }, 60_000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  const currentPacificDate = getPacificDateKey(currentDate)

  const nextUpcomingMeetingId =
    meetings.find(
      (meeting) => meeting.date >= currentPacificDate,
    )?.id ?? null

  const sortedContacts = sortCohortContacts(contacts)

  const studentCount = contacts.filter(
    (contact) => !contact.isMentor,
  ).length

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Attendance</h1>
      </header>

      <div className="attendance-key">
        <span>
          <strong>X</strong> = Attended
        </span>

        <span>
          <strong>A</strong> = Absent
        </span>
      </div>

      <div className="attendance-table-frame">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="attendance-name-column">
                Name
              </th>

              {meetings.map((meeting) => (
                <th
                  key={meeting.id}
                  className={`attendance-meeting-column${meeting.id === nextUpcomingMeetingId
                    ? ' attendance-meeting-column-next'
                    : ''
                    }`}
                  title={`${formatCohortMeetingDate(meeting.date)} | ${meeting.term} | ${meeting.meetingNumber || 'Meeting number not entered'}`}
                >
                  <span className="attendance-meeting-code">
                    {getAttendanceMeetingCode(meeting)}
                  </span>

                  <span className="attendance-meeting-date">
                    {formatCohortMeetingDate(meeting.date)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedContacts.map((contact) => (
              <tr key={contact.id}>
                <td
                  className={`attendance-name-column${contact.isMentor
                    ? ' attendance-mentor-name'
                    : ''
                    }`}
                >
                  {contact.name}
                </td>

                {meetings.map((meeting) => {
                  const attendanceKey = getAttendanceKey(
                    contact.id,
                    meeting.id,
                  )

                  const attendanceMark =
                    attendance[attendanceKey] ?? ''

                  return (
                    <td
                      key={meeting.id}
                      className={`attendance-mark-cell${meeting.id === nextUpcomingMeetingId
                        ? ' attendance-upcoming-meeting-cell'
                        : ''
                        }`}
                    >
                      <input
                        type="text"
                        maxLength={1}
                        className={`attendance-mark-input${attendanceMark === 'A'
                          ? ' attendance-mark-absent'
                          : attendanceMark === 'X'
                            ? ' attendance-mark-present'
                            : ''
                          }`}
                        value={attendanceMark}
                        aria-label={`${contact.name}, ${formatCohortMeetingDate(meeting.date)} attendance`}
                        title="Enter X for attended or A for absent"
                        onChange={(event) =>
                          onUpdateAttendance(
                            contact.id,
                            meeting.id,
                            normalizeAttendanceMark(
                              event.target.value,
                            ),
                          )
                        }
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-count-summary">
        <span>
          Students = <strong>{studentCount}</strong>
        </span>

        <span>
          Total with Dr. CMO ={' '}
          <strong>{contacts.length}</strong>
        </span>
      </div>
    </section>
  )
}

function CohortNormsPage() {
  type CohortNormSectionKey =
    | 'development'
    | 'about'
    | 'sample'
    | 'participation'
    | 'communication'
    | 'support'
    | 'meeting'
    | 'accountability'

  interface CohortNormsContent {
    readonly development: string
    readonly about: string
    readonly sample: string
    readonly participation: string
    readonly communication: string
    readonly support: string
    readonly meeting: string
    readonly accountability: string
  }

  const initialNormsContent: CohortNormsContent = {
    development:
      "As part of our first two cohort meetings, we will develop Norms to guide our time together. Below is a description of what a norm is, followed by a few samples. Prior to Cohort #1, please take a few minutes to add norms that you would like our cohort to consider. From there, we will discuss ideas, combine like concepts and finalize our cohort's norms.",
    about: [
      'Norms are expectations for behaviors that are widely accepted by people within an organization.',
      'Norms govern how we behave.',
      'Norms can be productive or unproductive.',
      'Can be formal or informal.',
      'Should be clear.',
      'Norms are powerful for prevention and intervention.',
      'Should be revisited frequently.',
    ].join('\n'),
    sample: [
      'We will embrace and value creativity and new ideas.',
      'We will have clear roles and responsibilities.',
      'We will be accountable to established goals.',
      'We will be constructive and positive in communication.',
      'We will assume good intent.',
    ].join('\n'),
    participation: [
      'Step up, step back',
      'Participate with purpose',
      'Be Present and Engaged',
      'Arrive with a challenge, leave with a commitment.',
      'Support with positive encouragement',
    ].join('\n'),
    communication: [
      'Story stays, learning goes',
      'Assume good intent, tend to impact',
      'Respond in a timely manner (48 hours) to preserve relationships',
      'Cohort Members will respond to all communication within 48 hours',
      'Communicate to the team if going to be late',
      'Reach out individually if you want to discuss a norm with a cohort member',
    ].join('\n'),
    support: [
      "Commit to making other people's jobs easier",
      "Don't suffer in silence; ask for help.",
      'Community ownership on norm implementation/reinforcement',
    ].join('\n'),
    meeting: [
      'Precheck all technology is working before Cohort Meetings',
      'Be on time',
      'Be in a quiet environment (especially when speaking on the mic)',
    ].join('\n'),
    accountability:
      'Revisit at each meeting - facilitator',
  }

  const [normsContent, setNormsContent] =
    useState<CohortNormsContent>(initialNormsContent)

  const [editingSection, setEditingSection] =
    useState<CohortNormSectionKey | null>(null)

  const [draftValue, setDraftValue] = useState('')

  function getNormLines(value: string): string[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  function startEditingSection(
    section: CohortNormSectionKey,
  ): void {
    setDraftValue(normsContent[section])
    setEditingSection(section)
  }

  function saveEditingSection(): void {
    if (editingSection === null) {
      return
    }

    setNormsContent((currentContent) => ({
      ...currentContent,
      [editingSection]: draftValue,
    }))

    setEditingSection(null)
    setDraftValue('')
  }

  function cancelEditingSection(): void {
    setEditingSection(null)
    setDraftValue('')
  }

  function renderEditableSection(
    section: CohortNormSectionKey,
    label: string,
    displayContent: ReactNode,
    rows: number,
    isList = true,
  ): ReactNode {
    if (editingSection === section) {
      return (
        <div className="cohort-norms-editor">
          <textarea
            autoFocus
            rows={rows}
            value={draftValue}
            aria-label={`Edit ${label}`}
            onChange={(event) =>
              setDraftValue(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault()
                saveEditingSection()
              }

              if (event.key === 'Escape') {
                event.preventDefault()
                cancelEditingSection()
              }
            }}
          />

          <div className="cohort-norms-editor-footer">
            <span>
              {isList
                ? 'Enter one item per line.'
                : 'Edit the section text.'}
            </span>

            <div className="cohort-norms-editor-actions">
              <button
                type="button"
                className="cohort-norms-cancel-button"
                onClick={cancelEditingSection}
              >
                Cancel
              </button>

              <button
                type="button"
                className="cohort-norms-save-button"
                onClick={saveEditingSection}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className="cohort-norms-editable-area"
        role="button"
        tabIndex={0}
        aria-label={`Edit ${label}`}
        title={`Click to edit ${label}`}
        onClick={() => startEditingSection(section)}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {
            event.preventDefault()
            startEditingSection(section)
          }
        }}
      >
        {displayContent}

        <span className="cohort-norms-edit-hint">
          Edit
        </span>
      </div>
    )
  }

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Norms</h1>
      </header>

      <section
        className="cohort-norms-development"
        aria-labelledby="norms-development-title"
      >
        <h2 id="norms-development-title">
          Norms Development Process
        </h2>

        {renderEditableSection(
          'development',
          'Norms Development Process',
          <p>{normsContent.development}</p>,
          5,
          false,
        )}
      </section>

      <div className="cohort-norms-reference-grid">
        <section
          className="cohort-norms-reference-card"
          aria-labelledby="about-norms-title"
        >
          <header className="cohort-norms-card-heading">
            <h2 id="about-norms-title">About Norms</h2>
          </header>

          <div className="cohort-norms-reference-content">
            {renderEditableSection(
              'about',
              'About Norms',
              <ul>
                {getNormLines(normsContent.about).map(
                  (norm, index) => (
                    <li key={`${norm}-${index}`}>
                      {norm}
                    </li>
                  ),
                )}
              </ul>,
              8,
            )}
          </div>
        </section>

        <section
          className="cohort-norms-reference-card"
          aria-labelledby="sample-norms-title"
        >
          <header className="cohort-norms-card-heading">
            <h2 id="sample-norms-title">Sample Norms</h2>
          </header>

          <div className="cohort-norms-reference-content">
            {renderEditableSection(
              'sample',
              'Sample Norms',
              <ol>
                {getNormLines(normsContent.sample).map(
                  (norm, index) => (
                    <li key={`${norm}-${index}`}>
                      {norm}
                    </li>
                  ),
                )}
              </ol>,
              7,
            )}
          </div>
        </section>
      </div>

      <section
        className="cohort-norms-main-section"
        aria-labelledby="beta-nu-norms-title"
      >
        <header className="cohort-norms-main-heading">
          <div>
            <h2 id="beta-nu-norms-title">
              Our Beta Nu Norms
            </h2>
            <p>
              Initial cohort inputs organized by theme
            </p>
          </div>
        </header>

        <div className="cohort-norms-card-grid">
          <article className="cohort-norm-card">
            <header>
              <h3>Participation &amp; Engagement</h3>
            </header>

            {renderEditableSection(
              'participation',
              'Participation and Engagement',
              <ul>
                {getNormLines(
                  normsContent.participation,
                ).map((norm, index) => (
                  <li key={`${norm}-${index}`}>
                    {norm}
                  </li>
                ))}
              </ul>,
              7,
            )}
          </article>

          <article className="cohort-norm-card">
            <header>
              <h3>
                Communication &amp; Relationships
              </h3>
            </header>

            {renderEditableSection(
              'communication',
              'Communication and Relationships',
              <ul>
                {getNormLines(
                  normsContent.communication,
                ).map((norm, index) => (
                  <li key={`${norm}-${index}`}>
                    {norm}
                  </li>
                ))}
              </ul>,
              8,
            )}
          </article>

          <article className="cohort-norm-card">
            <header>
              <h3>
                Support &amp; Shared Responsibility
              </h3>
            </header>

            {renderEditableSection(
              'support',
              'Support and Shared Responsibility',
              <ul>
                {getNormLines(
                  normsContent.support,
                ).map((norm, index) => (
                  <li key={`${norm}-${index}`}>
                    {norm}
                  </li>
                ))}
              </ul>,
              6,
            )}
          </article>

          <article className="cohort-norm-card cohort-norm-card-meeting">
            <header>
              <h3>Meeting Readiness</h3>
            </header>

            {renderEditableSection(
              'meeting',
              'Meeting Readiness',
              <ul>
                {getNormLines(
                  normsContent.meeting,
                ).map((norm, index) => (
                  <li key={`${norm}-${index}`}>
                    {norm}
                  </li>
                ))}
              </ul>,
              6,
            )}
          </article>

          <article className="cohort-norm-card">
            <header>
              <h3>Accountability</h3>
            </header>

            {renderEditableSection(
              'accountability',
              'Accountability',
              <ul>
                {getNormLines(
                  normsContent.accountability,
                ).map((norm, index) => (
                  <li key={`${norm}-${index}`}>
                    {norm}
                  </li>
                ))}
              </ul>,
              4,
            )}
          </article>
        </div>
      </section>
    </section>
  )
}

function CohortValuesVisionPage() {
  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Values and Vision</h1>
      </header>

      <div className="cohort-values-vision-stage">
        <section
          className="cohort-vision-feature"
          aria-labelledby="cohort-vision-title"
        >
          <div className="cohort-values-section-title">
            <span aria-hidden="true" />
            <h2 id="cohort-vision-title">Vision</h2>
            <span aria-hidden="true" />
          </div>

          <p className="cohort-vision-statement">
            {cohortVision}
          </p>
        </section>

        <section
          className="cohort-values-feature"
          aria-labelledby="cohort-values-title"
        >
          <div className="cohort-values-section-title">
            <span aria-hidden="true" />
            <h2 id="cohort-values-title">Values</h2>
            <span aria-hidden="true" />
          </div>

          <div className="cohort-values-list">
            {cohortValues.map((value) => (
              <article
                className="cohort-value-row"
                key={value.name}
              >
                <div
                  className="cohort-value-icon"
                  aria-hidden="true"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${value.imageFileName}`}
                    alt=""
                    className="cohort-value-image"
                  />
                </div>

                <span
                  className="cohort-value-divider"
                  aria-hidden="true"
                />

                <div className="cohort-value-line">
                  <span className="cohort-value-name">
                    {value.name}:
                  </span>

                  <span className="cohort-value-text">
                    {value.description}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function CohortSectionPlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>{title}</h1>
      </header>

      <div className="content-panel">
        <div className="placeholder-content">
          <p className="panel-eyebrow">Page Structure Created</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
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

  const [contactStatuses, setContactStatuses] =
    useState<CohortContactStatusState>(cohortContactStatusSeed)

  const [cohortMeetings, setCohortMeetings] =
    useState<readonly CohortMeetingRecord[]>(cohortMeetingsSeed)

  const [cohortAttendance, setCohortAttendance] =
    useState<CohortAttendanceState>(cohortAttendanceSeed)

  function addCohortContact(contact: CohortContactRecord): void {
    setContacts((currentContacts) => [
      ...currentContacts,
      contact,
    ])

    if (!contact.isMentor) {
      setContactStatuses((currentStatuses) => ({
        ...currentStatuses,
        [contact.id]: 'Active',
      }))
    }
  }

  function updateCohortContact(
    contactId: string,
    updates: CohortContactUpdate,
  ): void {
    const existingContact = contacts.find(
      (contact) => contact.id === contactId,
    )

    if (!existingContact) {
      return
    }

    const previousName = existingContact.name
    const nextName = updates.name

    setContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId
          ? {
            ...contact,
            ...updates,
          }
          : contact,
      ),
    )

    if (
      nextName !== undefined &&
      nextName !== previousName
    ) {
      setCohortMeetings((currentMeetings) =>
        currentMeetings.map((meeting) => ({
          ...meeting,
          facilitator:
            meeting.facilitator === previousName
              ? nextName
              : meeting.facilitator,
          communityBuilder:
            meeting.communityBuilder === previousName
              ? nextName
              : meeting.communityBuilder,
          recorder:
            meeting.recorder === previousName
              ? nextName
              : meeting.recorder,
          timeKeeper:
            meeting.timeKeeper === previousName
              ? nextName
              : meeting.timeKeeper,
          processObserver:
            meeting.processObserver === previousName
              ? nextName
              : meeting.processObserver,
        })),
      )
    }
  }

  function updateCohortContactStatus(
    contactId: string,
    status: CohortContactStatus,
  ): void {
    setContactStatuses((currentStatuses) => ({
      ...currentStatuses,
      [contactId]: status,
    }))
  }

  function updateCohortAttendance(
    contactId: string,
    meetingId: string,
    mark: CohortAttendanceMark,
  ): void {
    const attendanceKey = getAttendanceKey(
      contactId,
      meetingId,
    )

    setCohortAttendance((currentAttendance) => ({
      ...currentAttendance,
      [attendanceKey]: mark,
    }))
  }

  function addCohortMeeting(
    meeting: CohortMeetingRecord,
  ): void {
    setCohortMeetings((currentMeetings) =>
      [...currentMeetings, meeting].sort(
        (firstMeeting, secondMeeting) => {
          const dateComparison =
            firstMeeting.date.localeCompare(secondMeeting.date)

          if (dateComparison !== 0) {
            return dateComparison
          }

          return firstMeeting.meetingNumber.localeCompare(
            secondMeeting.meetingNumber,
            'en-US',
            {
              numeric: true,
              sensitivity: 'base',
            },
          )
        },
      ),
    )
  }

  function updateCohortMeetingRole(
    meetingId: string,
    roleField: CohortMeetingRoleField,
    value: string,
  ): void {
    setCohortMeetings((currentMeetings) =>
      currentMeetings.map((meeting) => {
        if (meeting.id !== meetingId) {
          return meeting
        }

        switch (roleField) {
          case 'facilitator':
            return {
              ...meeting,
              facilitator: value,
            }

          case 'communityBuilder':
            return {
              ...meeting,
              communityBuilder: value,
            }

          case 'recorder':
            return {
              ...meeting,
              recorder: value,
            }

          case 'timeKeeper':
            return {
              ...meeting,
              timeKeeper: value,
            }

          case 'processObserver':
            return {
              ...meeting,
              processObserver: value,
            }
        }
      }),
    )
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
                  contactStatuses={contactStatuses}
                  onAddContact={addCohortContact}
                  onUpdateContact={updateCohortContact}
                  onUpdateStatus={updateCohortContactStatus}
                />
              }
            />

            <Route
              path="/cohort-dates-roles"
              element={
                <CohortDatesRolesPage
                  contacts={contacts}
                  meetings={cohortMeetings}
                  onAddMeeting={addCohortMeeting}
                  onUpdateRole={updateCohortMeetingRole}
                />
              }
            />

            <Route
              path="/attendance"
              element={
                <CohortAttendancePage
                  contacts={contacts}
                  meetings={cohortMeetings}
                  attendance={cohortAttendance}
                  onUpdateAttendance={updateCohortAttendance}
                />
              }
            />

            <Route
              path="/norms"
              element={<CohortNormsPage />}
            />

            <Route
              path="/values-vision"
              element={<CohortValuesVisionPage />}
            />

            <Route
              path="/purpose-research"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Purpose & Research"
                  description="Purpose statements, research questions, and dissertation development information will be organized here."
                />
              }
            />

            <Route
              path="/data-survey"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Data Survey"
                  description="Cohort survey information and related shared data will be organized here."
                />
              }
            />

            <Route
              path="/tlsi-dates"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort TLSI Dates"
                  description="TLSI milestones, dates, responsibilities, and related reminders will be organized here."
                />
              }
            />

            <Route
              path="/book-list"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Book List"
                  description="Required and recommended books and course resources will be maintained here."
                />
              }
            />

            <Route
              path="/transfer-courses"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Transfer Courses"
                  description="Approved transfer courses and cohort member transfer-credit information will be organized here."
                />
              }
            />

            <Route
              path="/groups-assigned-by-member"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Groups - Assigned by Member"
                  description="Course group assignments and member participation will be organized here."
                />
              }
            />

            <Route
              path="/beta-nu-fall-icons"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Beta Nu Fall Icons"
                  description="Beta Nu Fall seals, Zoom wallpapers, Word document tips, and related cohort branding resources will be organized here."
                />
              }
            />

            <Route
              path="/shared-files"
              element={
                <CohortSectionPlaceholderPage
                  title="Beta Nu Cohort Shared Files"
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