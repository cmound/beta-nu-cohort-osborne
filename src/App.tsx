import {
  useEffect,
  useRef,
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

type CohortDataSurveyMark =
  | ''
  | 'P'
  | 'C'
  | 'A'
  | 'I'

type CohortDataSurveyState =
  Record<string, CohortDataSurveyMark>

interface CohortDataSurveyTerm {
  readonly id: string
  readonly label: string
  readonly window: string
}

interface CohortDataSurveyDateOption {
  readonly id: string
  readonly termId: string
  readonly cohort: 'Cohort 1' | 'Cohort 2'
  readonly week:
  | 'Week 3'
  | 'Week 4'
  | 'Week 6'
  | 'Week 7'
  readonly dateLabel: string
  readonly holidayNote?: string
}

interface CohortDataSurveyParticipantSeed {
  readonly id: string
  readonly name: string
  readonly marks: readonly CohortDataSurveyMark[]
}

interface CohortDataSurveyPageProps {
  readonly survey: CohortDataSurveyState
  readonly onUpdateSurvey: (
    participantId: string,
    dateId: string,
    mark: CohortDataSurveyMark,
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

interface CohortPurposeResearchRecord {
  readonly id: string
  readonly developmentNote: string
  readonly memberName: string
  readonly purposeStatement: string
  readonly researchQuestion1: string
  readonly researchQuestion2: string
  readonly researchQuestion3: string
  readonly researchQuestion4: string
  readonly researchQuestion5: string
  readonly cmoThoughts: string
  readonly additionalResearchNotes: string
}

type CohortPurposeResearchField = Exclude<
  keyof CohortPurposeResearchRecord,
  'id'
>

type PurposeResearchTextAlign =
  | 'left'
  | 'center'
  | 'right'
  | 'justify'

type PurposeResearchVerticalAlign =
  | 'top'
  | 'center'
  | 'bottom'

type PurposeResearchListStyle =
  | 'none'
  | 'bulleted'
  | 'numbered'

interface PurposeResearchCellFormat {
  readonly fontFamily: string
  readonly fontSize: number
  readonly bold: boolean
  readonly italic: boolean
  readonly underline: boolean
  readonly bordered: boolean
  readonly fillColor: string
  readonly fontColor: string
  readonly textAlign: PurposeResearchTextAlign
  readonly verticalAlign: PurposeResearchVerticalAlign
  readonly indentLevel: number
  readonly listStyle: PurposeResearchListStyle
  readonly wrapText: boolean
}

interface PurposeResearchSelectedCell {
  readonly recordId: string
  readonly field: CohortPurposeResearchField
}

interface PurposeResearchContextMenuState {
  readonly recordId: string | null
  readonly field: CohortPurposeResearchField | null
  readonly x: number
  readonly y: number
}

interface PurposeResearchColumnDefinition {
  readonly field: CohortPurposeResearchField
  readonly label: string
  readonly defaultWidth: number
}

interface CohortPurposeResearchPageProps {
  readonly contacts: readonly CohortContactRecord[]
  readonly records: readonly CohortPurposeResearchRecord[]
  readonly onAddRecord: () => void
  readonly onInsertRecordAfter: (recordId: string) => void
  readonly onDeleteRecord: (recordId: string) => void
  readonly onUpdateRecord: (
    recordId: string,
    field: CohortPurposeResearchField,
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

const purposeResearchColumns:
  readonly PurposeResearchColumnDefinition[] = [
    {
      field: 'developmentNote',
      label: 'Update / Direction',
      defaultWidth: 170,
    },
    {
      field: 'memberName',
      label: 'Name',
      defaultWidth: 190,
    },
    {
      field: 'purposeStatement',
      label: 'Purpose Statement',
      defaultWidth: 390,
    },
    {
      field: 'researchQuestion1',
      label: 'Research Question 1',
      defaultWidth: 310,
    },
    {
      field: 'researchQuestion2',
      label: 'Research Question 2',
      defaultWidth: 310,
    },
    {
      field: 'researchQuestion3',
      label: 'Research Question 3',
      defaultWidth: 310,
    },
    {
      field: 'researchQuestion4',
      label: 'Research Question 4',
      defaultWidth: 310,
    },
    {
      field: 'researchQuestion5',
      label: 'Research Question 5',
      defaultWidth: 310,
    },
    {
      field: 'cmoThoughts',
      label: "Dr. CMO's Thoughts / Feedback",
      defaultWidth: 390,
    },
    {
      field: 'additionalResearchNotes',
      label: 'Additional Research Notes',
      defaultWidth: 360,
    },
  ]

const purposeResearchFontOptions: readonly string[] = [
  'Arial',
  'Calibri',
  'Georgia',
  'Times New Roman',
  'Verdana',
]

const purposeResearchFontSizeOptions:
  readonly number[] = [
    8,
    9,
    10,
    11,
    12,
    14,
    16,
    18,
    20,
  ]

const defaultPurposeResearchCellFormat:
  PurposeResearchCellFormat = {
  fontFamily: 'Arial',
  fontSize: 10,
  bold: false,
  italic: false,
  underline: false,
  bordered: false,
  fillColor: 'transparent',
  fontColor: '#111827',
  textAlign: 'left',
  verticalAlign: 'top',
  indentLevel: 0,
  listStyle: 'none',
  wrapText: true,
}

type PurposeResearchCellFormatState = Partial<
  Record<string, PurposeResearchCellFormat>
>

type PurposeResearchColumnWidthState = Partial<
  Record<CohortPurposeResearchField, number>
>

type PurposeResearchRowHeightState = Partial<
  Record<string, number>
>

const PURPOSE_RESEARCH_RECORDS_STORAGE_KEY =
  'beta-nu-purpose-research-records-v1'

const PURPOSE_RESEARCH_CELL_FORMATS_STORAGE_KEY =
  'beta-nu-purpose-research-cell-formats-v1'

const PURPOSE_RESEARCH_COLUMN_WIDTHS_STORAGE_KEY =
  'beta-nu-purpose-research-column-widths-v1'

const PURPOSE_RESEARCH_ROW_HEIGHTS_STORAGE_KEY =
  'beta-nu-purpose-research-row-heights-v1'

const PURPOSE_RESEARCH_HIDDEN_COLUMNS_STORAGE_KEY =
  'beta-nu-purpose-research-hidden-columns-v1'

function isPurposeResearchStorageRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStoredPurposeResearchField(
  value: string,
): value is CohortPurposeResearchField {
  return purposeResearchColumns.some(
    (column) => column.field === value,
  )
}

function isStoredPurposeResearchRecord(
  value: unknown,
): value is CohortPurposeResearchRecord {
  if (!isPurposeResearchStorageRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.developmentNote === 'string' &&
    typeof value.memberName === 'string' &&
    typeof value.purposeStatement === 'string' &&
    typeof value.researchQuestion1 === 'string' &&
    typeof value.researchQuestion2 === 'string' &&
    typeof value.researchQuestion3 === 'string' &&
    typeof value.researchQuestion4 === 'string' &&
    typeof value.researchQuestion5 === 'string' &&
    typeof value.cmoThoughts === 'string' &&
    typeof value.additionalResearchNotes === 'string'
  )
}

function readStoredPurposeResearchRecords():
  readonly CohortPurposeResearchRecord[] {
  const storedValue = window.localStorage.getItem(
    PURPOSE_RESEARCH_RECORDS_STORAGE_KEY,
  )

  if (storedValue === null) {
    return purposeResearchSeed
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(
        isStoredPurposeResearchRecord,
      )
    ) {
      return purposeResearchSeed
    }

    return parsedValue
  } catch {
    return purposeResearchSeed
  }
}

function isStoredPurposeResearchCellFormat(
  value: unknown,
): value is PurposeResearchCellFormat {
  if (!isPurposeResearchStorageRecord(value)) {
    return false
  }

  return (
    typeof value.fontFamily === 'string' &&
    typeof value.fontSize === 'number' &&
    Number.isFinite(value.fontSize) &&
    typeof value.bold === 'boolean' &&
    typeof value.italic === 'boolean' &&
    typeof value.underline === 'boolean' &&
    typeof value.bordered === 'boolean' &&
    typeof value.fillColor === 'string' &&
    typeof value.fontColor === 'string' &&
    (
      value.textAlign === 'left' ||
      value.textAlign === 'center' ||
      value.textAlign === 'right' ||
      value.textAlign === 'justify'
    ) &&
    (
      value.verticalAlign === 'top' ||
      value.verticalAlign === 'center' ||
      value.verticalAlign === 'bottom'
    ) &&
    typeof value.indentLevel === 'number' &&
    Number.isFinite(value.indentLevel) &&
    (
      value.listStyle === 'none' ||
      value.listStyle === 'bulleted' ||
      value.listStyle === 'numbered'
    ) &&
    typeof value.wrapText === 'boolean'
  )
}

function readStoredPurposeResearchCellFormats():
  PurposeResearchCellFormatState {
  const storedValue = window.localStorage.getItem(
    PURPOSE_RESEARCH_CELL_FORMATS_STORAGE_KEY,
  )

  if (storedValue === null) {
    return {}
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (!isPurposeResearchStorageRecord(parsedValue)) {
      return {}
    }

    const formats: PurposeResearchCellFormatState = {}

    for (
      const [cellKey, formatValue]
      of Object.entries(parsedValue)
    ) {
      if (
        isStoredPurposeResearchCellFormat(
          formatValue,
        )
      ) {
        formats[cellKey] = formatValue
      }
    }

    return formats
  } catch {
    return {}
  }
}

function readStoredPurposeResearchColumnWidths():
  PurposeResearchColumnWidthState {
  const storedValue = window.localStorage.getItem(
    PURPOSE_RESEARCH_COLUMN_WIDTHS_STORAGE_KEY,
  )

  if (storedValue === null) {
    return {}
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (!isPurposeResearchStorageRecord(parsedValue)) {
      return {}
    }

    const widths: PurposeResearchColumnWidthState = {}

    for (const column of purposeResearchColumns) {
      const width = parsedValue[column.field]

      if (
        typeof width === 'number' &&
        Number.isFinite(width) &&
        width >= 80 &&
        width <= 800
      ) {
        widths[column.field] = width
      }
    }

    return widths
  } catch {
    return {}
  }
}

function readStoredPurposeResearchRowHeights():
  PurposeResearchRowHeightState {
  const storedValue = window.localStorage.getItem(
    PURPOSE_RESEARCH_ROW_HEIGHTS_STORAGE_KEY,
  )

  if (storedValue === null) {
    return {}
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (!isPurposeResearchStorageRecord(parsedValue)) {
      return {}
    }

    const heights: PurposeResearchRowHeightState = {}

    for (
      const [recordId, height]
      of Object.entries(parsedValue)
    ) {
      if (
        typeof height === 'number' &&
        Number.isFinite(height) &&
        height >= 42 &&
        height <= 600
      ) {
        heights[recordId] = height
      }
    }

    return heights
  } catch {
    return {}
  }
}

function readStoredPurposeResearchHiddenColumns():
  readonly CohortPurposeResearchField[] {
  const storedValue = window.localStorage.getItem(
    PURPOSE_RESEARCH_HIDDEN_COLUMNS_STORAGE_KEY,
  )

  if (storedValue === null) {
    return []
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    const hiddenColumns:
      CohortPurposeResearchField[] = []

    for (const value of parsedValue) {
      if (
        typeof value === 'string' &&
        isStoredPurposeResearchField(value) &&
        !hiddenColumns.includes(value)
      ) {
        hiddenColumns.push(value)
      }
    }

    return hiddenColumns
  } catch {
    return []
  }
}

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

const dataSurveyTerms:
  readonly CohortDataSurveyTerm[] = [
    {
      id: 'fall-1',
      label: 'Fall 1',
      window: 'Aug 31 - Oct 25',
    },
    {
      id: 'fall-2',
      label: 'Fall 2',
      window: 'Oct 26 - Dec 20',
    },
    {
      id: 'spring-1',
      label: 'Spring 1',
      window: 'Jan 4 - Feb 28',
    },
    {
      id: 'spring-2',
      label: 'Spring 2',
      window: 'March 1 - April 25',
    },
    {
      id: 'summer-1',
      label: 'Summer 1',
      window: 'April 26 - June 20',
    },
    {
      id: 'summer-2',
      label: 'Summer 2',
      window: 'June 21 - Aug 15',
    },
  ]

const dataSurveyDateOptions:
  readonly CohortDataSurveyDateOption[] = [
    {
      id: '09-20',
      termId: 'fall-1',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '9/20',
    },
    {
      id: '09-27',
      termId: 'fall-1',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '9/27',
    },
    {
      id: '10-11',
      termId: 'fall-1',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '10/11',
      holidayNote: '12th Columbus Day',
    },
    {
      id: '10-18',
      termId: 'fall-1',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '10/18',
    },
    {
      id: '11-15',
      termId: 'fall-2',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '11/15',
      holidayNote: '11th Veterans Day',
    },
    {
      id: '11-22',
      termId: 'fall-2',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '11/22',
      holidayNote: '26th Thanksgiving',
    },
    {
      id: '12-06',
      termId: 'fall-2',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '12/6',
    },
    {
      id: '12-13',
      termId: 'fall-2',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '12/13',
    },
    {
      id: '01-24',
      termId: 'spring-1',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '1/24',
      holidayNote: "22nd Lailat al Bara'a",
    },
    {
      id: '01-31',
      termId: 'spring-1',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '1/31',
    },
    {
      id: '02-14',
      termId: 'spring-1',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '2/14',
      holidayNote: "15th Presidents' Day",
    },
    {
      id: '02-21',
      termId: 'spring-1',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '2/21',
    },
    {
      id: '03-21',
      termId: 'spring-2',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '3/21',
    },
    {
      id: '03-28',
      termId: 'spring-2',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '3/28',
      holidayNote:
        '28th Easter & 31st Farm Workers/C. Chavez Day',
    },
    {
      id: '04-11',
      termId: 'spring-2',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '4/11',
    },
    {
      id: '04-18',
      termId: 'spring-2',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '4/18',
    },
    {
      id: '05-16',
      termId: 'summer-1',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '5/28',
      holidayNote: 'Eid-al-Adha',
    },
    {
      id: '05-23',
      termId: 'summer-1',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '5/23',
    },
    {
      id: '06-06',
      termId: 'summer-1',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '6/6',
      holidayNote: '6th Muharram',
    },
    {
      id: '06-13',
      termId: 'summer-1',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '6/13',
    },
    {
      id: '07-11',
      termId: 'summer-2',
      cohort: 'Cohort 1',
      week: 'Week 3',
      dateLabel: '7/11',
    },
    {
      id: '07-18',
      termId: 'summer-2',
      cohort: 'Cohort 1',
      week: 'Week 4',
      dateLabel: '7/18',
    },
    {
      id: '08-01',
      termId: 'summer-2',
      cohort: 'Cohort 2',
      week: 'Week 6',
      dateLabel: '8/1',
    },
    {
      id: '08-08',
      termId: 'summer-2',
      cohort: 'Cohort 2',
      week: 'Week 7',
      dateLabel: '8/8',
    },
  ]

const dataSurveyParticipantSeed:
  readonly CohortDataSurveyParticipantSeed[] = [
    {
      id: 'data-survey-participant-6',
      name: 'Dr. CMO',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'A', 'C', 'A',
        'A', 'A', 'I', 'A',
        'A', 'A', 'A', 'A',
        'I', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-7',
      name: 'Patrick J. Harris',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'C', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-8',
      name: 'Elanis Cruz',
      marks: [
        'A', 'I', 'C', 'A',
        'A', 'C', 'A', 'C',
        'A', 'I', 'C', 'A',
        'A', 'C', 'A', 'A',
        'C', 'A', 'C', 'A',
        'A', 'A', 'A', 'C',
      ],
    },
    {
      id: 'data-survey-participant-9',
      name: 'Sergiy Bryk',
      marks: [
        'A', 'A', 'C', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'C', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', '',
      ],
    },
    {
      id: 'data-survey-participant-10',
      name: 'Jessica Leon',
      marks: [
        'A', 'I', 'A', 'A',
        'A', 'C', 'C', 'A',
        'A', 'A', 'C', 'A',
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
      ],
    },
    {
      id: 'data-survey-participant-11',
      name: 'Reynaldo Dulaney',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-12',
      name: 'Jessica Jackson',
      marks: [
        'A', 'A', 'I', 'A',
        'A', 'I', 'A', 'A',
        'C', 'A', 'I', 'A',
        'A', '', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-13',
      name: 'Celia Cipres',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'C', 'I', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-14',
      name: 'Chris Mound',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-15',
      name: 'Monica Romero',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'A', 'C', 'C',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-16',
      name: 'Asa Jones-McGhee',
      marks: [
        'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C',
      ],
    },
    {
      id: 'data-survey-participant-17',
      name: 'Tracy Rico',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-18',
      name: 'Victoria Vildosola',
      marks: [
        'A', 'A', 'A', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'A', 'A',
        'A', 'C', 'A', 'A',
        'A', 'C', 'A', 'A',
        'A', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-19',
      name: 'Bashiyra Windley',
      marks: [
        'A', 'P', '', 'C',
        'P', 'A', 'A', 'A',
        'A', 'A', 'C', 'P',
        'A', 'C', 'A', 'C',
        'A', 'A', 'A', 'A',
        'P', 'A', 'A', 'A',
      ],
    },
    {
      id: 'data-survey-participant-20',
      name: 'Trevor Desouza',
      marks: [
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
      ],
    },
  ]

const dataSurveyParticipantDisplayOrder:
  readonly string[] = [
    'data-survey-participant-6',
    'data-survey-participant-16',
    'data-survey-participant-19',
    'data-survey-participant-13',
    'data-survey-participant-14',
    'data-survey-participant-8',
    'data-survey-participant-12',
    'data-survey-participant-10',
    'data-survey-participant-15',
    'data-survey-participant-11',
    'data-survey-participant-9',
    'data-survey-participant-17',
    'data-survey-participant-20',
    'data-survey-participant-18',
  ]

const DATA_SURVEY_STORAGE_KEY =
  'beta-nu-data-survey-v1'

const dataSurveyHolidayGeneralNote = {
  primary:
    "* Note: If somebody has disclosed devote religious following to me, I have attmepted to identify those holy holidays, along with the federal and state holidays, near proposed dates.",
  emphasis:
    "If I missed your holy holidays, my apologies, please feel free to add them to help educate us. :)",
} as const

function getCohortDataSurveyKey(
  participantId: string,
  dateId: string,
): string {
  return `${participantId}::${dateId}`
}

function createCohortDataSurveySeed():
  CohortDataSurveyState {
  const survey: CohortDataSurveyState = {}

  for (const participant of dataSurveyParticipantSeed) {
    dataSurveyDateOptions.forEach(
      (dateOption, dateIndex) => {
        survey[
          getCohortDataSurveyKey(
            participant.id,
            dateOption.id,
          )
        ] = participant.marks[dateIndex] ?? ''
      },
    )
  }

  return survey
}

const cohortDataSurveySeed =
  createCohortDataSurveySeed()

function isCohortDataSurveyMark(
  value: unknown,
): value is CohortDataSurveyMark {
  return (
    value === '' ||
    value === 'P' ||
    value === 'C' ||
    value === 'A' ||
    value === 'I'
  )
}

function normalizeCohortDataSurveyMark(
  value: string,
): CohortDataSurveyMark {
  const normalizedValue =
    value.trim().toUpperCase()

  if (
    normalizedValue === 'P' ||
    normalizedValue === 'C' ||
    normalizedValue === 'A' ||
    normalizedValue === 'I'
  ) {
    return normalizedValue
  }

  return ''
}

function readStoredCohortDataSurvey():
  CohortDataSurveyState {
  const storedValue = window.localStorage.getItem(
    DATA_SURVEY_STORAGE_KEY,
  )

  if (storedValue === null) {
    return cohortDataSurveySeed
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (
      typeof parsedValue !== 'object' ||
      parsedValue === null
    ) {
      return cohortDataSurveySeed
    }

    const storedSurvey: CohortDataSurveyState = {
      ...cohortDataSurveySeed,
    }

    for (
      const [surveyKey, surveyValue]
      of Object.entries(parsedValue)
    ) {
      if (isCohortDataSurveyMark(surveyValue)) {
        storedSurvey[surveyKey] = surveyValue
      }
    }

    return storedSurvey
  } catch {
    return cohortDataSurveySeed
  }
}

interface CohortBookRecord {
  readonly id: string
  readonly course: string
  readonly school: string
  readonly courseTitle: string
  readonly studentNotes: string
  readonly isbn: string
  readonly author: string
  readonly productTitle: string
  readonly edition: string
  readonly publisher: string
  readonly year: string
}

type CohortBookField = Exclude<
  keyof CohortBookRecord,
  'id'
>

const COHORT_BOOK_LIST_STORAGE_KEY =
  'beta-nu-book-list-v1'

const cohortBookListSeedSource = `EDDP-700	SOE	Transformational Leadership	N/A	9781422117347	McKee	Becoming a Resonant Leader	NA	Harvard Business Review Press	2008
EDDP-700	SOE	Transformational Leadership	N/A	9780470648087	Anderson	Beyond Change Management: How To Achieve Breakthrough Results Through Conscious Change Leadership	2nd	Pfeiffer - Wiley	2010
EDDP-700	SOE	Transformational Leadership	N/A	9780974320625	Bradberry	Emotional Intelligence 2.0	NA	Talent Smart	2009
EDDP-700	SOE	Transformational Leadership	N/A	9781523002023	Brown	How to Be an Inclusive Leader: Your Role in Creating Cultures of Belonging Where Everyone Can Thrive	2nd	Berrett-Koehler Publishers	2022
EDDP-700	SOE	Transformational Leadership	N/A	9780470648063	Anderson	The Change Leader's Roadmap: How to Navigate Your Organization's Transformation	2nd	Pfeiffer - Wiley	2010
EDDP-706	SOE	Team and Group Dynamics	N/A	9780358533382	Burkus	Leading From Anywhere	1st	Mariner Books	2021
EDDP-706	SOE	Team and Group Dynamics	N/A	9780470648063	Anderson	The Change Leader's Roadmap: How to Navigate Your Organization's Transformation	2nd	Pfeiffer - Wiley	2010
EDDP-706	SOE	Team and Group Dynamics	N/A	9780470893869	Lencioni	The Five Dysfunctions of a Team: A Leadership Fable	1st	Wiley	2010
EDDP-706	SOE	Team and Group Dynamics	N/A	9781475863192	Harvey	The Practical Decision Maker: A Handbook for Decision Making and Problem Solving	2nd	Rowman & Littlefield	2023
EDDP-706	SOE	Team and Group Dynamics	N/A	9781119064398	Schwarz	The Skilled Facilitator: A Comprehensive Resource for Consultants, Facilitators, Coaches, and Trainers	3rd	Jossey-Bass	2017
EDDP-707	SOE	Org Theory and Development	N/A	9781401967604	Crowley	Lead From The Heart: Transformational Leadership For The 21st Century	2nd	Hay House, Inc.	2022
EDDP-707	SOE	Org Theory and Development	N/A	9781475857917	Bartels & Jackson	Meaning-Centered Leadership: Skills and Strategies for Increased Employee Well-Being and Organizational Success	1st	Rowman & Littlefield	2021
EDDP-707	SOE	Org Theory and Development	N/A	9780470648063	Anderson	The Change Leader's Roadmap: How to Navigate Your Organization's Transformation	2nd	Pfeiffer - Wiley	2010
EDDP-707	SOE	Org Theory and Development	N/A	9780988953802	Hammond	The Thin Book of Appreciative Inquiry	3rd	Thin Book Publishing	2013
EDDP-708	SOE	Strategic Thinking	N/A	9780470648087	Anderson	Beyond Change Management: How to Achieve Breakthrough Results Through Conscious Change Leadership	2nd	Pfeiffer - Wiley	2010
EDDP-708	SOE	Strategic Thinking	N/A	9781633696938	HBR	HBR Guide to Thinking Strategically	1st	Harvard Business Review Press	2019
EDDP-708	SOE	Strategic Thinking	N/A	9780385516808	Senge	Presence: An Exploration of Profound Change in People, Organizations, and Society	1st	Crown Business	2004
EDDP-708	SOE	Strategic Thinking	N/A	9780787908256	Howe	The Board Member's Guide to Strategic Planning: A Practical Approach to Strengthening Nonprofit Organizations	1st	Jossey-Bass	1997
EDDP-709	SOE	Assess, Eval, Accountability	N/A	9780470873540	Boulmetis & Dutwin	The ABCs of Evaluation: Timeless Techniques for Program and Project Managers	3rd	Jossey-Bass	2011
EDDP-740	SOE	Writing for Research and Publication I	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDDP-740	SOE	Writing for Research and Publication I	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDDP-741	SOE	Writing for Research and Publication II	N/A	9781936523399	Pan	Preparing Literature Reviews: Qualitative and Quantitative Approaches	5th	Routledge	2017
EDDP-741	SOE	Writing for Research and Publication II	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDDP-741	SOE	Writing for Research and Publication II	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDDP-742	SOE	Quantitative Research Methods	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDDP-742	SOE	Quantitative Research Methods	N/A	9781544381855	Salkind	Statistics for People Who (Think They) Hate Statistics	7th	Sage Publications	2020
EDDP-742	SOE	Quantitative Research Methods	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2017
EDDP-743	SOE	Qualitative Research Methods	N/A	9781544333809	Ravitch & Carl	Qualitative Research: Bridging the Conceptual, Theoretical, and Methodological	2nd	Sage Publications	2021
EDDP-743	SOE	Qualitative Research Methods	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDDP-781	SOE	Developing the Dissertation, Chapter I	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDDP-781	SOE	Developing the Dissertation, Chapter I	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDDP-781	SOE	Developing the Dissertation, Chapter I	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2017
EDDP-799	SOE	Dissertation Extension	N/A	NT	NT	No Text Required	NT	No Text Required	NT
EDOL-705	SOE	Org Com & Conflict Mgmt	N/A	9781473674981	Kimsey-House et al	Co-Active Coaching: The Proven Framework for Transformative Conversations at Work and in Life	4th	Nicholas Brealey Publishing	2018
EDOL-705	SOE	Org Com & Conflict Mgmt	N/A	9781260474183	Patterson	Crucial Conversations: Tools for Talking When Stakes are High	3rd	McGraw Hill	2022
EDOL-705	SOE	Org Com & Conflict Mgmt	N/A	9780470548677	Denning	The Leaders Guide to Storytelling: Mastering the Art and Discipline of the Business Narrative	2nd	Jossey-Bass	2011
EDOL-707	SOE	Org Theory and Development	N/A	9781401967604	Crowley	Lead From The Heart: Transformational Leadership For The 21st Century	2nd	Hay House, Inc.	2022
EDOL-707	SOE	Org Theory and Development	N/A	9781475857917	Bartels & Jackson	Meaning-Centered Leadership: Skills and Strategies for Increased Employee Well-Being and Organizational Success	1st	Rowman & Littlefield	2021
EDOL-707	SOE	Org Theory and Development	N/A	9780470648063	Anderson	The Change Leader's Roadmap: How to Navigate Your Organization's Transformation	2nd	Pfeiffer - Wiley	2010
EDOL-707	SOE	Org Theory and Development	N/A	9780988953802	Hammond	The Thin Book of Appreciative Inquiry	3rd	Thin Book Publishing	2013
EDOL-708	SOE	Strategic Thinking	N/A	9780470648087	Anderson	Beyond Change Management: How to Achieve Breakthrough Results Through Conscious Change Leadership	2nd	Pfeiffer - Wiley	2010
EDOL-708	SOE	Strategic Thinking	N/A	9781633696938	HBR	HBR Guide to Thinking Strategically	1st	Harvard Business Review Press	2019
EDOL-708	SOE	Strategic Thinking	N/A	9780385516808	Senge	Presence: An Exploration of Profound Change in People, Organizations, and Society	1st	Crown Business	2004
EDOL-709	SOE	Assess, Eval, Accountability	N/A	9780470873540	Boulmetis & Dutwin	The ABCs of Evaluation: Timeless Techniques for Program and Project Managers	3rd	Jossey-Bass	2011
EDOL-720	SOE	Creativity Innov & Sust Chnge	N/A	9781118002902	Owens	Creative People Must Be Stopped: 6 Ways We Kill Innovation (Without Even Trying)	1st	Jossey-Bass	2011
EDOL-720	SOE	Creativity Innov & Sust Chnge	N/A	9780761169253	Kleon	Steal Like an Artist: 10 Things Nobody Told You About Being Creative	1st	Workman Publishing Company	2012
EDOL-721	SOE	Ethics & Polt of Decn Making	N/A	9781422121061	Howard	Ethics for the Real World: Creating a Personal Code to Guide Decisions in Work and Life	1st	Harvard Business Review Press	2008
EDOL-721	SOE	Ethics & Polt of Decn Making	N/A	9780313379765	Fairholm	Organizational Power Politics: Tactics in Organizational Leadership	2nd	ABC-CLIO	2009
EDOL-721	SOE	Ethics & Polt of Decn Making	N/A	9781475828597	White	The Politically Intelligent Leader: Dealing with the Dilemmas of a High-Stakes Educational Environment	2nd	Rowman & Littlefield	2016
EDOL-721	SOE	Ethics & Polt of Decn Making	N/A	9781475863185	Harvey	The Practical Decision Maker: A Handbook for Decision Making and Problem Solving	2nd	Rowman & Littlefield	2022
EDOL-721	SOE	Ethics & Polt of Decn Making	Choose One of the Following:	9781119886112	George	True North, Emerging Leader Edition: Leading Authentically in Today's Workplace	3rd	Wiley	2022
EDOL-721	SOE	Ethics & Polt of Decn Making	Choose One of the Following:	9780071808866	Patterson	Influencer: The Power to Change Anything	2nd	McGraw Hill	2014
EDOL-721	SOE	Ethics & Polt of Decn Making	Choose One of the Following:	9781578514373	Linsky	Leadership on the Line: Staying Alive through the Dangers of Leading	1st	Harvard Business Review Press	2002
EDOL-722	SOE	Div & Intrcltrl Asp of Lead	N/A	9781606491515	Moua	Culturally Intelligent Leadership: Essential Concepts to Leading and Managing Intercultural Interactions	NA	Business Expert Press	2010
EDOL-722	SOE	Div & Intrcltrl Asp of Lead	N/A	9781119799542	Thompson	Diversity and Inclusion Matters: Tactics and Tools to Inspire Equity and Game-Changing Performance	1st	Wiley	2022
EDOL-722	SOE	Div & Intrcltrl Asp of Lead	N/A	9780525509288	Kendi	How to Be an Antiracist	1st	One World	2019
EDOL-723	SOE	Innovation in Resource Mgmt	N/A	9781578861415	Harvey	Building Teams, Building People: Expanding the Fifth Resource	2nd	Rowman & Littlefield	2004
EDOL-723	SOE	Innovation in Resource Mgmt	N/A	9780060851132	Drucker	Innovation and Entrepreneurship	NA	HarperCollins Publishers	2006
EDOL-723	SOE	Innovation in Resource Mgmt	N/A	9780316017930	Gladwell	Outliers: The Story of Success	NA	Little, Brown and Company	2008
EDOL-724	SOE	The Leader as Change Agent	N/A	9780787982966	Kouzes	A Leader's Legacy	NA	Jossey-Bass	2006
EDOL-750	SOE	Writing Res & Publication I	Software Download	n/a	Clarivate	EndNote 20	NA	Clarivate	2021
EDOL-750	SOE	Writing Res & Publication I	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDOL-750	SOE	Writing Res & Publication I	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDOL-751	SOE	Writing Res & Publication II	Software Download	n/a	Clarivate	EndNote 20	NA	Clarivate	2021
EDOL-751	SOE	Writing Res & Publication II	N/A	9781936523399	Pan	Preparing Literature Reviews: Qualitative and Quantitative Approaches	5th	Routledge	2017
EDOL-751	SOE	Writing Res & Publication II	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDOL-751	SOE	Writing Res & Publication II	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDOL-752	SOE	Quant Research Methods I	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2014
EDOL-752	SOE	Quant Research Methods I	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2018
EDOL-753	SOE	Quant Research Methods II	Software Download	77425995	Orris	MegaStat for Microsoft Excel (digital download): https://highered.mheducation.com/sites/0077425995/information_center_view0/index.html	NA	McGraw Hill	2021
EDOL-753	SOE	Quant Research Methods II	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDOL-753	SOE	Quant Research Methods II	N/A	9781544381855	Salkind	Statistics for People Who (Think They) Hate Statistics	7th	Sage Publications	2020
EDOL-753	SOE	Quant Research Methods II	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2017
EDOL-754	SOE	Qual Research Methods I	N/A	9781412972123	Patton	Qualitative Research and Evaluation Methods	4th	Sage Publications	2014
EDOL-755	SOE	Qual Research Methods II	N/A	9781412972123	Patton	Qualitative Research and Evaluation Methods	4th	Sage Publications	2014
EDOL-780	SOE	Transf Change Field Exp	N/A	9780470648087	Anderson	Beyond Change Management: How To Achieve Breakthrough Results Through Conscious Change Leadership	2nd	Pfeiffer - Wiley	2010
EDOL-780	SOE	Transf Change Field Exp	N/A	9780470648063	Anderson	The Change Leader's Roadmap: How to Navigate Your Organization's Transformation	2nd	Pfeiffer - Wiley	2010
EDOL-790	SOE	Dev Dissertation Prospectus	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDOL-790	SOE	Dev Dissertation Prospectus	N/A	9780137152391	McMillan	Research In Education: Evidence-Based Inquiry	7th	Pearson	2009
EDOL-790	SOE	Dev Dissertation Prospectus	N/A	9781544381855	Salkind	Statistics for People Who (Think They) Hate Statistics	7th	Sage Publications	2019
EDOL-790	SOE	Dev Dissertation Prospectus	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDOL-790	SOE	Dev Dissertation Prospectus	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2018
EDOL-791	SOE	Dissertation I	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDOL-791	SOE	Dissertation I	N/A	9781412972123	Patton	Qualitative Research & Evaluation Methods	4th	Sage Publications	2014
EDOL-791	SOE	Dissertation I	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDOL-791	SOE	Dissertation I	N/A	9780335249497	Pallant	SPSS Survival Manual: A Step by Step Guide to Data Analysis Using IBM SPSS	7th	Open University Press	2020
EDOL-791	SOE	Dissertation I	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDOL-791	SOE	Dissertation I	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2018
EDOL-792	SOE	Dissertation II	N/A	9781433832178	American Psychological Association	Publication Manual of the American Psychological Association	7th	American Psychological Association	2020
EDOL-792	SOE	Dissertation II	N/A	9781412972123	Patton	Qualitative Research & Evaluation Methods	4th	Sage Publications	2014
EDOL-792	SOE	Dissertation II	N/A	9780137152391	McMillan	Research In Education: Evidence-based Inquiry	7th	Pearson	2009
EDOL-792	SOE	Dissertation II	N/A	9780335249497	Pallant	SPSS Survival Manual: A Step by Step Guide to Data Analysis Using IBM SPSS	7th	Open University Press	2020
EDOL-792	SOE	Dissertation II	N/A	9781071891308	Hyatt & Roberts	The Dissertation Journey: A Practical and Comprehensive Guide to Planning, Writing, and Defending Your Dissertation	4th	Corwin Press	2024
EDOL-792	SOE	Dissertation II	N/A	9780415790529	Patten	Understanding Research Methods: An Overview of Essentials	10th	Routledge	2018
EDOL-799	SOE	Dissertation Ext	N/A	NT	NT	No Text Required	NT	No Text Required	NT`

function createCohortBookListSeed():
  readonly CohortBookRecord[] {
  return cohortBookListSeedSource
    .trim()
    .split('\n')
    .map((line, index) => {
      const [
        course = '',
        school = '',
        courseTitle = '',
        studentNotes = '',
        isbn = '',
        author = '',
        productTitle = '',
        edition = '',
        publisher = '',
        year = '',
      ] = line.split('\t')

      return {
        id: `master-book-${String(index + 1).padStart(3, '0')}`,
        course,
        school,
        courseTitle,
        studentNotes,
        isbn,
        author,
        productTitle,
        edition,
        publisher,
        year,
      }
    })
}

const cohortBookListSeed =
  createCohortBookListSeed()

function isStoredCohortBookRecord(
  value: unknown,
): value is CohortBookRecord {
  if (
    typeof value !== 'object' ||
    value === null
  ) {
    return false
  }

  const record = value as Record<string, unknown>

  return (
    typeof record.id === 'string' &&
    typeof record.course === 'string' &&
    typeof record.school === 'string' &&
    typeof record.courseTitle === 'string' &&
    typeof record.studentNotes === 'string' &&
    typeof record.isbn === 'string' &&
    typeof record.author === 'string' &&
    typeof record.productTitle === 'string' &&
    typeof record.edition === 'string' &&
    typeof record.publisher === 'string' &&
    typeof record.year === 'string'
  )
}

function readStoredCohortBookList():
  readonly CohortBookRecord[] {
  const storedValue = window.localStorage.getItem(
    COHORT_BOOK_LIST_STORAGE_KEY,
  )

  if (storedValue === null) {
    return cohortBookListSeed
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue)

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isStoredCohortBookRecord)
    ) {
      return cohortBookListSeed
    }

    return parsedValue
  } catch {
    return cohortBookListSeed
  }
}

const purposeResearchSeed: readonly CohortPurposeResearchRecord[] = [
  {
    id: 'purpose-research-source-row-3',
    developmentNote: ``,
    memberName: `Asa Jones-McGhee`,
    purposeStatement: `The purpose of this research aims at explore the perceptions of families who have gone through the child removal process using the foster care system.and how they perceive and explain it to be a legal kidnapping. This study is aimed at investigating the general impacts of child removal associated with foster care on the trauma at a community level, especially how such experiences influence intergenerational trust in governmental agencies.`,
    researchQuestion1: `What is the experience of families that have undergone foster care-related child removal, and what makes their description show such acts as legal kidnapping?`,
    researchQuestion2: `What connects foster care-associated child removal to the emergence of trauma in communities, and how is the resultant trauma mediated to affect intergenerational trust in governmental agencies?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `The population you explain has some barriers that should be considered.  1)  Because these are protected classes, the IRB process is much harder. 2)  Will the folks who had their kids taken away want to particpiate?  In addition, your current purpose and RQ has some bias when you speak about "legal kidnapping"  What's clear to me is you want to study something related to the foster care system.  I recommend you start by scanning dissertations tied to the foster care system to see if anything catches your eye.  Keep scanning until you find 2-3 dissertations that really excite you. Then we can connect again to develop next steps. Chapter 5 of a dissertation outlines recommendations for future research. This might help you.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-4',
    developmentNote: `Final - exploring the perceptions of former foster youth between ages of 18-25 to explore their perceptions on how microsystem disruption impacted their mental heatlh.... Chair = Dr. Dennell Smith`,
    memberName: `Asa Jones-McGhee`,
    purposeStatement: `Title: Beyond Aging Out and Left to Navigate Alone: Former Foster Youth’s Lived Experiences of Mental Health and Support During the Transition to Adulthood                                                                                                        The purpose of this phenomenological study is to explore how former foster youth between the ages of 18 and 25 describe the impact that microsystems disruptions from Bronfenbrenner’s Ecological Systems model had on their mental health outcomes during their transitions to adulthood.`,
    researchQuestion1: `1. How do former foster youth between the ages of 18–25 describe the impact that microsystems disruptions to their families had on their mental health outcomes during their transitions to adulthood.`,
    researchQuestion2: `How do former foster youth between the ages of 18–25 describe the impact that microsystems disruptions to their schools had on their mental health outcomes during their transitions to adulthood.`,
    researchQuestion3: `How do former foster youth between the ages of 18–25 describe the impact that microsystems disruptions to their peer groups had on their mental health outcomes during their transitions to adulthood.`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Title: Beyond Aging Out and Left to Navigate Alone: Former Foster Youth’s Lived Experiences of Mental Health and Support During the Transition to Adulthood`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-5',
    developmentNote: `Updates for 10.11`,
    memberName: `Asa Jones-McGhee`,
    purposeStatement: ``,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Drop legal kidnapping.  Question you want to answer?  Different dynamics. Bias - AA families lose children and social workers act inapprorpiately.  Wealthy families can keep children.  Disparities between rich and poor. Or AA vs. Non-AA. Impact on child.  Mental Health part. Wants to explore the perceptions of kids removed from biological parents to determine the impact on their mental health.  Case study.  Seek a model.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-6',
    developmentNote: `2.24 narrowed chair list and purpose and RQs.`,
    memberName: `Victoria Vildosola`,
    purposeStatement: ``,
    researchQuestion1: `How do grit and access to mentorship programs influence women’s ability to break through the glass ceiling in retail leadership?`,
    researchQuestion2: `To what extent do mentorship opportunities enhance women’s perceptions of self-efficacy and career progression in retail leadership roles?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `This is a good start.  Grit is a good conceptual model and makes it easy to structure a study. When you start to layer in mentorship, it gets a little fuzzy. DId you find a study you are immulating?  In your mind, are you colelcting qual or quant data?  Are you wanting to explore formal mentorship programs or infromal mentorship?  What level of retail leadership are you thinking about? My instinct is to focus on grit and ditch mentorship (or visa versa). Unless you want to explore the relationship between formal mentorship (or informal) and grit scores?  This may already exist.  I think the key is connecting the two. Measure Grit, interview those with high and low scores to dig futher into mentorship experiences?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-7',
    developmentNote: `Updates for 11.10
interest, practice, purpose, and hope`,
    memberName: `Victoria Vildosola`,
    purposeStatement: `The purpose of this mixed-methods study is to examine the grit levels of women in store director roles in the grocery indsutry in the Inland Empire and to describe how women in leadership positions in the grocery industry in the Inland Empire describe the role of grit in their career advancement.`,
    researchQuestion1: `Quantitive- 1. What are the grit levels of women in leadership positions in the grocery industry in the Inland Empire?  NOTE:  Survey`,
    researchQuestion2: `Qualitative- 2. How do women in leadership positions in the grocery indsutry in the Inland Empire describe the role of grit in their career advancement?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-8',
    developmentNote: `updated 5-28 Chair- Dr. Stepahine Herrera`,
    memberName: `Victoria Vildosola`,
    purposeStatement: `The purpose of this phenomological study is to explore how female store directors in the retail industry, in the Inland Empire describe their lived experiences of grit in their career advancement through the lens of Duckworth's Theory of Grit.`,
    researchQuestion1: `1. How do female store directors in the retail industry in the Inland Empire describe the role of interest in their career advancement?`,
    researchQuestion2: `2.  . How do female store directors in the retail industry in the Inland Empire describe the role of practice in their career advancement?`,
    researchQuestion3: `How do female store directors in the retail industry in the Inland Empire describe the role of purpose in their career advancement?`,
    researchQuestion4: `4. How do female store directors in the retail industry in the Inland Empire describe the role of hope in their career advancement?`,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-9',
    developmentNote: `Thematic - Final Decision. Dr. Peterson is lead on thematic. Chair George Sziraki`,
    memberName: `Bashiyra Windley`,
    purposeStatement: `The purpose of this exploratory phenomenological study was to explore and describe the strategies exemplary middle managers in corporate financial services organizations use to motivate employees in hybrid work environments through the motivational elements of autonomy, mastery, and purpose identified by Daniel H. Pink (2009). A further purpose was to identify which strategies these exemplary leaders perceived as having the greatest impact on employee motivation.`,
    researchQuestion1: `What strategies do exemplary middle managers in corporate financial services organizations use
to motivate employees in hybrid work environments based on Daniel H. Pink's (2009) essential
elements: autonomy, mastery, and purpose.`,
    researchQuestion2: `How do exemplary middle managers in corporate financial services organizations use autonomy to motivate employees in hybrid work environments?`,
    researchQuestion3: `How do exemplary middle managers in corporate financial services organizations use
mastery to motivate employees in hybrid work environments?`,
    researchQuestion4: `How do exemplary middle managers in corporate financial services organizations use
purpose to motivate employees in hybrid work environments?`,
    researchQuestion5: ``,
    cmoThoughts: `What strategies do exemplary middle managers in corporate financial services organizations perceive as being the most impactful in motivating people within a hybrid
environment?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-10',
    developmentNote: `Updates for 10.11`,
    memberName: `Bashiyra Windley`,
    purposeStatement: `strategies exemplary middle managers in corporate financial services organizations use to`,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-11',
    developmentNote: `Patrick J. Harris Note: I am prepred to do whatever work I need to do for my IRB. This is a study will be and must be meaning for me as I will be deeply connected to the study. I am prepared to jump through what hoops I need to as needed.`,
    memberName: `Patrick J. Harris`,
    purposeStatement: `motivate employees in hybrid work environments through the motivational elements of`,
    researchQuestion1: `Qualitative Research Questions
● What social, educational, and environmental factors contribute to the confidence levels of
student musicians from low-SES schools?
● How do access to resources, quality of instruction, and peer interactions shape their
musical achievement in competitive and collaborative environments?`,
    researchQuestion2: `Quantitative Research Questions
● To what extent do levels of self-efficacy and performance anxiety differ between student
musicians from low-SES and affluent schools?
● How strongly are access to resources and teacher support statistically correlated with
reported confidence and achievement outcomes among student musicians?`,
    researchQuestion3: `Mixed-Methods Integration Question
● How do the qualitative perceptions of student musicians from low-SES schools explain or
expand upon the quantitative patterns of confidence, self-efficacy, and achievement
observed in competitive and collaborative contexts?`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Patrick, There is a lot in here, whcih makes for a complicated and long dissertation. That's ok, if that's what you want. Just know it results in extra work. I was tracking you until I got to the quant part and you indicate you want to compare low-ses and affluent schools.  Your purpose statement does not indicate you are comparing two different groups. The correlation piece is interesting. It will require you to quantify the factors you want to correlate. Keep in mind, in a correlation study, you have to have variables that are bi-directional (go up and down).  This is a solid start, you may want to start researching instruments to measure self-confidence, self-efficacy and achievement.  I see you crossed it all out.  This is ok but I do think there is enough in here to scope a study that is meaningful and achievable. Maybe a 1:1 chat with myself or your instructor?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-12',
    developmentNote: `UPDATED Patrick J. Harris Note: I am prepred to do whatever work I need to do for my IRB. This is a study will be and must be meaning for me as I will be deeply connected to the study. I am prepared to jump through what hoops I need to as needed.`,
    memberName: `Patrick J. Harris`,
    purposeStatement: `autonomy, mastery, and purpose identified by Daniel H. Pink (2009). A further purpose was to`,
    researchQuestion1: `How do student musicians in a low-SES high school marching band perceive the social, educational, and environmental conditions that influence their confidence?`,
    researchQuestion2: `How do students describe the ways that access to resources, quality of instruction, and peer interactions shape their musical achievement within the marching band?`,
    researchQuestion3: `How do student performers narrate their sense of identity and belonging when engaging in competitive and collaborative marching band contexts alongside peers from more affluent schools?`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Deconstructing this. Qual study.  Delimitations = HS students from low SES schools, who participate in the Marching Band.  You want to examine student perceptions about how their marching band experience influenced, if at all, their confidence, achievmeent (what type), and sense of belonging?  Questions:  you note both compeottive and collaborative performance.  Does this mean students will have participated in both? If not, do you plan to compare them?  If not, this seems like a distraction in the purpose statement. This prior to here gets me to the items in red.   From this, here is what I would recommend as a purpose statement, assuming you don't plan to use both competitive and collaborative performance as a delimitation.  The purpose of this qualitative, narrative study is to explore the perceptions of high school marching band students enrolled at low socioeconomic status (SES) schools to determine how their marching band experience influenced, if at all, their confidence, academic achievement and sense of belonging.    When I get to this purple section, you start to introduce new variables, such as social, education and environmetnal conditions, plus musical identities, sense of self, peer involvement. This muddies the water, in my opinion.  You can certainly explore social, educational and environmental conditions but you would have to define these, typically from the literature.  If you decide this is really your interest and you have something you are working with, I recommend you send me that instrument or conceptual framework. In the first RQ, you root into the social, educational and environmental and then root into confidence. This is not aligned with the purpose.e  Prior comment in purple applies here too.  Then in RQ 2, you introduce more variables, such as access to resources, quality of instruction, and peer interactions.  Green somewhat aligns with the first part of the purpose, but you now introduce identity, and switch to affluent schools.  We can explore any variables you want. Easiest way to shape this is to see if there is some framework that shows how music education shares certain factors in a student (or any cocurricular activities), then we can use the same variables.  Let's chat. Feels like you are moving in the right direction. Next steps are to narrow on variables and get to crisp alignment.  Also, there is some bias iny our work here. Be mindful. It's common, but we try to make you mindful.  You assume that marching band participation influences confidence, achievement, sense of belonging.... Don't be discouraged by this feebdack, this is a normal part of the process and important and the good news is you have a viable concept to build off of.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-13',
    developmentNote: `10.11 Update`,
    memberName: `Patrick J. Harris`,
    purposeStatement: `identify which strategies these exemplary leaders perceived as having the greatest impact on`,
    researchQuestion1: `How do high school band students from a low-SES school perceive their confidence as developed through participation in their band experience?`,
    researchQuestion2: `How do students perceive their motivation in relation to their band experiences in concert and marching ensembles?`,
    researchQuestion3: `How do students perceive their sense of belonging and connection within their band community and in broader performance settings, such as competitions or collaborative events?`,
    researchQuestion4: `Achievable Study
Clear delimitations: One low-SES high school, band students (marching + concert).
Balanced lens: Educational (motivation/achievement) and psychological (confidence/belonging).
Student-centered: Grounded in lived experiences, not assumed effects.
Manageable scope: Narrative interviews, focus groups, or reflections can provide rich data in 1–2 years.`,
    researchQuestion5: ``,
    cmoThoughts: `Purpose:  Seems like progress, well done. Do you want to explore confidence, sense of achievement and belonging through particiaption in ensemble or how these three items are shaped by their ensemble experience?  The part I changed to red starts to create mis-alignment.  The two theories will be your foundational theories. Some purpose statements may weave them in, but not as an after thought. Where the misalignment really starts to me, is when you speak to motivation, competence and connection.  And when you shift from Ensemble to Marching band (and I realize they are connected).  I encourage you to use the frist sentence in your purpose and   build it out.  Then get rid of the rest.  You are so close, I encourage you to narrow down a bit and ensure it has strong alignment. From there, I think your purpose and RQs will be tight. Normally I would edit these for you, but we first need to understand if you are seeking to examine how particpation in ensamble shapes confidence, sense of achievement, and belonging.    I also wonder if you should do a mixed-methods, only because there are instruments for some of these.... Look at my example below. Notice how tight it is in alignment.`,
    additionalResearchNotes: `Expectancy Value = is about motivation.  Self-Determination is also about motivation....`,
  },
  {
    id: 'purpose-research-source-row-14',
    developmentNote: ``,
    memberName: `Patrick J. Harris`,
    purposeStatement: `employee motivation.`,
    researchQuestion1: `How do high school students from a low-SES schools pereceive their participation in band influences their confidence,`,
    researchQuestion2: `How do high school students from a low-SES schools pereceive their participation in band influences their motivation.`,
    researchQuestion3: `How do high school students from a low-SES schools pereceive their participation in band influences their sense of belonging.`,
    researchQuestion4: `Methodology - Qual Study - Interviews    phenomenological research`,
    researchQuestion5: ``,
    cmoThoughts: `Population:  High School students who participate in band.   Target - High School Juniors and Seniors who participate in band in Riverside and San Bernardino County Population and Sample 15-20 High School Junior or Seniors who particpate in ban in Riverside and San Bernardino counties.   
Clear delimitations: One low-SES high school, high band students , junior and seniors, and Riverside or San Bernardino counties.
Balanced lens: Educational (motivation/achievement) and psychological (confidence/belonging).
Student-centered: Grounded in lived experiences, not assumed effects.
Manageable scope: Narrative interviews, focus groups, or reflections can provide rich data in 1–2 years.`,
    additionalResearchNotes: `This study is to draw upon Expectancy-Value Theory and Self-Determination Theory, this study seeks to understand how students construct meaning around motivation, competence, and connection within both concert and marching band settings. The plan is to center student narratives, the research aims to illuminate how educational and psychological factors intersect to shape their musical growth, identity, and sense of belonging.  Next Step:  Look for a dissertation from UMass on Confidence and look at the chapter II to identify key authors.  Look for disssertation from UMass on Motivation and look at the chapter II to identify key authors.  Look for a dissertation from UMass on Sensse of Belonging.  Look for a Umass dissertation on cocurricular involvement or music education and how it influences the social pieces of a student's development....`,
  },
  {
    id: 'purpose-research-source-row-15',
    developmentNote: `Final - Dr. Guzman as chair`,
    memberName: `Patrick J. Harris`,
    purposeStatement: `Working Title: Unveiling Black Musical Excellence: Narrative Inquiry into Identity, Confidence, and Belonging Among Black High School Band Directors within Their State Music Education Associations. The purpose of this qualitative narrative study is to explore how Black high school band directors working in low socioeconomic status (SES) school describe and interpret their participation in state music educator association activities, including marching band competitions and concert band festivals, and how these experiences influence their professional confidence, motivation, and sense of belonging as leaders within music education.`,
    researchQuestion1: `How do Black high school band directors working in low socioeconomic status (SES) schools describe their experiences participating in state music educator association activities, such as marching band competitions and concert festivals, and the ways these experiences influence their professional confidence? Bandura’s Self-Efficacy Theory`,
    researchQuestion2: `How do Black high school band directors working in low socioeconomic status (SES) schools narrate how their participation in state music educator associations influences their professional motivation and commitment to their work as music educators and leaders? Self-Determination Theory (Deci & Ryan)`,
    researchQuestion3: `How do Black high school band directors teaching in low socioeconomic status (SES) schools describe their sense of belonging within state music educator associations, and how participation in competitions and festivals shapes that sense of belonging as leaders within music education? Strayhorn’s Sense of Belonging Theory`,
    researchQuestion4: `Methodology - Qual Study - Interviews    phenomenological research`,
    researchQuestion5: ``,
    cmoThoughts: `Population: Black high school band directors who are currently teaching in low socioeconomic status (SES) public high schools and who have participated in state music educator association activities, specifically marching band competitions and/or concert band festivals. Participants will be practicing music educators serving as the primary director of a high school band program and will have direct experience engaging with these state-level professional and competitive music education structures.
Clear Delimitations: Professional Role Delimitation
The study is limited to current or former high school band directors who are now teaching at the collegiate level. Participants must have experience serving as the primary director of a high school band program prior to or concurrent with their collegiate teaching role. Individuals who have not directed a high school band or who transitioned exclusively into non-teaching or non-academic roles are excluded.

Racial Identity Delimitation
Participation is limited to educators who self-identify as Black. This delimitation is intentional and central to examining how race intersects with leadership identity, professional confidence, motivation, and organizational participation within music education.

Career Experience Delimitation
The study focuses on the experiences of current and former high school band directors, including those who continue to direct at the high school level and those who have transitioned into collegiate teaching roles. Participants’ experiences are examined as they relate to their leadership roles within high school band programs, regardless of current professional appointment.

Contextual Delimitation (School Setting)
The study is confined to experiences that occurred while participants were directing bands in low socioeconomic status (SES) public high schools, including those who are currently directing in such settings and those reflecting on prior experiences in low-SES schools. Experiences from higher-SES or private school contexts are excluded.

Organizational Delimitation
The scope of the study is limited to participation in state music educator associations, specifically through marching band competitions and concert band festivals. Other professional experiences, such as national associations, collegiate-level adjudication, clinics, honor ensembles, or conferences, are outside the scope of this study.

Methodological Delimitation
This study employs a qualitative narrative research design and does not seek to establish causal relationships or produce statistically generalizable findings. Data are derived from participants’ narrated experiences and meaning-making processes.

Geographic Delimitation
The study includes Black band directors from multiple states across the United States. While participants represent diverse geographic regions, the study does not aim to provide a comprehensive or nationally representative account of all Black high school band directors’ experiences.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-16',
    developmentNote: `Final. Chair - Dr. Osborne`,
    memberName: `Jessica Jackson`,
    purposeStatement: `The purpose of this Delphi study was to identify the characteristics, requirements, and experiences that Chief Program Officers (CPOs) perceived as essential for success in a nonprofit, multi-site manager role, through the ONET Database Content Model.
The study further sought to identify what characteristics, requirements, and experiences CPOs perceived as most important for success during a team member’s first year in a multi-site manager role and the strategies they recommended to support the development of those characteristics, requirements, and experiences.`,
    researchQuestion1: `Round 1
What characteristics, requirements, and experiences do Chief Program Officers perceive as essential for success in a nonprofit, multi-site manager role?`,
    researchQuestion2: `Round 2
Which characteristics, requirements, and experiences perceived as essential for success in a nonprofit, multi-site manager role during Round 1 do CPOs identify as most important for success during a team member’s first year in a multi-site manager role.`,
    researchQuestion3: `Round 3
What strategies do CPOs recommend to support the development of the characteristics, requirements, and experiences identified as most important for success during a team member’s first year in a multi-site manager role.`,
    researchQuestion4: `Three Groups: Program Executive Leadership who supervise the multi-site, multi-sites themselves, program directors who report in.`,
    researchQuestion5: ``,
    cmoThoughts: `1) What competencies are identified by Sr. Executive Program Leaders as essential to success for a multi-site managers of after school programs. 2)  What competencies are identified by multi-site managers of after school programs as essential to success in a multi-site managers of after school programs. 3) What competencies are identified by direct reports of multi-site program managers of after school programs as essential to success in a multi-site managers of after school programs.4)  How do the competencies identified by Sr. Executive Program Leaders, Multi-Site Managers and Direct reports differ?  5)  How do the competencies identified by Senior Executive Program Leaders, Multi-Site Maagers and Direct reports align?`,
    additionalResearchNotes: `The purpose of this XX (qual or mixed methods for now) study was to identify the competencies essential for success for multi-site managers of after school programs, through the lens of Senior Executive Program leaders, multi-site managers, and direct reports of multi-site program managers.  The secondary purpose is to explore how the competencies identified by Sr. Executive Program Leaders, Multi-Site Managers and Direct reports differ and align.  Middle managers`,
  },
  {
    id: 'purpose-research-source-row-17',
    developmentNote: ``,
    memberName: `Reynaldo Dulaney`,
    purposeStatement: `The study further sought to identify what characteristics, requirements, and experiences CPOs perceived as most important for success during a team member’s first year in a multi-site manager role and the strategies they recommended to support the development of those characteristics, requirements, and experiences.`,
    researchQuestion1: `What are the experiences of the leaders of nonprofit organizations regarding ethical responsibility to the organization based on its purpose?`,
    researchQuestion2: `What are leadership perspectives regarding unethical behavior and how nonprofit organizations may be perceived in terms of social responsibility?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `How will you identify the "unethical behaviors".   Social Responsilbity of a nonprofit, unethical behaviors (misuse of funds, ). Be clear of your bias.  Is there a framework of social responsibility?  Looking at Orgs with dismissed leaders, interview current leadership..... What is the impact to restore trust with. Is word the "social responsilbity" a distraction (keep in mind it will result in a lot of writing in chapter II)?  Is conceptual framework "instituional betrayal"?  Jennifer DeLaRosa.is about to publish a dissertation close to this space (pending library submission). Can you look at her chapter II and find a foundation theory to build around?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-18',
    developmentNote: `1.27.26 Update`,
    memberName: `Reynaldo Dulaney`,
    purposeStatement: ``,
    researchQuestion1: `How do entry-level employees in nonprofit organizations perceive that ethical breaches by senior leadership impacted their abilities to carry out their organization's mission?`,
    researchQuestion2: `How do mid-level employees in nonprofit organizations perceive that ethical breaches by senior leadership impacted their abilities to carry out their organization's mission?`,
    researchQuestion3: `How do senior-level employees in nonprofit organizations perceive that ethical breaches by senior leadership impacted their abilities to carry out thier organization's mission?`,
    researchQuestion4: `How do entry-level employees describe the social harms that emerged when leadership integrity was compromised`,
    researchQuestion5: ``,
    cmoThoughts: `How do mid-level employees describe the social harms that emerged when leadership integrity was compromised`,
    additionalResearchNotes: `How do senior-level employees describe the social harms that emerged when leadership integrity was compromised

, providing a deeper context for how unethical behavior shapes the nonprofit mission.`,
  },
  {
    id: 'purpose-research-source-row-19',
    developmentNote: ``,
    memberName: `Sergiy Bryk`,
    purposeStatement: `Purpose Statement 1
The purpose of this study is to assess church staff and volunteers’ attitudes toward the use of AI tools for church tasks in U.S. congregations.
Purpose Statement 2
The purpose of this study is to examine the relationship between senior pastors’ transformational leadership, as experienced by staff and volunteers, and their’ intention to use AI tools for church tasks in U.S. congregations.`,
    researchQuestion1: `What are church staff and volunteers’ attitudes toward the use of AI tools for church tasks in U.S. congregations?`,
    researchQuestion2: `What is the relationship between senior pastors’ transformational leadership, as experienced by staff and volunteers, and their intention to use AI tools for church tasks in U.S. congregations?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Barna survey (2024) - majority of senior pastors use AI extensively.  Does the use of AI... do what?   Keep in mind you don't have to root into transformational leadership. You could look at trust, respect, other variables within leadership. Is there anything out there that studies Pastoral staff and AI already? (doubtful in my mind). How about pulling up a level. Can you find a study taht looks at Pastor and technology? Could it be expanded to include AI?  Do you have a hypothesis in your head?  Are you evaluating does it dimenish trust?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-20',
    developmentNote: `Rey Updated (April TBD,  2026)`,
    memberName: `Reynaldo Dulaney`,
    purposeStatement: ``,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-21',
    developmentNote: `1.25
Sergiy to dive into literature`,
    memberName: `Sergiy Bryk`,
    purposeStatement: `The purpose of this exploratory phenomenological study was to identify and describe the strategies used by exemplary leaders to motivate people within their organizations based on the three essential elements of motivation identified by Daniel H. Pink (2009); autonomy, mastery and purpose.  A further purpose was to identify the strategies the exemplary leaders perceived as having the most impact on motivation.`,
    researchQuestion1: `What strategies do exemplary leaders use to motivate people based on Daniel H. Pinks (2009) essential elements; autonomy, mastery and purpose.`,
    researchQuestion2: `How do exemplary leaders motivate through autonomy?`,
    researchQuestion3: `How do exemplary leaders create leadership presence through mastery?`,
    researchQuestion4: `How do exemplary leaders create leadership presence through purpose?`,
    researchQuestion5: ``,
    cmoThoughts: `What strategies do exemplary leaders perceive as being the most impactful in motivating people in their organization?`,
    additionalResearchNotes: `Conducting interviews, asking open-ended questions concerning organizational opportuniteis,

How does a perceived betrayal in leadership integrity influence an employee’s connection to the organization's mission?

In what ways do staff members navigate the social and cultural mistrust that occur within a nonprofit organization following an ethical failure by leadership?`,
  },
  {
    id: 'purpose-research-source-row-22',
    developmentNote: `10.11 Update`,
    memberName: `Sergiy Bryk`,
    purposeStatement: `The purpose of this case study is to determine how the use of AI tools by Sr. Pastors to write biblical messages impacts the confidence congregation members have in their sr. pastors.`,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-23',
    developmentNote: `1.28.26 Update`,
    memberName: `Tracy Rico`,
    purposeStatement: `The purpose of this phenomenological study is to explore the lived experiences of military veterans as they transition into the civilian sector and to identify differences in reintegration success between veterans who completed one enlistment term and those who retired after 20 years of service.`,
    researchQuestion1: `What are the perceived differences in reintegration success between veterans who completed one enlistment term and veterans who retired after 20 years of service?`,
    researchQuestion2: `In what ways do the two distinct groups describe their perceived differences as it relates to their personal, professional, and social lives?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-24',
    developmentNote: `Original sheet name: Elanis Cruz (Magallan)`,
    memberName: `Elanis Cruz`,
    purposeStatement: `The purpose of this qualitative research is to describe the leadership practices that principals or staff perceive as most effective to facilitate the smooth transition for students in K-12 schools.`,
    researchQuestion1: `What leadership practices can be shown to principals and staff to work with students who have difficult time with learning?`,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `What type of transition?  Verbally, you say... Understand where students come from when they have issues?  Pre and post covid.... What level of K-12 do you want to narrow into (elementary, middle, high).  Have you looked at dissertations on restorative practices?  Are you wanting to narrow to a) learning challenges, b) behavioral, or c) special ed?  I recognize those are often related.  Michele Lenertz did a dissertation on restorative practices. Derek King researched the relationship between behavioral issues and grades in core subjects.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-25',
    developmentNote: `10.11. Update`,
    memberName: ``,
    purposeStatement: `The purpose of this quan study is to explore how latino/a community college students living on-campus perceive their residential life experiences influneced their sense of belonging, engagement with the institution, and persistence toward degree completion.`,
    researchQuestion1: `Hold - How do community college students living on-campus housing describe and interpret their sense of belonging within residential environments intentionally connected to academic advising, mental health services, and basic needs support?`,
    researchQuestion2: `Hold - How do students residing in on-campus housing describe their engagement with academic, social, and support services within integrated residential environments?`,
    researchQuestion3: `Hold - How do students living in on-campus housing perceive the influence of integrated residential support services on their persistence toward degree completion?`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-26',
    developmentNote: `2.17.2026`,
    memberName: ``,
    purposeStatement: `The purpose of this quantitative study is to examine the relationship between residence in on-campus housing integrated with student support services and community college students’ levels of belonging, engagement, and persistence toward degree completion.`,
    researchQuestion1: `What is the relationship between microsystem disruptions within integrated on-campus housing environments and reported levels of institutional belonging among community college students ages 18–25?`,
    researchQuestion2: `To what extent do microsystem disruptions within integrated on-campus housing environments predict levels of academic and institutional engagement among community college students ages 18–25?`,
    researchQuestion3: `Is there a statistically significant relationship between microsystem disruptions within integrated on-campus housing environments and persistence toward degree completion among community college students ages 18–25?`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-27',
    developmentNote: `Thematic - Dr. Petersen`,
    memberName: ``,
    purposeStatement: `The purpose of this exploratory phenomenological study was to identify and describe the strategies used by exemplary leaders to motivate people within their organizations based on the three essential elements of motivation identified by Daniel H. Pink (2009); autonomy, mastery and purpose.  A further purpose was to identify the strategies the exemplary leaders perceived as having the most impact on motivation.`,
    researchQuestion1: `What strategies do exemplary leaders use to motivate people based on Daniel H. Pinks (2009) essential elements; autonomy, mastery and purpose.`,
    researchQuestion2: `How do exemplary leaders motivate through autonomy?`,
    researchQuestion3: `How do exemplary leaders create leadership presence through mastery?`,
    researchQuestion4: `How do exemplary leaders create leadership presence through purpose?`,
    researchQuestion5: ``,
    cmoThoughts: `What strategies do exemplary leaders perceive as being the most impactful in motivating people in their organization?`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-28',
    developmentNote: `2.21 update`,
    memberName: `Elanis Cruz`,
    purposeStatement: `The purpose of this quantitative study is to examine if their is a relationship between lowrider cultural identity (as measured by a Likert scale) and a sense of belonging among college students who participate in lowrider culture.`,
    researchQuestion1: `The purpose of this qualitative study is to explore how students who participate in low rider culture perceive their participation in low rider activities influences their sense of belonging.`,
    researchQuestion2: `How do students who participate in low rider culture perceive their participation in low rider activities influences their sense of belonging.`,
    researchQuestion3: `Literature, more literature :)`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-29',
    developmentNote: `2.21 update`,
    memberName: `Chris Mound`,
    purposeStatement: `psychological safety through the lens of post-9/11 veterans with disabilities, particularly those with PTSD, and how they experience transformational leadership in civilian organizational settings. I`,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: `How do transformational leadership approaches differ when managing integrated teams that include veterans with disabilities, and what practices best support retention and well-being?`,
    researchQuestion5: ``,
    cmoThoughts: `Through the lens of "who"? – Veteran and Upper Management… Focus immediate assignments on Psychological Safety, this will ensure what you are doing feeds into longer work. Could you interview veterans who have successfully transitions about what helps and hinders, through a Delphi methodology… working towards a set of best practices? The alumni I recommended you connect with is Kim Mitchell. She’s on the Facebook page for UMass Ed.D. Sadly, I don’t have her email. If you can’t get her via FB, please email Dr. Ryder to connect you two.`,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-30',
    developmentNote: `3.5 update`,
    memberName: `Chris Mound`,
    purposeStatement: `The purpose of this qualitative study is to explore military veterans’ experiences with transformational leadership behaviors in civilian organizational settings and their perceptions of psychological safety within complex institutions, including higher education.`,
    researchQuestion1: ``,
    researchQuestion2: `The purpose of this qualitative study is to explore the perceptions of disabled military veterans’ employed in private sector settings to identify how they experience psychological safety within their workplace settings, using the Academy of Brain Leadership's SAFETY Model.`,
    researchQuestion3: `Primary RQ:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience psychological safety in their workplace?`,
    researchQuestion4: `Sub 1:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience Security in their workplace?`,
    researchQuestion5: ``,
    cmoThoughts: `Sub 2:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience Autonomy in their workplace?`,
    additionalResearchNotes: `Sub 3:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience Fairness in their workplace?

Sub 4:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience Esteem in their workplace?

Sub 5:  What are the perceptions of disabled miltary veterans employed in the private sector on how they experience Trust in their workplace?

Methodology:`,
  },
  {
    id: 'purpose-research-source-row-31',
    developmentNote: `2/1/26`,
    memberName: `Celia Cipres`,
    purposeStatement: `The purpose of this study is to explore preschool teachers' perceptions of the current curriculum and framework strategies used with dual language learners in state funded California preschool classrooms.`,
    researchQuestion1: `1.What are preschool teachers' perceptions of current curriculum strategies used with dual language learners?`,
    researchQuestion2: `2.What are spreschool teachers' perceptions of current framework strategies used with dual language learners?`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-32',
    developmentNote: ``,
    memberName: `Jessica Leon`,
    purposeStatement: `The purpose of the proposed study is to identify which instructional approach is most effective in supporting student learning: Cognitively Guided Instruction or Direct Instruction through a comprehensive review of literature. The review of literature will provide analysis into the strengths and limitations of both instructional approaches, allowing conclusions to  be drawn about which instructional approach is most effective.`,
    researchQuestion1: `How does Cognitively Guided Instruction impact students’ conceptual understanding of mathematical concepts compared to Direct Instruction ?`,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `This is interesting because we don't generally see a meta-analysis of literature as a study.  Have you discussed this with your research instructor?  When I look at your Research Question, it's clear that you want to compare two different instructional models.  Through the eyes of expert teachers?  What level of insturction do you want to focus in on. For now, as you have to do research, I would focus on the two different instructional models. Have you researched dissertations with the instructional model as a key word? That might help focus you a bit more.`,
    additionalResearchNotes: `Shift on Morale, might be result of PLCC and collaborative practives. Examine effective collaborative practices... Mixed methods?  Could look at sites with collaborative practices`,
  },
  {
    id: 'purpose-research-source-row-33',
    developmentNote: `2.24 Update`,
    memberName: `Jessica Leon`,
    purposeStatement: `Effective collaborative practices in professional learning communities`,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-34',
    developmentNote: `Original sheet name: Monica`,
    memberName: `Monica Romero`,
    purposeStatement: `The primary purpose of this initiative is to develop and promote evidence-based leadership approaches that expand access to college and vocational training for foster youth while establishing preventative frameworks to reduce homelessness. By leveraging cross-sector collaboration between child welfare services, educational institutions, and community-based organizations, we aim to create sustainable, youth-centered solutions that prioritize long-term stability and self-sufficiency.`,
    researchQuestion1: `What role do high school counselors and school leaders play in preparing foster youth for higher education?`,
    researchQuestion2: `How effective are pre-college mentorship and academic support services in increasing college enrollment and retention among foster youth?`,
    researchQuestion3: `On Housing Stability:How does access to transitional housing impact the academic success and employment readiness of foster youth post-18?`,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-35',
    developmentNote: `10.11 Update`,
    memberName: `Monica Romero`,
    purposeStatement: ``,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-36',
    developmentNote: `Original sheet name: Trevor`,
    memberName: `Trevor Desouza`,
    purposeStatement: `Topic: How much of an impediment to minority leadership are the following: Work-place cultures that have not rejected but condoned systemic non-inclusive practices, biased promotion, hiring and recruiting processes, opportunity and resource restrictions, which has fortified a non-hiring and recruiting processes, opportunity and resource restrictions, which has fortified a non-minority hierarchy. Factors such as residential and educational segregation, microaggression, implicit and unconscious biases, informal networks limited to same stature individuals, lack of mentorship at workplaces, schools, and communities for minoritized groups, leading to lack of`,
    researchQuestion1: `How much of an impediment to minority leadership are the following: Work-place cultures that have not rejected but condoned systemic non-inclusive practices, biased promotion, hiring and recruiting processes, opportunity and resource restrictions, which has fortified a non-hiring and recruiting processes, opportunity and resource restrictions,`,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: `Super interesting.  There's a lot packed in here, which makes for a hard and long chapter II.  I strongly recommend you narrow. A few questions to help you narrow. 1)  Do you want to do quantative data (survey) or qual (interviews)?  What population do you want to work with?  (business, education, military, etc.). DId you find a dissertation you are working around?`,
    additionalResearchNotes: `10.20 update. Trevor to start scanning literature around barriers to promotions in military environments for under-represented populations. Aim is to find the gap in the literature, what "don't we know". He will reach out to Dr. CMO when he has narrowed to a gap and a conceptual framework to build aroound.  @Trevor`,
  },
  {
    id: 'purpose-research-source-row-37',
    developmentNote: ``,
    memberName: `Trevor Desouza`,
    purposeStatement: `mentorship at workplaces, schools, and communities for minoritized groups, leading to lack of mentorship at workplaces, schools, and communities for minoritized groups, leading to lack of self-motivation, restricted ambition.`,
    researchQuestion1: ``,
    researchQuestion2: ``,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-38',
    developmentNote: `Chair = Dr. Dennell Smith
Monica - focus on school. meeting with SW to understand the process to ensure they aren't falling through the cracks.`,
    memberName: `Monica Romero`,
    purposeStatement: `The pupose of this phenonomolical study is to describe what social workers perceive are the circumstnaces that prevent former foster youth from participating in programs designed to cure housing insecurity in California.`,
    researchQuestion1: `Research Question 1 - What do social workers preceive are the circumstnaces that prevent former foster youth from partiipcating in programs designed to cure housing insecurity in California.`,
    researchQuestion2: `Next steps:  Scan dissertations from the last five years using key words:  Foster Care + Housing, Foster Care + Housing Stability, Transitional Age Youth + Housing, Transitional Age Youth + Housing Instability, Transitional Age Youth + Homelessness, Foster Care + Homelessness (and in all of these, add California). Gap in the research that you can fill.  Meet with Dr. CMO in three weeks from 1.28`,
    researchQuestion3: ``,
    researchQuestion4: ``,
    researchQuestion5: ``,
    cmoThoughts: ``,
    additionalResearchNotes: ``,
  },
  {
    id: 'purpose-research-source-row-39',
    developmentNote: `Thematic - Dr. Petersen`,
    memberName: ``,
    purposeStatement: `The purpose of this exploratory phenomenological study was to identify and describe the strategies used by exemplary leaders to motivate people within their organizations based on the three essential elements of motivation identified by Daniel H. Pink (2009); autonomy, mastery and purpose.  A further purpose was to identify the strategies the exemplary leaders perceived as having the most impact on motivation.`,
    researchQuestion1: `What strategies do exemplary leaders use to motivate people based on Daniel H. Pinks (2009) essential elements; autonomy, mastery and purpose.`,
    researchQuestion2: `How do exemplary leaders motivate through autonomy?`,
    researchQuestion3: `How do exemplary leaders create leadership presence through mastery?`,
    researchQuestion4: `How do exemplary leaders create leadership presence through purpose?`,
    researchQuestion5: ``,
    cmoThoughts: `What strategies do exemplary leaders perceive as being the most impactful in motivating people in their organization?`,
    additionalResearchNotes: ``,
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

function createEmptyMeetingForm(): CohortMeetingFormState {
  return {
    date: '',
    term: '',
    calendarYear: '',
    meetingNumber: '',
  }
}

function createEmptyPurposeResearchRecord(): CohortPurposeResearchRecord {
  return {
    id: crypto.randomUUID(),
    developmentNote: '',
    memberName: '',
    purposeStatement: '',
    researchQuestion1: '',
    researchQuestion2: '',
    researchQuestion3: '',
    researchQuestion4: '',
    researchQuestion5: '',
    cmoThoughts: '',
    additionalResearchNotes: '',
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

function CohortDataSurveyPage({
  survey,
  onUpdateSurvey,
}: CohortDataSurveyPageProps) {
  const activeParticipants =
    dataSurveyParticipantDisplayOrder.flatMap(
      (participantId) => {
        const participant =
          dataSurveyParticipantSeed.find(
            (candidate) =>
              candidate.id === participantId,
          )

        return participant === undefined
          ? []
          : [participant]
      },
    )

  function getColumnBoundaryClass(
    dateIndex: number,
  ): string {
    if (dateIndex % 4 === 0) {
      return ' data-survey-term-start'
    }

    if (dateIndex % 2 === 0) {
      return ' data-survey-cohort-start'
    }

    return ''
  }

  function splitHolidayNote(
    holidayNote: string,
  ): {
    readonly lead: string
    readonly text: string
  } {
    const firstSpaceIndex =
      holidayNote.indexOf(' ')

    if (firstSpaceIndex === -1) {
      return {
        lead: '',
        text: holidayNote,
      }
    }

    return {
      lead: holidayNote.slice(
        0,
        firstSpaceIndex,
      ),
      text: holidayNote.slice(
        firstSpaceIndex + 1,
      ),
    }
  }

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Data Survey</h1>
      </header>

      <div className="data-survey-workspace">
        <div className="data-survey-instruction">
          <span
            className="data-survey-instruction-icon"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 32 32"
              className="data-survey-calendar-icon"
            >
              <rect
                x="6"
                y="8"
                width="20"
                height="18"
                rx="2"
              />
              <path d="M10 5v6M22 5v6M6 13h20" />
              <path d="M10 17h3M15 17h3M20 17h3M10 21h3M15 21h3M20 21h3" />
            </svg>
          </span>

          <strong>
            Cohort meetings are Sundays,
            1:30 - 5:30 PM Pacific Time.
          </strong>

          <span className="data-survey-instruction-secondary">
            Enter one availability code in each cell.
          </span>
        </div>

        <div
          className="data-survey-key"
          aria-label="Data Survey availability codes"
        >
          <span>
            <strong className="data-survey-key-preferred">
              P
            </strong>
            Preferred
          </span>

          <span>
            <strong className="data-survey-key-conflict">
              C
            </strong>
            Conflict
          </span>

          <span>
            <strong className="data-survey-key-available">
              A
            </strong>
            Available
          </span>

          <span>
            <strong className="data-survey-key-adjust">
              I
            </strong>
            Not Ideal but I will adjust
          </span>
        </div>

        <div className="data-survey-table-frame">
          <table className="data-survey-table">
            <thead>
              <tr className="data-survey-term-row">
                <th
                  className="data-survey-name-super-header"
                  rowSpan={4}
                >
                  <div className="data-survey-name-super-content">
                    <span
                      className="data-survey-name-super-icon"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 48 48"
                        className="data-survey-people-icon"
                      >
                        <circle cx="17" cy="17" r="6" />
                        <circle cx="31" cy="17" r="6" />
                        <path d="M6 35c0-6 4.5-10 11-10 3 0 5.5.8 7 2.2" />
                        <path d="M42 35c0-6-4.5-10-11-10-3 0-5.5.8-7 2.2" />
                        <path d="M11 40h26" />
                      </svg>
                    </span>

                    <span>Name</span>
                  </div>
                </th>

                {dataSurveyTerms.map((term) => (
                  <th
                    key={term.id}
                    className="data-survey-term-header"
                    colSpan={4}
                  >
                    <strong>{term.label}</strong>
                    <span>{term.window}</span>
                  </th>
                ))}
              </tr>

              <tr className="data-survey-cohort-row">
                {dataSurveyTerms.flatMap((term) => [
                  <th
                    key={`${term.id}-cohort-1`}
                    className="data-survey-cohort-header data-survey-cohort-one data-survey-term-start"
                    colSpan={2}
                  >
                    Cohort 1
                  </th>,
                  <th
                    key={`${term.id}-cohort-2`}
                    className="data-survey-cohort-header data-survey-cohort-two data-survey-cohort-start"
                    colSpan={2}
                  >
                    Cohort 2
                  </th>,
                ])}
              </tr>

              <tr className="data-survey-week-row">
                {dataSurveyDateOptions.map(
                  (dateOption, dateIndex) => (
                    <th
                      key={`${dateOption.id}-week`}
                      className={`data-survey-week-column${getColumnBoundaryClass(
                        dateIndex,
                      )}`}
                    >
                      {dateOption.week}
                    </th>
                  ),
                )}
              </tr>

              <tr className="data-survey-date-row">
                {dataSurveyDateOptions.map(
                  (dateOption, dateIndex) => (
                    <th
                      key={dateOption.id}
                      className={`data-survey-date-column${dateOption.holidayNote
                        ? ' data-survey-date-holiday'
                        : ''
                        }${getColumnBoundaryClass(
                          dateIndex,
                        )}`}
                      title={
                        dateOption.holidayNote ??
                        dateOption.dateLabel
                      }
                    >
                      {dateOption.dateLabel}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {activeParticipants.map(
                (participant) => {
                  const displayName =
                    participant.id ===
                      'data-survey-participant-6'
                      ? 'Dr. Cheryl-Marie Osborne (Mentor)'
                      : participant.name

                  return (
                    <tr key={participant.id}>
                      <td
                        className={`data-survey-name-column${participant.id ===
                          'data-survey-participant-6'
                          ? ' data-survey-mentor-name'
                          : ''
                          }`}
                        title={displayName}
                      >
                        {displayName}
                      </td>

                      {dataSurveyDateOptions.map(
                        (dateOption, dateIndex) => {
                          const surveyKey =
                            getCohortDataSurveyKey(
                              participant.id,
                              dateOption.id,
                            )

                          const surveyMark =
                            survey[surveyKey] ?? ''

                          const markClass =
                            surveyMark === 'P'
                              ? ' data-survey-mark-preferred'
                              : surveyMark === 'C'
                                ? ' data-survey-mark-conflict'
                                : surveyMark === 'A'
                                  ? ' data-survey-mark-available'
                                  : surveyMark === 'I'
                                    ? ' data-survey-mark-adjust'
                                    : ' data-survey-mark-empty'

                          return (
                            <td
                              key={dateOption.id}
                              className={`data-survey-mark-cell${getColumnBoundaryClass(
                                dateIndex,
                              )}`}
                            >
                              <input
                                type="text"
                                maxLength={1}
                                spellCheck={false}
                                autoComplete="off"
                                className={`data-survey-mark-input${markClass}`}
                                value={surveyMark}
                                aria-label={`${displayName}, ${dateOption.dateLabel}, ${dateOption.cohort}, ${dateOption.week}`}
                                title="P = Preferred | C = Conflict | A = Available | I = Not Ideal but I will adjust"
                                onFocus={(event) =>
                                  event.currentTarget.select()
                                }
                                onChange={(event) =>
                                  onUpdateSurvey(
                                    participant.id,
                                    dateOption.id,
                                    normalizeCohortDataSurveyMark(
                                      event.target.value,
                                    ),
                                  )
                                }
                              />
                            </td>
                          )
                        },
                      )}
                    </tr>
                  )
                },
              )}
            </tbody>

            <tfoot>
              <tr className="data-survey-holiday-row">
                <th className="data-survey-holiday-label">
                  Holidays:
                </th>

                {dataSurveyDateOptions.map(
                  (dateOption, dateIndex) => {
                    const holiday =
                      dateOption.holidayNote ===
                        undefined
                        ? null
                        : splitHolidayNote(
                          dateOption.holidayNote,
                        )

                    return (
                      <th
                        key={`${dateOption.id}-holiday`}
                        className={`data-survey-holiday-note-cell${dateOption.holidayNote
                          ? ' data-survey-holiday-note-cell-populated'
                          : ''
                          }${getColumnBoundaryClass(
                            dateIndex,
                          )}`}
                        title={
                          dateOption.holidayNote ?? ''
                        }
                      >
                        {holiday !== null && (
                          <>
                            {holiday.lead && (
                              <strong>
                                {holiday.lead}
                              </strong>
                            )}

                            <span>
                              {holiday.text}
                            </span>
                          </>
                        )}
                      </th>
                    )
                  },
                )}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="data-survey-holiday-footnote">
          <span>
            {dataSurveyHolidayGeneralNote.primary}
          </span>

          <strong>
            {dataSurveyHolidayGeneralNote.emphasis}
          </strong>
        </div>
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

function CohortPurposeResearchPage({
  contacts,
  records,
  onAddRecord,
  onInsertRecordAfter,
  onDeleteRecord,
  onUpdateRecord,
}: CohortPurposeResearchPageProps) {
  const [nameSearch, setNameSearch] = useState('')

  const [
    isDevelopmentWorkspaceExpanded,
    setIsDevelopmentWorkspaceExpanded,
  ] = useState(false)

  const [selectedCell, setSelectedCell] =
    useState<PurposeResearchSelectedCell | null>(null)

  const [selectionAnchor, setSelectionAnchor] =
    useState<PurposeResearchSelectedCell | null>(null)

  const [selectionFocus, setSelectionFocus] =
    useState<PurposeResearchSelectedCell | null>(null)

  const [isRangeSelecting, setIsRangeSelecting] =
    useState(false)

  const [cellFormats, setCellFormats] =
    useState<PurposeResearchCellFormatState>(
      () => readStoredPurposeResearchCellFormats(),
    )

  const [columnWidths, setColumnWidths] =
    useState<PurposeResearchColumnWidthState>(
      () => readStoredPurposeResearchColumnWidths(),
    )

  const [rowHeights, setRowHeights] =
    useState<PurposeResearchRowHeightState>(
      () => readStoredPurposeResearchRowHeights(),
    )

  const [hiddenColumns, setHiddenColumns] =
    useState<readonly CohortPurposeResearchField[]>(
      () => readStoredPurposeResearchHiddenColumns(),
    )

  const [contextMenu, setContextMenu] =
    useState<PurposeResearchContextMenuState | null>(
      null,
    )

  const [clipboardText, setClipboardText] =
    useState<string | null>(null)

  const purposeResearchTableFrameRef =
    useRef<HTMLDivElement | null>(null)

  const rangePointerPositionRef =
    useRef<{
      readonly x: number
      readonly y: number
    } | null>(null)

  useEffect(() => {
    window.localStorage.setItem(
      PURPOSE_RESEARCH_CELL_FORMATS_STORAGE_KEY,
      JSON.stringify(cellFormats),
    )
  }, [cellFormats])

  useEffect(() => {
    window.localStorage.setItem(
      PURPOSE_RESEARCH_COLUMN_WIDTHS_STORAGE_KEY,
      JSON.stringify(columnWidths),
    )
  }, [columnWidths])

  useEffect(() => {
    window.localStorage.setItem(
      PURPOSE_RESEARCH_ROW_HEIGHTS_STORAGE_KEY,
      JSON.stringify(rowHeights),
    )
  }, [rowHeights])

  useEffect(() => {
    window.localStorage.setItem(
      PURPOSE_RESEARCH_HIDDEN_COLUMNS_STORAGE_KEY,
      JSON.stringify(hiddenColumns),
    )
  }, [hiddenColumns])

  useEffect(() => {
    function stopRangeSelection(): void {
      setIsRangeSelecting(false)
      rangePointerPositionRef.current = null
    }

    window.addEventListener(
      'pointerup',
      stopRangeSelection,
    )

    return () => {
      window.removeEventListener(
        'pointerup',
        stopRangeSelection,
      )
    }
  }, [])

  useEffect(() => {
    if (!isRangeSelecting) {
      return
    }

    const edgeThreshold = 48
    const maximumHorizontalScrollStep = 24
    const maximumVerticalScrollStep = 22

    let animationFrameId = 0

    function trackRangePointer(
      event: PointerEvent,
    ): void {
      rangePointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    function calculatePositiveScrollStep(
      distanceIntoEdge: number,
      maximumScrollStep: number,
    ): number {
      return Math.max(
        4,
        Math.ceil(
          (Math.min(
            edgeThreshold,
            Math.max(0, distanceIntoEdge),
          ) /
            edgeThreshold) *
          maximumScrollStep,
        ),
      )
    }

    function continueRangeAutoScroll(): void {
      const tableFrame =
        purposeResearchTableFrameRef.current

      const pointerPosition =
        rangePointerPositionRef.current

      if (
        tableFrame !== null &&
        pointerPosition !== null
      ) {
        const frameBounds =
          tableFrame.getBoundingClientRect()

        let horizontalScrollStep = 0
        let verticalScrollStep = 0

        if (
          pointerPosition.x >=
          frameBounds.right - edgeThreshold
        ) {
          horizontalScrollStep =
            calculatePositiveScrollStep(
              pointerPosition.x -
              (frameBounds.right -
                edgeThreshold),
              maximumHorizontalScrollStep,
            )
        } else if (
          pointerPosition.x <=
          frameBounds.left + edgeThreshold
        ) {
          horizontalScrollStep =
            -calculatePositiveScrollStep(
              frameBounds.left +
              edgeThreshold -
              pointerPosition.x,
              maximumHorizontalScrollStep,
            )
        }

        if (
          pointerPosition.y >=
          frameBounds.bottom - edgeThreshold
        ) {
          verticalScrollStep =
            calculatePositiveScrollStep(
              pointerPosition.y -
              (frameBounds.bottom -
                edgeThreshold),
              maximumVerticalScrollStep,
            )
        } else if (
          pointerPosition.y <=
          frameBounds.top + edgeThreshold
        ) {
          verticalScrollStep =
            -calculatePositiveScrollStep(
              frameBounds.top +
              edgeThreshold -
              pointerPosition.y,
              maximumVerticalScrollStep,
            )
        }

        if (
          horizontalScrollStep !== 0 ||
          verticalScrollStep !== 0
        ) {
          const maximumScrollLeft =
            tableFrame.scrollWidth -
            tableFrame.clientWidth

          const maximumScrollTop =
            tableFrame.scrollHeight -
            tableFrame.clientHeight

          tableFrame.scrollLeft = Math.max(
            0,
            Math.min(
              maximumScrollLeft,
              tableFrame.scrollLeft +
              horizontalScrollStep,
            ),
          )

          tableFrame.scrollTop = Math.max(
            0,
            Math.min(
              maximumScrollTop,
              tableFrame.scrollTop +
              verticalScrollStep,
            ),
          )

          const probeX = Math.max(
            frameBounds.left + 8,
            Math.min(
              frameBounds.right - 18,
              pointerPosition.x,
            ),
          )

          const probeY = Math.max(
            frameBounds.top + 8,
            Math.min(
              frameBounds.bottom - 18,
              pointerPosition.y,
            ),
          )

          const targetElement =
            document.elementFromPoint(
              probeX,
              probeY,
            )

          const tableCell =
            targetElement?.closest(
              'td[data-record-id][data-field]',
            )

          if (
            tableCell instanceof
            HTMLTableCellElement
          ) {
            const recordId =
              tableCell.dataset.recordId

            const fieldValue =
              tableCell.dataset.field

            const matchingColumn =
              purposeResearchColumns.find(
                (column) =>
                  column.field === fieldValue,
              )

            if (
              recordId &&
              matchingColumn
            ) {
              const nextCell = {
                recordId,
                field: matchingColumn.field,
              }

              setSelectionFocus(
                (currentFocus) =>
                  currentFocus?.recordId ===
                    nextCell.recordId &&
                    currentFocus.field ===
                    nextCell.field
                    ? currentFocus
                    : nextCell,
              )

              setSelectedCell(
                (currentCell) =>
                  currentCell?.recordId ===
                    nextCell.recordId &&
                    currentCell.field ===
                    nextCell.field
                    ? currentCell
                    : nextCell,
              )
            }
          }
        }
      }

      animationFrameId =
        window.requestAnimationFrame(
          continueRangeAutoScroll,
        )
    }

    window.addEventListener(
      'pointermove',
      trackRangePointer,
    )

    animationFrameId =
      window.requestAnimationFrame(
        continueRangeAutoScroll,
      )

    return () => {
      window.removeEventListener(
        'pointermove',
        trackRangePointer,
      )

      window.cancelAnimationFrame(
        animationFrameId,
      )
    }
  }, [isRangeSelecting])

  const memberNames = [
    ...new Set([
      ...contacts
        .filter((contact) => !contact.isMentor)
        .map((contact) => contact.name),
      ...formerCohortMembers.map((member) => member.name),
    ]),
  ].sort((firstName, secondName) =>
    firstName.localeCompare(secondName, 'en-US', {
      sensitivity: 'base',
    }),
  )

  const normalizedSearch = nameSearch
    .trim()
    .toLocaleLowerCase('en-US')

  const visibleRecords = normalizedSearch
    ? records.filter((record) =>
      record.memberName
        .toLocaleLowerCase('en-US')
        .includes(normalizedSearch),
    )
    : records

  const visibleColumns = purposeResearchColumns.filter(
    (column) =>
      !hiddenColumns.includes(column.field),
  )

  const tableWidth =
    46 +
    visibleColumns.reduce(
      (totalWidth, column) =>
        totalWidth +
        (columnWidths[column.field] ??
          column.defaultWidth),
      0,
    )

  const developmentNoteColumnWidth =
    columnWidths.developmentNote ??
    purposeResearchColumns.find(
      (column) =>
        column.field === 'developmentNote',
    )?.defaultWidth ??
    170

  const frozenNameColumnLeft =
    46 +
    (hiddenColumns.includes('developmentNote')
      ? 0
      : developmentNoteColumnWidth)

  function isPurposeResearchField(
    value: string,
  ): value is CohortPurposeResearchField {
    return purposeResearchColumns.some(
      (column) => column.field === value,
    )
  }

  function getSelectedCells():
    PurposeResearchSelectedCell[] {
    if (
      selectionAnchor === null ||
      selectionFocus === null
    ) {
      return selectedCell === null
        ? []
        : [selectedCell]
    }

    const anchorRowIndex =
      visibleRecords.findIndex(
        (record) =>
          record.id === selectionAnchor.recordId,
      )

    const focusRowIndex =
      visibleRecords.findIndex(
        (record) =>
          record.id === selectionFocus.recordId,
      )

    const anchorColumnIndex =
      visibleColumns.findIndex(
        (column) =>
          column.field === selectionAnchor.field,
      )

    const focusColumnIndex =
      visibleColumns.findIndex(
        (column) =>
          column.field === selectionFocus.field,
      )

    if (
      anchorRowIndex < 0 ||
      focusRowIndex < 0 ||
      anchorColumnIndex < 0 ||
      focusColumnIndex < 0
    ) {
      return selectedCell === null
        ? []
        : [selectedCell]
    }

    const firstRowIndex = Math.min(
      anchorRowIndex,
      focusRowIndex,
    )

    const lastRowIndex = Math.max(
      anchorRowIndex,
      focusRowIndex,
    )

    const firstColumnIndex = Math.min(
      anchorColumnIndex,
      focusColumnIndex,
    )

    const lastColumnIndex = Math.max(
      anchorColumnIndex,
      focusColumnIndex,
    )

    const selectedCells:
      PurposeResearchSelectedCell[] = []

    for (
      let rowIndex = firstRowIndex;
      rowIndex <= lastRowIndex;
      rowIndex += 1
    ) {
      const record = visibleRecords[rowIndex]

      if (!record) {
        continue
      }

      for (
        let columnIndex = firstColumnIndex;
        columnIndex <= lastColumnIndex;
        columnIndex += 1
      ) {
        const column =
          visibleColumns[columnIndex]

        if (!column) {
          continue
        }

        selectedCells.push({
          recordId: record.id,
          field: column.field,
        })
      }
    }

    return selectedCells
  }

  function isCellInSelection(
    recordId: string,
    field: CohortPurposeResearchField,
  ): boolean {
    return getSelectedCells().some(
      (cell) =>
        cell.recordId === recordId &&
        cell.field === field,
    )
  }

  function isEntirePurposeResearchTableSelected(): boolean {
    if (
      visibleRecords.length === 0 ||
      visibleColumns.length === 0
    ) {
      return false
    }

    return (
      getSelectedCells().length ===
      visibleRecords.length * visibleColumns.length
    )
  }

  function selectEntirePurposeResearchTable(): void {
    const firstRecord = visibleRecords[0]
    const lastRecord =
      visibleRecords[visibleRecords.length - 1]

    const firstColumn = visibleColumns[0]
    const lastColumn =
      visibleColumns[visibleColumns.length - 1]

    if (
      firstRecord === undefined ||
      lastRecord === undefined ||
      firstColumn === undefined ||
      lastColumn === undefined
    ) {
      return
    }

    const firstCell: PurposeResearchSelectedCell = {
      recordId: firstRecord.id,
      field: firstColumn.field,
    }

    const lastCell: PurposeResearchSelectedCell = {
      recordId: lastRecord.id,
      field: lastColumn.field,
    }

    setSelectedCell(firstCell)
    setSelectionAnchor(firstCell)
    setSelectionFocus(lastCell)
    setIsRangeSelecting(false)
  }

  function beginCellRangeSelection(
    recordId: string,
    field: CohortPurposeResearchField,
  ): void {
    const cell = {
      recordId,
      field,
    }

    setSelectedCell(cell)
    setSelectionAnchor(cell)
    setSelectionFocus(cell)
    setIsRangeSelecting(true)
  }

  function extendCellRangeSelection(
    recordId: string,
    field: CohortPurposeResearchField,
  ): void {
    if (!isRangeSelecting) {
      return
    }

    const cell = {
      recordId,
      field,
    }

    setSelectionFocus(cell)
    setSelectedCell(cell)
  }

  function focusPurposeResearchCell(
    cell: PurposeResearchSelectedCell,
  ): void {
    setSelectedCell(cell)
    setSelectionAnchor(cell)
    setSelectionFocus(cell)

    window.requestAnimationFrame(() => {
      const tableFrame =
        purposeResearchTableFrameRef.current

      if (tableFrame === null) {
        return
      }

      const tableCells =
        tableFrame.querySelectorAll<HTMLTableCellElement>(
          'td[data-record-id][data-field]',
        )

      const targetCell = Array.from(
        tableCells,
      ).find(
        (tableCell) =>
          tableCell.dataset.recordId ===
          cell.recordId &&
          tableCell.dataset.field ===
          cell.field,
      )

      if (!targetCell) {
        return
      }

      targetCell.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      })

      tableFrame.focus({
        preventScroll: true,
      })
    })
  }

  function movePurposeResearchSelection(
    rowChange: number,
    columnChange: number,
  ): void {
    const currentCell =
      selectionFocus ?? selectedCell

    if (currentCell === null) {
      return
    }

    const currentRowIndex =
      visibleRecords.findIndex(
        (record) =>
          record.id === currentCell.recordId,
      )

    const currentColumnIndex =
      visibleColumns.findIndex(
        (column) =>
          column.field === currentCell.field,
      )

    if (
      currentRowIndex < 0 ||
      currentColumnIndex < 0
    ) {
      return
    }

    const nextRowIndex = Math.max(
      0,
      Math.min(
        visibleRecords.length - 1,
        currentRowIndex + rowChange,
      ),
    )

    const nextColumnIndex = Math.max(
      0,
      Math.min(
        visibleColumns.length - 1,
        currentColumnIndex + columnChange,
      ),
    )

    const nextRecord =
      visibleRecords[nextRowIndex]

    const nextColumn =
      visibleColumns[nextColumnIndex]

    if (
      nextRecord === undefined ||
      nextColumn === undefined
    ) {
      return
    }

    focusPurposeResearchCell({
      recordId: nextRecord.id,
      field: nextColumn.field,
    })
  }

  function movePurposeResearchSelectionHome(): void {
    const tableFrame =
      purposeResearchTableFrameRef.current

    if (tableFrame === null) {
      return
    }

    tableFrame.scrollLeft = 0

    const currentCell =
      selectionFocus ?? selectedCell

    if (currentCell === null) {
      return
    }

    const currentRowIndex =
      visibleRecords.findIndex(
        (record) =>
          record.id === currentCell.recordId,
      )

    const firstVisibleColumn =
      visibleColumns[0]

    if (
      currentRowIndex < 0 ||
      firstVisibleColumn === undefined
    ) {
      return
    }

    const currentRecord =
      visibleRecords[currentRowIndex]

    if (currentRecord === undefined) {
      return
    }

    focusPurposeResearchCell({
      recordId: currentRecord.id,
      field: firstVisibleColumn.field,
    })

    tableFrame.scrollLeft = 0
  }

  function getCellKey(
    recordId: string,
    field: CohortPurposeResearchField,
  ): string {
    return `${recordId}::${field}`
  }

  function getCellFormat(
    recordId: string,
    field: CohortPurposeResearchField,
  ): PurposeResearchCellFormat {
    return (
      cellFormats[getCellKey(recordId, field)] ??
      defaultPurposeResearchCellFormat
    )
  }

  const selectedFormat =
    selectedCell === null
      ? defaultPurposeResearchCellFormat
      : getCellFormat(
        selectedCell.recordId,
        selectedCell.field,
      )

  const hasSelectedTextCells =
    getSelectedCells().some(
      (cell) => cell.field !== 'memberName',
    )

  function updateSelectedCellFormat(
    updates: Partial<PurposeResearchCellFormat>,
  ): void {
    const selectedCells = getSelectedCells()

    if (selectedCells.length === 0) {
      return
    }

    setCellFormats((currentFormats) => {
      const nextFormats = {
        ...currentFormats,
      }

      for (const cell of selectedCells) {
        const cellKey = getCellKey(
          cell.recordId,
          cell.field,
        )

        nextFormats[cellKey] = {
          ...(currentFormats[cellKey] ??
            defaultPurposeResearchCellFormat),
          ...updates,
        }
      }

      return nextFormats
    })
  }

  function removePurposeResearchListPrefix(
    value: string,
  ): string {
    return value.replace(
      /^(?:\s*•\s+|\s*\d+\.\s+)/,
      '',
    )
  }

  function formatPurposeResearchListValue(
    value: string,
    listStyle: PurposeResearchListStyle,
  ): string {
    const lines = value
      .split(/\r?\n/)
      .map(removePurposeResearchListPrefix)

    if (listStyle === 'none') {
      return lines.join('\n')
    }

    if (listStyle === 'bulleted') {
      return lines
        .map((line) =>
          line.trim().length === 0
            ? ''
            : `• ${line}`,
        )
        .join('\n')
    }

    let listNumber = 0

    return lines
      .map((line) => {
        if (line.trim().length === 0) {
          return ''
        }

        listNumber += 1

        return `${listNumber}. ${line}`
      })
      .join('\n')
  }

  function toggleSelectedCellListStyle(
    listStyle: Exclude<
      PurposeResearchListStyle,
      'none'
    >,
  ): void {
    const selectedTextCells =
      getSelectedCells().filter(
        (cell) => cell.field !== 'memberName',
      )

    if (selectedTextCells.length === 0) {
      return
    }

    const shouldRemoveList =
      selectedTextCells.every(
        (cell) =>
          getCellFormat(
            cell.recordId,
            cell.field,
          ).listStyle === listStyle,
      )

    const nextListStyle:
      PurposeResearchListStyle =
      shouldRemoveList
        ? 'none'
        : listStyle

    for (const cell of selectedTextCells) {
      const currentValue = getRecordValue(
        cell.recordId,
        cell.field,
      )

      const nextValue =
        formatPurposeResearchListValue(
          currentValue,
          nextListStyle,
        )

      if (nextValue !== currentValue) {
        onUpdateRecord(
          cell.recordId,
          cell.field,
          nextValue,
        )
      }
    }

    setCellFormats((currentFormats) => {
      const nextFormats = {
        ...currentFormats,
      }

      for (const cell of selectedTextCells) {
        const cellKey = getCellKey(
          cell.recordId,
          cell.field,
        )

        nextFormats[cellKey] = {
          ...(currentFormats[cellKey] ??
            defaultPurposeResearchCellFormat),
          listStyle: nextListStyle,
        }
      }

      return nextFormats
    })
  }

  function clearSelectedCellFormatting(): void {
    const selectedCells = getSelectedCells()

    if (selectedCells.length === 0) {
      return
    }

    for (const cell of selectedCells) {
      if (cell.field === 'memberName') {
        continue
      }

      const currentFormat = getCellFormat(
        cell.recordId,
        cell.field,
      )

      if (currentFormat.listStyle === 'none') {
        continue
      }

      const currentValue = getRecordValue(
        cell.recordId,
        cell.field,
      )

      const nextValue =
        formatPurposeResearchListValue(
          currentValue,
          'none',
        )

      if (nextValue !== currentValue) {
        onUpdateRecord(
          cell.recordId,
          cell.field,
          nextValue,
        )
      }
    }

    setCellFormats((currentFormats) => {
      const nextFormats = {
        ...currentFormats,
      }

      for (const cell of selectedCells) {
        nextFormats[
          getCellKey(
            cell.recordId,
            cell.field,
          )
        ] = {
          ...defaultPurposeResearchCellFormat,
        }
      }

      return nextFormats
    })
  }

  function getCellStyle(
    recordId: string,
    field: CohortPurposeResearchField,
  ): CSSProperties {
    const format = getCellFormat(recordId, field)

    const verticalAlignment =
      format.verticalAlign === 'top'
        ? 'start'
        : format.verticalAlign === 'center'
          ? 'center'
          : 'end'

    const indentPixels =
      format.indentLevel * 16

    return {
      fontFamily: format.fontFamily,
      fontSize: `${format.fontSize}px`,
      fontWeight: format.bold ? 900 : 400,
      fontStyle: format.italic
        ? 'italic'
        : 'normal',
      textDecoration: format.underline
        ? 'underline'
        : 'none',
      color: format.fontColor,
      backgroundColor: format.fillColor,
      textAlign: format.textAlign,
      alignContent: verticalAlignment,
      paddingLeft: `${8 +
        (format.textAlign === 'right'
          ? 0
          : indentPixels)
        }px`,
      paddingRight: `${8 +
        (format.textAlign === 'right'
          ? indentPixels
          : 0)
        }px`,
      whiteSpace: format.wrapText
        ? 'pre-wrap'
        : 'pre',
      overflowWrap: format.wrapText
        ? 'anywhere'
        : 'normal',
      boxShadow: format.bordered
        ? 'inset 0 0 0 2px #0B1F3B'
        : undefined,
    }
  }

  function getRecordValue(
    recordId: string,
    field: CohortPurposeResearchField,
  ): string {
    const record = records.find(
      (item) => item.id === recordId,
    )

    return record?.[field] ?? ''
  }

  function openContextMenu(
    recordId: string | null,
    field: CohortPurposeResearchField | null,
    x: number,
    y: number,
  ): void {
    if (recordId !== null && field !== null) {
      setSelectedCell({
        recordId,
        field,
      })
    }

    setContextMenu({
      recordId,
      field,
      x,
      y,
    })
  }

  function copyContextCell(): void {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined ||
      contextMenu.field === null
    ) {
      return
    }

    const value = getRecordValue(
      contextMenu.recordId,
      contextMenu.field,
    )

    setClipboardText(value)

    if (navigator.clipboard) {
      void navigator.clipboard
        .writeText(value)
        .catch(() => undefined)
    }

    setContextMenu(null)
  }

  function cutContextCell(): void {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined ||
      contextMenu.field === null
    ) {
      return
    }

    const value = getRecordValue(
      contextMenu.recordId,
      contextMenu.field,
    )

    setClipboardText(value)

    if (navigator.clipboard) {
      void navigator.clipboard
        .writeText(value)
        .catch(() => undefined)
    }

    onUpdateRecord(
      contextMenu.recordId,
      contextMenu.field,
      '',
    )

    setContextMenu(null)
  }

  async function pasteContextCell(): Promise<void> {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined ||
      contextMenu.field === null
    ) {
      return
    }

    let valueToPaste = clipboardText

    if (
      valueToPaste === null &&
      navigator.clipboard
    ) {
      try {
        valueToPaste =
          await navigator.clipboard.readText()
      } catch {
        valueToPaste = null
      }
    }

    if (valueToPaste === null) {
      return
    }

    if (
      contextMenu.field === 'memberName' &&
      valueToPaste.length > 0 &&
      !memberNames.includes(valueToPaste)
    ) {
      return
    }

    onUpdateRecord(
      contextMenu.recordId,
      contextMenu.field,
      valueToPaste,
    )

    setContextMenu(null)
  }

  function clearContextCell(): void {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined ||
      contextMenu.field === null
    ) {
      return
    }

    onUpdateRecord(
      contextMenu.recordId,
      contextMenu.field,
      '',
    )

    setContextMenu(null)
  }

  function insertContextRow(): void {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined
    ) {
      return
    }

    setNameSearch('')
    onInsertRecordAfter(contextMenu.recordId)
    setContextMenu(null)
  }

  function deleteContextRow(): void {
    if (
      contextMenu?.recordId === null ||
      contextMenu?.recordId === undefined
    ) {
      return
    }

    const confirmed = window.confirm(
      'Delete this Purpose & Research row? This cannot be undone during the current session.',
    )

    if (!confirmed) {
      setContextMenu(null)
      return
    }

    if (
      selectedCell?.recordId ===
      contextMenu.recordId
    ) {
      setSelectedCell(null)
    }

    onDeleteRecord(contextMenu.recordId)
    setContextMenu(null)
  }

  function changeContextColumnWidth(): void {
    const contextField = contextMenu?.field

    if (contextField === null || contextField === undefined) {
      return
    }

    const column = purposeResearchColumns.find(
      (item) =>
        item.field === contextField,
    )

    if (!column) {
      return
    }

    const currentWidth =
      columnWidths[column.field] ??
      column.defaultWidth

    const response = window.prompt(
      'Column width in pixels:',
      String(currentWidth),
    )

    if (response === null) {
      setContextMenu(null)
      return
    }

    const nextWidth = Number(response)

    if (
      !Number.isFinite(nextWidth) ||
      nextWidth < 80 ||
      nextWidth > 800
    ) {
      window.alert(
        'Enter a column width between 80 and 800 pixels.',
      )
      return
    }

    setColumnWidths((currentWidths) => ({
      ...currentWidths,
      [column.field]: Math.round(nextWidth),
    }))

    setContextMenu(null)
  }

  function hideContextColumn(): void {
    const contextField = contextMenu?.field

    if (contextField === null || contextField === undefined) {
      return
    }

    setHiddenColumns((currentColumns) =>
      currentColumns.includes(contextField)
        ? currentColumns
        : [...currentColumns, contextField],
    )

    if (
      selectedCell?.field === contextField
    ) {
      setSelectedCell(null)
    }

    setContextMenu(null)
  }

  function unhideAllColumns(): void {
    setHiddenColumns([])
    setContextMenu(null)
  }

  function showFormatControls(): void {
    setContextMenu(null)

    window.requestAnimationFrame(() => {
      document
        .getElementById(
          'purpose-research-format-toolbar',
        )
        ?.focus()
    })
  }

  function getPurposeResearchAutoFitColumnWidth(
    column: PurposeResearchColumnDefinition,
  ): number {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (context === null) {
      return column.defaultWidth
    }

    const minimumWidth =
      column.field === 'memberName'
        ? 140
        : column.field === 'developmentNote'
          ? 130
          : 150

    context.font = '900 12px Arial'

    let measuredWidth =
      context.measureText(column.label).width + 28

    for (const record of visibleRecords) {
      const format = getCellFormat(
        record.id,
        column.field,
      )

      const fontFamily =
        format.fontFamily.includes(' ')
          ? `"${format.fontFamily}"`
          : format.fontFamily

      context.font = `${format.italic ? 'italic ' : ''
        }${format.bold ? '900' : '400'} ${format.fontSize
        }px ${fontFamily}`

      const textLines =
        record[column.field].split(/\r?\n/)

      for (const textLine of textLines) {
        measuredWidth = Math.max(
          measuredWidth,
          context.measureText(
            textLine || ' ',
          ).width + 24,
        )
      }
    }

    return Math.round(
      Math.max(
        minimumWidth,
        Math.min(
          column.defaultWidth,
          measuredWidth,
        ),
      ),
    )
  }

  function autoFitPurposeResearchColumn(
    field: CohortPurposeResearchField,
  ): void {
    const column = visibleColumns.find(
      (visibleColumn) =>
        visibleColumn.field === field,
    )

    if (column === undefined) {
      return
    }

    const nextWidth =
      getPurposeResearchAutoFitColumnWidth(
        column,
      )

    setColumnWidths((currentWidths) => ({
      ...currentWidths,
      [field]: nextWidth,
    }))
  }

  function autoFitAllPurposeResearchColumns(): void {
    const nextWidths: Partial<
      Record<CohortPurposeResearchField, number>
    > = {}

    for (const column of visibleColumns) {
      nextWidths[column.field] =
        getPurposeResearchAutoFitColumnWidth(
          column,
        )
    }

    setColumnWidths((currentWidths) => ({
      ...currentWidths,
      ...nextWidths,
    }))
  }

  function getPurposeResearchAutoFitRowHeight(
    recordId: string,
  ): number {
    const tableFrame =
      purposeResearchTableFrameRef.current

    if (tableFrame === null) {
      return rowHeights[recordId] ?? 110
    }

    const tableRows =
      tableFrame.querySelectorAll<HTMLTableRowElement>(
        'tbody tr[data-record-id]',
      )

    const tableRow = Array.from(tableRows).find(
      (row) =>
        row.dataset.recordId === recordId,
    )

    if (tableRow === undefined) {
      return rowHeights[recordId] ?? 110
    }

    const textareas =
      tableRow.querySelectorAll<HTMLTextAreaElement>(
        '.purpose-research-cell-textarea',
      )

    let nextHeight = 42

    for (const textarea of textareas) {
      const previousHeight =
        textarea.style.height

      textarea.style.height = '0px'

      nextHeight = Math.max(
        nextHeight,
        textarea.scrollHeight + 2,
      )

      textarea.style.height =
        previousHeight
    }

    return Math.min(
      600,
      Math.ceil(nextHeight),
    )
  }

  function autoFitPurposeResearchRow(
    recordId: string,
  ): void {
    const nextHeight =
      getPurposeResearchAutoFitRowHeight(
        recordId,
      )

    setRowHeights((currentHeights) => ({
      ...currentHeights,
      [recordId]: nextHeight,
    }))
  }

  function autoFitAllPurposeResearchRows(): void {
    const nextHeights: Partial<
      Record<string, number>
    > = {}

    for (const record of visibleRecords) {
      nextHeights[record.id] =
        getPurposeResearchAutoFitRowHeight(
          record.id,
        )
    }

    setRowHeights((currentHeights) => ({
      ...currentHeights,
      ...nextHeights,
    }))
  }

  function startColumnResize(
    field: CohortPurposeResearchField,
    startX: number,
    startWidth: number,
  ): void {
    function handlePointerMove(
      event: PointerEvent,
    ): void {
      const nextWidth = Math.max(
        80,
        Math.min(
          800,
          startWidth +
          (event.clientX - startX),
        ),
      )

      setColumnWidths((currentWidths) => ({
        ...currentWidths,
        [field]: nextWidth,
      }))
    }

    function stopPointerResize(): void {
      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      )

      window.removeEventListener(
        'pointerup',
        stopPointerResize,
      )
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    window.addEventListener(
      'pointerup',
      stopPointerResize,
    )
  }

  function startRowResize(
    recordId: string,
    startY: number,
    startHeight: number,
  ): void {
    function handlePointerMove(
      event: PointerEvent,
    ): void {
      const nextHeight = Math.max(
        42,
        Math.min(
          600,
          startHeight +
          (event.clientY - startY),
        ),
      )

      setRowHeights((currentHeights) => ({
        ...currentHeights,
        [recordId]: nextHeight,
      }))
    }

    function stopPointerResize(): void {
      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      )

      window.removeEventListener(
        'pointerup',
        stopPointerResize,
      )
    }

    window.addEventListener(
      'pointermove',
      handlePointerMove,
    )

    window.addEventListener(
      'pointerup',
      stopPointerResize,
    )
  }

  function renderResearchCell(
    record: CohortPurposeResearchRecord,
    column: PurposeResearchColumnDefinition,
    rowHeight: number,
  ): ReactNode {
    const field = column.field

    const cellClassName = [
      'purpose-research-data-cell',
      `purpose-research-column-${field}`,
      field === 'developmentNote'
        ? 'purpose-research-update-cell'
        : '',
      field === 'memberName'
        ? 'purpose-research-name-cell'
        : '',
      field === 'cmoThoughts'
        ? 'purpose-research-cmo-cell'
        : '',
      isCellInSelection(record.id, field)
        ? 'purpose-research-cell-selected'
        : '',
    ]
      .filter((className) => className.length > 0)
      .join(' ')

    const cellFormat = getCellFormat(
      record.id,
      field,
    )

    const nameVerticalAlignment =
      cellFormat.verticalAlign === 'top'
        ? 'flex-start'
        : cellFormat.verticalAlign ===
          'center'
          ? 'center'
          : 'flex-end'

    if (field === 'memberName') {
      return (
        <td
          key={field}
          className={cellClassName}
          data-record-id={record.id}
          data-field={field}
          style={{
            left: `${frozenNameColumnLeft}px`,
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) {
              return
            }

            beginCellRangeSelection(
              record.id,
              field,
            )
          }}
          onContextMenu={(event) => {
            event.preventDefault()

            openContextMenu(
              record.id,
              field,
              event.clientX,
              event.clientY,
            )
          }}
        >
          <div
            className="purpose-research-name-select-shell"
            style={{
              height: `${rowHeight}px`,
              alignItems: nameVerticalAlignment,
              backgroundColor:
                cellFormat.fillColor,
            }}
          >
            <select
              className="purpose-research-name-select"
              style={{
                ...getCellStyle(
                  record.id,
                  field,
                ),
                height: '32px',
                minHeight: '32px',
                backgroundColor: 'transparent',
              }}
              value={record.memberName}
              aria-label="Cohort member name"
              onFocus={() =>
                setSelectedCell({
                  recordId: record.id,
                  field,
                })
              }
              onChange={(event) =>
                onUpdateRecord(
                  record.id,
                  field,
                  event.target.value,
                )
              }
            >
              <option value="">
                Select member
              </option>

              {memberNames.map((name) => (
                <option key={name} value={name}>
                  {name === 'Patrick J. Harris'
                    ? 'Patrick J. Harris (Former)'
                    : name}
                </option>
              ))}
            </select>
          </div>
        </td>
      )
    }

    return (
      <td
        key={field}
        className={cellClassName}
        data-record-id={record.id}
        data-field={field}
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return
          }

          beginCellRangeSelection(
            record.id,
            field,
          )
        }}
        onContextMenu={(event) => {
          event.preventDefault()

          openContextMenu(
            record.id,
            field,
            event.clientX,
            event.clientY,
          )
        }}
      >
        <textarea
          className="purpose-research-cell-textarea"
          rows={4}
          wrap={
            cellFormat.wrapText
              ? 'soft'
              : 'off'
          }
          spellCheck
          style={{
            ...getCellStyle(
              record.id,
              field,
            ),
            height: `${rowHeight}px`,
          }}
          value={record[field]}
          aria-label={`${record.memberName || 'Unassigned record'} ${column.label}`}
          onFocus={() =>
            setSelectedCell({
              recordId: record.id,
              field,
            })
          }
          onChange={(event) =>
            onUpdateRecord(
              record.id,
              field,
              event.target.value,
            )
          }
        />
      </td>
    )
  }

  const contextHasCell =
    contextMenu?.recordId !== null &&
    contextMenu?.recordId !== undefined &&
    contextMenu.field !== null

  const contextHasRow =
    contextMenu?.recordId !== null &&
    contextMenu?.recordId !== undefined

  const contextHasColumn =
    contextMenu?.field !== null &&
    contextMenu?.field !== undefined

  return (
    <section
      className="page-shell"
      onClick={() => setContextMenu(null)}
    >
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Purpose &amp; Research</h1>
      </header>

      <section
        className={`purpose-research-intro${isDevelopmentWorkspaceExpanded
          ? ''
          : ' purpose-research-intro-collapsed'
          }`}
        aria-labelledby="purpose-research-workspace-title"
      >
        <div className="purpose-research-intro-heading">
          <div className="purpose-research-intro-title-group">
            <button
              type="button"
              className="purpose-research-intro-toggle"
              aria-expanded={
                isDevelopmentWorkspaceExpanded
              }
              aria-controls="purpose-research-workspace-content"
              title={
                isDevelopmentWorkspaceExpanded
                  ? 'Collapse Developmental Workspace'
                  : 'Expand Developmental Workspace'
              }
              onClick={() =>
                setIsDevelopmentWorkspaceExpanded(
                  (currentValue) =>
                    !currentValue,
                )
              }
            >
              {isDevelopmentWorkspaceExpanded
                ? '−'
                : '+'}
            </button>

            <h2 id="purpose-research-workspace-title">
              Purpose &amp; Research Developmental Workspace
            </h2>
          </div>
        </div>

        {isDevelopmentWorkspaceExpanded && (
          <div id="purpose-research-workspace-content">
            <p>
              Provides a shared workspace for cohort members to
              record and refine dissertation purpose statements
              and research questions as their studies develop.
            </p>

            <ul>
              <li>
                Capture evolving dissertation ideas, purpose
                statements, and multiple research questions.
              </li>
              <li>
                Use this page as a developmental workspace rather
                than a final or formally approved dissertation
                record.
              </li>
              <li>
                Retain Dr. CMO&apos;s thoughts and feedback alongside
                evolving study ideas.
              </li>
              <li>
                Track changes in dissertation direction and prepare
                for conversations about narrowing or strengthening
                the study.
              </li>
            </ul>
          </div>
        )}
      </section>

      <div className="purpose-research-toolbar">
        <label className="purpose-research-search">
          <span>Name Search</span>

          <input
            type="text"
            list="purpose-research-name-search-options"
            value={nameSearch}
            placeholder="Start typing a cohort member name"
            onChange={(event) =>
              setNameSearch(event.target.value)
            }
          />
        </label>

        <button
          type="button"
          className="purpose-research-add-button"
          onClick={() => {
            setNameSearch('')
            onAddRecord()
          }}
        >
          <span aria-hidden="true">+</span>
          Add Development Update
        </button>
      </div>

      <datalist id="purpose-research-name-search-options">
        {memberNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <section
        className="purpose-research-table-panel"
        aria-labelledby="purpose-research-table-title"
      >
        <header className="purpose-research-table-heading">
          <div>
            <h2 id="purpose-research-table-title">
              Dissertation Development History
            </h2>

            <p>
              Add a new entry when a purpose statement,
              research question, study direction, or mentor
              recommendation changes.
            </p>
          </div>
        </header>

        <div
          id="purpose-research-format-toolbar"
          className="purpose-research-format-toolbar"
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
        >
          <select
            className="purpose-research-font-family"
            value={selectedFormat.fontFamily}
            disabled={selectedCell === null}
            aria-label="Font"
            title="Font"
            onChange={(event) =>
              updateSelectedCellFormat({
                fontFamily: event.target.value,
              })
            }
          >
            {purposeResearchFontOptions.map(
              (fontFamily) => (
                <option
                  key={fontFamily}
                  value={fontFamily}
                >
                  {fontFamily}
                </option>
              ),
            )}
          </select>

          <select
            className="purpose-research-font-size"
            value={selectedFormat.fontSize}
            disabled={selectedCell === null}
            aria-label="Font Size"
            title="Font Size"
            onChange={(event) =>
              updateSelectedCellFormat({
                fontSize: Number(
                  event.target.value,
                ),
              })
            }
          >
            {purposeResearchFontSizeOptions.map(
              (fontSize) => (
                <option
                  key={fontSize}
                  value={fontSize}
                >
                  {fontSize}
                </option>
              ),
            )}
          </select>

          <span
            className="purpose-research-toolbar-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className={`purpose-research-text-button${selectedFormat.bold
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Bold"
            title="Bold"
            onClick={() =>
              updateSelectedCellFormat({
                bold: !selectedFormat.bold,
              })
            }
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={`purpose-research-text-button${selectedFormat.italic
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Italic"
            title="Italic"
            onClick={() =>
              updateSelectedCellFormat({
                italic: !selectedFormat.italic,
              })
            }
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={`purpose-research-text-button${selectedFormat.underline
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Underline"
            title="Underline"
            onClick={() =>
              updateSelectedCellFormat({
                underline:
                  !selectedFormat.underline,
              })
            }
          >
            <u>U</u>
          </button>

          <label
            className="purpose-research-color-control purpose-research-font-color-control"
            title="Font Color"
          >
            <span
              className="purpose-research-font-color-icon"
              aria-hidden="true"
            >
              <span className="purpose-research-font-color-letter">
                A
              </span>

              <span
                className="purpose-research-font-color-underline"
                style={{
                  backgroundColor:
                    selectedFormat.fontColor,
                }}
              />
            </span>

            <span
              className="purpose-research-dropdown-caret"
              aria-hidden="true"
            >
              ▾
            </span>

            <input
              className="purpose-research-color-input"
              type="color"
              disabled={selectedCell === null}
              value={selectedFormat.fontColor}
              aria-label="Font Color"
              onChange={(event) =>
                updateSelectedCellFormat({
                  fontColor:
                    event.target.value,
                })
              }
            />
          </label>

          <label
            className="purpose-research-color-control purpose-research-fill-color-control"
            title="Fill Color"
          >
            <span
              className="purpose-research-fill-color-swatch"
              style={{
                backgroundColor:
                  selectedFormat.fillColor ===
                    'transparent'
                    ? '#FFFF00'
                    : selectedFormat.fillColor,
              }}
              aria-hidden="true"
            />

            <span
              className="purpose-research-dropdown-caret"
              aria-hidden="true"
            >
              ▾
            </span>

            <input
              className="purpose-research-color-input"
              type="color"
              disabled={selectedCell === null}
              value={
                selectedFormat.fillColor ===
                  'transparent'
                  ? '#ffff00'
                  : selectedFormat.fillColor
              }
              aria-label="Fill Color"
              onChange={(event) =>
                updateSelectedCellFormat({
                  fillColor:
                    event.target.value,
                })
              }
            />
          </label>

          <button
            type="button"
            className={`purpose-research-icon-button${selectedFormat.bordered
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Cell Border"
            title="Cell Border"
            onClick={() =>
              updateSelectedCellFormat({
                bordered:
                  !selectedFormat.bordered,
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="5"
                width="14"
                height="14"
                rx="1"
              />
            </svg>
          </button>

          <span
            className="purpose-research-toolbar-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.verticalAlign === 'top'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Top Align"
            title="Top Align"
            onClick={() =>
              updateSelectedCellFormat({
                verticalAlign: 'top',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M4 5H20" />
              <path d="M6 9H18" />
              <path d="M8 13H16" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.verticalAlign ===
              'center'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Middle Align"
            title="Middle Align"
            onClick={() =>
              updateSelectedCellFormat({
                verticalAlign: 'center',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M8 8H16" />
              <path d="M6 12H18" />
              <path d="M8 16H16" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.verticalAlign ===
              'bottom'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Bottom Align"
            title="Bottom Align"
            onClick={() =>
              updateSelectedCellFormat({
                verticalAlign: 'bottom',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M8 11H16" />
              <path d="M6 15H18" />
              <path d="M4 19H20" />
            </svg>
          </button>

          <span
            className="purpose-research-toolbar-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.textAlign === 'left'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Align Left"
            title="Align Left"
            onClick={() =>
              updateSelectedCellFormat({
                textAlign: 'left',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M4 5H20" />
              <path d="M4 9H15" />
              <path d="M4 13H20" />
              <path d="M4 17H13" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.textAlign ===
              'center'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Center"
            title="Center"
            onClick={() =>
              updateSelectedCellFormat({
                textAlign: 'center',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M4 5H20" />
              <path d="M7 9H17" />
              <path d="M4 13H20" />
              <path d="M8 17H16" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.textAlign === 'right'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Align Right"
            title="Align Right"
            onClick={() =>
              updateSelectedCellFormat({
                textAlign: 'right',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M4 5H20" />
              <path d="M9 9H20" />
              <path d="M4 13H20" />
              <path d="M11 17H20" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-alignment-button${selectedFormat.textAlign ===
              'justify'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Justify"
            title="Justify"
            onClick={() =>
              updateSelectedCellFormat({
                textAlign: 'justify',
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M4 5H20" />
              <path d="M4 9H20" />
              <path d="M4 13H20" />
              <path d="M4 17H20" />
            </svg>
          </button>

          <span
            className="purpose-research-toolbar-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className={`purpose-research-icon-button${selectedFormat.listStyle ===
              'bulleted'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={!hasSelectedTextCells}
            aria-label="Bullets"
            title="Bullets"
            onClick={() =>
              toggleSelectedCellListStyle(
                'bulleted',
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon purpose-research-list-icon"
              aria-hidden="true"
            >
              <circle
                cx="5"
                cy="6"
                r="1.4"
                fill="currentColor"
                stroke="none"
              />
              <circle
                cx="5"
                cy="12"
                r="1.4"
                fill="currentColor"
                stroke="none"
              />
              <circle
                cx="5"
                cy="18"
                r="1.4"
                fill="currentColor"
                stroke="none"
              />
              <path d="M9 6H20" />
              <path d="M9 12H20" />
              <path d="M9 18H20" />
            </svg>
          </button>

          <button
            type="button"
            className={`purpose-research-icon-button${selectedFormat.listStyle ===
              'numbered'
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={!hasSelectedTextCells}
            aria-label="Numbering"
            title="Numbering"
            onClick={() =>
              toggleSelectedCellListStyle(
                'numbered',
              )
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon purpose-research-list-icon"
              aria-hidden="true"
            >
              <text
                x="4.8"
                y="7.5"
                fill="currentColor"
                stroke="none"
                fontSize="6"
                fontWeight="700"
                textAnchor="middle"
              >
                1
              </text>
              <text
                x="4.8"
                y="13.5"
                fill="currentColor"
                stroke="none"
                fontSize="6"
                fontWeight="700"
                textAnchor="middle"
              >
                2
              </text>
              <text
                x="4.8"
                y="19.5"
                fill="currentColor"
                stroke="none"
                fontSize="6"
                fontWeight="700"
                textAnchor="middle"
              >
                3
              </text>
              <path d="M9 6H20" />
              <path d="M9 12H20" />
              <path d="M9 18H20" />
            </svg>
          </button>

          <button
            type="button"
            className="purpose-research-icon-button purpose-research-clear-format-button"
            disabled={selectedCell === null}
            aria-label="Clear Formatting"
            title="Clear Formatting"
            onClick={clearSelectedCellFormatting}
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-clear-format-icon"
              aria-hidden="true"
            >
              <path
                d="M6.3 14.9L13.9 7.3L19.1 12.5L11.5 20.1H7.8L4.4 16.7Z"
                fill="#22d3ee"
                stroke="#075985"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M11.5 20.1L8.3 16.9L12.4 12.8L15.6 16Z"
                fill="#f8fafc"
                stroke="#075985"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path
                d="M4 21H20"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="purpose-research-icon-button"
            disabled={
              selectedCell === null ||
              selectedFormat.indentLevel === 0
            }
            aria-label="Decrease Indent"
            title="Decrease Indent"
            onClick={() =>
              updateSelectedCellFormat({
                indentLevel: Math.max(
                  0,
                  selectedFormat.indentLevel - 1,
                ),
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M10 5H20" />
              <path d="M10 9H20" />
              <path d="M10 13H20" />
              <path d="M10 17H20" />
              <path d="M7 9L3 12L7 15" />
            </svg>
          </button>

          <button
            type="button"
            className="purpose-research-icon-button"
            disabled={
              selectedCell === null ||
              selectedFormat.indentLevel >= 8
            }
            aria-label="Increase Indent"
            title="Increase Indent"
            onClick={() =>
              updateSelectedCellFormat({
                indentLevel: Math.min(
                  8,
                  selectedFormat.indentLevel + 1,
                ),
              })
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="purpose-research-toolbar-icon"
              aria-hidden="true"
            >
              <path d="M10 5H20" />
              <path d="M10 9H20" />
              <path d="M10 13H20" />
              <path d="M10 17H20" />
              <path d="M3 9L7 12L3 15" />
            </svg>
          </button>

          <span
            className="purpose-research-toolbar-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className="purpose-research-icon-button purpose-research-merge-button"
            disabled
            aria-label="Merge & Center"
            title="Merge & Center"
          >
            <svg
              viewBox="0 0 30 26"
              className="purpose-research-merge-icon"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="24"
                height="20"
                rx="1"
                className="purpose-research-merge-grid-background"
              />

              <path
                d="M11 3V23M19 3V23M3 9H27M3 17H27"
                className="purpose-research-merge-grid-lines"
              />

              <rect
                x="6"
                y="8"
                width="18"
                height="10"
                rx="1"
                className="purpose-research-merge-center-cell"
              />

              <path
                d="M8 13H13M10.8 10.8L13 13L10.8 15.2"
                className="purpose-research-merge-arrow"
              />

              <path
                d="M22 13H17M19.2 10.8L17 13L19.2 15.2"
                className="purpose-research-merge-arrow"
              />
            </svg>

            <span className="purpose-research-control-label">
              Merge &amp; Center
            </span>

            <span
              className="purpose-research-split-caret"
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          <button
            type="button"
            className={`purpose-research-wrap-button${selectedFormat.wrapText
              ? ' purpose-research-format-active'
              : ''
              }`}
            disabled={selectedCell === null}
            aria-label="Wrap Text"
            title="Wrap Text"
            onClick={() =>
              updateSelectedCellFormat({
                wrapText:
                  !selectedFormat.wrapText,
              })
            }
          >
            <svg
              viewBox="0 0 30 26"
              className="purpose-research-wrap-icon"
              aria-hidden="true"
            >
              <text
                x="2"
                y="10"
                fill="currentColor"
                fontFamily="Arial, sans-serif"
                fontSize="9"
                fontWeight="700"
              >
                a
              </text>

              <text
                x="9"
                y="10"
                fill="currentColor"
                fontFamily="Arial, sans-serif"
                fontSize="9"
                fontWeight="700"
              >
                b
              </text>

              <text
                x="2"
                y="22"
                fill="currentColor"
                fontFamily="Arial, sans-serif"
                fontSize="9"
                fontWeight="700"
              >
                c
              </text>

              <path
                d="M17 10
                   C22 10 24 12 24 15
                   C24 18 21 19 17 19
                   H10"
                className="purpose-research-wrap-arrow"
              />

              <path
                d="M13 16L10 19L13 22"
                className="purpose-research-wrap-arrow"
              />
            </svg>

            <span className="purpose-research-control-label">
              Wrap Text
            </span>

            <span
              className="purpose-research-split-caret"
              aria-hidden="true"
            >
              ▾
            </span>
          </button>

          <div
            className="purpose-research-entry-count"
            aria-label={`Total Entries ${records.length}`}
            title="Total Entries"
          >
            <span>Total Entries</span>
            <strong>{records.length}</strong>

            {normalizedSearch && (
              <small>
                Showing {visibleRecords.length}
              </small>
            )}
          </div>
        </div>

        <div
          ref={purposeResearchTableFrameRef}
          tabIndex={0}
          aria-label="Purpose and Research spreadsheet"
          className={`purpose-research-table-frame${isRangeSelecting
            ? ' purpose-research-range-selecting'
            : ''
            }`}
          onPointerMove={(event) => {
            if (
              !isRangeSelecting ||
              (event.buttons & 1) === 0
            ) {
              return
            }

            const targetElement =
              document.elementFromPoint(
                event.clientX,
                event.clientY,
              )

            const tableCell =
              targetElement?.closest(
                'td[data-record-id][data-field]',
              )

            if (
              !(tableCell instanceof HTMLTableCellElement)
            ) {
              return
            }

            const recordId =
              tableCell.dataset.recordId

            const fieldValue =
              tableCell.dataset.field

            if (
              !recordId ||
              !fieldValue ||
              !isPurposeResearchField(fieldValue)
            ) {
              return
            }

            event.preventDefault()

            extendCellRangeSelection(
              recordId,
              fieldValue,
            )
          }}
          onKeyDownCapture={(event) => {
            const eventTarget = event.target

            const isCellEditor =
              eventTarget instanceof HTMLTextAreaElement ||
              eventTarget instanceof HTMLSelectElement

            if (isCellEditor) {
              if (
                event.key === 'Tab' &&
                !event.altKey &&
                !event.ctrlKey &&
                !event.metaKey
              ) {
                event.preventDefault()

                eventTarget.blur()

                purposeResearchTableFrameRef.current?.focus({
                  preventScroll: true,
                })
              }

              return
            }

            if (
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            ) {
              return
            }

            switch (event.key) {
              case 'ArrowLeft':
                event.preventDefault()
                movePurposeResearchSelection(
                  0,
                  -1,
                )
                break

              case 'ArrowRight':
                event.preventDefault()
                movePurposeResearchSelection(
                  0,
                  1,
                )
                break

              case 'ArrowUp':
                event.preventDefault()
                movePurposeResearchSelection(
                  -1,
                  0,
                )
                break

              case 'ArrowDown':
                event.preventDefault()
                movePurposeResearchSelection(
                  1,
                  0,
                )
                break

              case 'Home':
                event.preventDefault()
                movePurposeResearchSelectionHome()
                break

              default:
                break
            }
          }}
          onScroll={() => setContextMenu(null)}
        >
          <table
            className="purpose-research-table"
            style={{
              width: `${tableWidth}px`,
            }}
          >
            <colgroup>
              <col style={{ width: '46px' }} />

              {visibleColumns.map((column) => (
                <col
                  key={column.field}
                  style={{
                    width: `${columnWidths[column.field] ??
                      column.defaultWidth
                      }px`,
                  }}
                />
              ))}
            </colgroup>

            <thead>
              <tr>
                <th
                  className={`purpose-research-row-number-header${isEntirePurposeResearchTableSelected()
                    ? ' purpose-research-row-number-header-selected'
                    : ''
                    }`}
                >
                  <button
                    type="button"
                    className="purpose-research-select-all-button"
                    aria-label="Select all Purpose and Research cells"
                    title="Select all cells"
                    onClick={(event) => {
                      event.stopPropagation()
                      selectEntirePurposeResearchTable()
                    }}
                  />
                </th>

                {visibleColumns.map((column) => {
                  const columnWidth =
                    columnWidths[column.field] ??
                    column.defaultWidth

                  return (
                    <th
                      key={column.field}
                      className={`purpose-research-column-header purpose-research-column-${column.field}`}
                      style={
                        column.field === 'memberName'
                          ? {
                            left: `${frozenNameColumnLeft}px`,
                          }
                          : undefined
                      }
                      onContextMenu={(event) => {
                        event.preventDefault()

                        openContextMenu(
                          null,
                          column.field,
                          event.clientX,
                          event.clientY,
                        )
                      }}
                    >
                      <span>
                        {column.label}
                      </span>

                      <span
                        className="purpose-research-column-resize-handle"
                        title="Drag to resize column. Double-click to AutoFit."
                        onDoubleClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()

                          if (
                            isEntirePurposeResearchTableSelected()
                          ) {
                            autoFitAllPurposeResearchColumns()
                            return
                          }

                          autoFitPurposeResearchColumn(
                            column.field,
                          )
                        }}
                        onPointerDown={(event) => {
                          if (event.detail > 1) {
                            return
                          }

                          event.preventDefault()
                          event.stopPropagation()

                          startColumnResize(
                            column.field,
                            event.clientX,
                            columnWidth,
                          )
                        }}
                      />
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {visibleRecords.length === 0 ? (
                <tr>
                  <td
                    className="purpose-research-empty-state"
                    colSpan={
                      visibleColumns.length + 1
                    }
                  >
                    {normalizedSearch
                      ? 'No development entries match the current name search.'
                      : 'No development entries have been added yet. Select Add Development Update to begin.'}
                  </td>
                </tr>
              ) : (
                visibleRecords.map((record) => {
                  const rowHeight =
                    rowHeights[record.id] ?? 110

                  const rowNumber =
                    records.findIndex(
                      (item) =>
                        item.id === record.id,
                    ) + 1

                  return (
                    <tr
                      key={record.id}
                      data-record-id={record.id}
                    >
                      <th
                        scope="row"
                        className="purpose-research-row-number-cell"
                        style={{
                          height: `${rowHeight}px`,
                        }}
                        onContextMenu={(event) => {
                          event.preventDefault()

                          openContextMenu(
                            record.id,
                            null,
                            event.clientX,
                            event.clientY,
                          )
                        }}
                      >
                        {rowNumber}

                        <span
                          className="purpose-research-row-resize-handle"
                          title="Drag to resize row. Double-click to AutoFit."
                          onDoubleClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()

                            if (
                              isEntirePurposeResearchTableSelected()
                            ) {
                              autoFitAllPurposeResearchRows()
                              return
                            }

                            autoFitPurposeResearchRow(
                              record.id,
                            )
                          }}
                          onPointerDown={(event) => {
                            if (event.detail > 1) {
                              return
                            }

                            event.preventDefault()
                            event.stopPropagation()

                            startRowResize(
                              record.id,
                              event.clientY,
                              rowHeight,
                            )
                          }}
                        />
                      </th>

                      {visibleColumns.map(
                        (column) =>
                          renderResearchCell(
                            record,
                            column,
                            rowHeight,
                          ),
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="purpose-research-history-note">
        Create a new development entry when the study changes
        substantially. This preserves earlier thinking instead of
        overwriting the dissertation&apos;s developmental history.
      </p>

      {contextMenu && (
        <div
          className="purpose-research-context-menu"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          role="menu"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <button
            type="button"
            disabled={!contextHasCell}
            onClick={cutContextCell}
          >
            Cut
          </button>

          <button
            type="button"
            disabled={!contextHasCell}
            onClick={copyContextCell}
          >
            Copy
          </button>

          <button
            type="button"
            disabled={!contextHasCell}
            onClick={() => {
              void pasteContextCell()
            }}
          >
            Paste
          </button>

          <span />

          <button
            type="button"
            disabled={!contextHasRow}
            onClick={insertContextRow}
          >
            Insert
          </button>

          <button
            type="button"
            disabled={!contextHasRow}
            onClick={deleteContextRow}
          >
            Delete
          </button>

          <button
            type="button"
            disabled={!contextHasCell}
            onClick={clearContextCell}
          >
            Clear Contents
          </button>

          <span />

          <button
            type="button"
            disabled={!contextHasCell}
            onClick={showFormatControls}
          >
            Format Cells
          </button>

          <button
            type="button"
            disabled={!contextHasColumn}
            onClick={changeContextColumnWidth}
          >
            Column Width
          </button>

          <button
            type="button"
            disabled={!contextHasColumn}
            onClick={hideContextColumn}
          >
            Hide
          </button>

          <button
            type="button"
            disabled={
              hiddenColumns.length === 0
            }
            onClick={unhideAllColumns}
          >
            Unhide
          </button>
        </div>
      )}
    </section>
  )
}

function CohortTlsiDatesPage() {
  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort TLSi Dates</h1>
      </header>

      <section className="tlsi-dates-panel">
        <div className="tlsi-webinar-row">
          <strong>
            Webinar: Aug 27 @ 6:00 PT
          </strong>

          <a
            href="https://umassglobal.zoom.us/my/cvgguzman"
            target="_blank"
            rel="noreferrer"
          >
            Zoom: https://umassglobal.zoom.us/my/cvgguzman
          </a>
        </div>

        <div className="tlsi-table-frame">
          <table className="tlsi-dates-table">
            <thead>
              <tr>
                <th>Date / Window</th>
                <th>TLSi Activity</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Aug. 27</td>
                <td>
                  Student complete survey information and take survey
                </td>
              </tr>

              <tr className="tlsi-subrow">
                <td />
                <td>
                  Acknowledge personal pass code
                </td>
              </tr>

              <tr>
                <td>Aug. 27 – Sept. 10</td>
                <td>
                  Confirm respondents’ participation and communicate
                </td>
              </tr>

              <tr className="tlsi-subrow">
                <td />
                <td>
                  URL and pass code to participants
                </td>
              </tr>

              <tr className="tlsi-subrow">
                <td />
                <td>
                  Respondents complete on-line TLSi survey
                </td>
              </tr>

              <tr>
                <td>Sept. 3</td>
                <td>
                  Response counts sent to students
                </td>
              </tr>

              <tr className="tlsi-subrow">
                <td />
                <td>
                  Students to chase more results, if needed
                </td>
              </tr>

              <tr>
                <td>Sept. 11</td>
                <td>
                  TLSi data downloaded/reports are prepared
                </td>
              </tr>

              <tr>
                <td>Sept. 12</td>
                <td>
                  TLSi reports emailed to Cohort Mentors
                </td>
              </tr>

              <tr>
                <td>1-2 days before cohort meeting</td>
                <td>
                  TLSi reports emailed to students
                </td>
              </tr>

              <tr className="tlsi-subrow">
                <td />
                <td>
                  This is often the night before - don't fret, we will get there
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

function CohortBookListPage() {
  const [books, setBooks] =
    useState<readonly CohortBookRecord[]>(
      () => readStoredCohortBookList(),
    )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    window.localStorage.setItem(
      COHORT_BOOK_LIST_STORAGE_KEY,
      JSON.stringify(books),
    )
  }, [books])

  const normalizedSearchTerm =
    searchTerm.trim().toLowerCase()

  const visibleBooks =
    normalizedSearchTerm.length === 0
      ? books
      : books.filter((book) =>
        [
          book.course,
          book.school,
          book.courseTitle,
          book.studentNotes,
          book.isbn,
          book.author,
          book.productTitle,
          book.edition,
          book.publisher,
          book.year,
        ].some((value) =>
          value
            .toLowerCase()
            .includes(normalizedSearchTerm),
        ),
      )

  function addBook(): void {
    const newBook: CohortBookRecord = {
      id: `custom-book-${Date.now()}`,
      course: '',
      school: 'SOE',
      courseTitle: '',
      studentNotes: '',
      isbn: '',
      author: '',
      productTitle: '',
      edition: '',
      publisher: '',
      year: '',
    }

    setBooks((currentBooks) => [
      newBook,
      ...currentBooks,
    ])
    setSearchTerm('')
  }

  function updateBook(
    bookId: string,
    field: CohortBookField,
    value: string,
  ): void {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === bookId
          ? {
            ...book,
            [field]: value,
          }
          : book,
      ),
    )
  }

  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Book List</h1>
      </header>

      <section className="book-list-source-panel">
        <div className="book-list-source-heading">
          <div>
            <h2>Official Master Book List</h2>

            <p>
              The table below begins with the complete 2025 Master Book List.
              Changes made on this page are saved locally in this app and do
              not change the official university master list.
            </p>

            <ol className="book-list-source-steps">
              <li>
                Open the Student Portal:
                {' '}
                <a
                  href="https://umassglobal.sharepoint.com/sites/Student"
                  target="_blank"
                  rel="noreferrer"
                >
                  Student Portal
                </a>
              </li>

              <li>
                Select
                {' '}
                <strong>Schools &gt; Ed.D.</strong>
                {' '}
                or open the
                {' '}
                <a
                  href="https://umassglobal.sharepoint.com/sites/EDD"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ed.D. site
                </a>
                .
              </li>

              <li>
                Click
                {' '}
                <strong>
                  Master Book List (All Terms)
                </strong>
                .
              </li>

              <li>
                Open
                {' '}
                <strong>
                  2025 Master Book List
                </strong>
                .
              </li>
            </ol>

            <p className="book-list-source-folder">
              Master Book List upload folder:
              {' '}
              <a
                href="https://drive.google.com/drive/folders/1tSpSd0v50XE4mmo1qe-mSfrb5D-ldLgp"
                target="_blank"
                rel="noreferrer"
              >
                Google Drive Folder
              </a>
            </p>
          </div>

          <a
            className="book-list-source-button"
            href="https://docs.google.com/spreadsheets/d/1ZVlstI88IkG0omggdg3u86O3m2NAabhj/edit?gid=985629361#gid=985629361"
            target="_blank"
            rel="noreferrer"
          >
            Open Master Book List
          </a>
        </div>
      </section>

      <div className="book-list-toolbar">
        <label className="book-list-search">
          <span>Search Book List</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search course, book title, author, ISBN, publisher, year..."
          />
        </label>

        <button
          type="button"
          className="book-list-add-button"
          onClick={addBook}
        >
          <span aria-hidden="true">+</span>
          Add Book
        </button>

        <button
          type="button"
          className="book-list-clear-search-button"
          disabled={searchTerm.length === 0}
          onClick={() => setSearchTerm('')}
        >
          Clear Search
        </button>

        <div className="book-list-count-card">
          <span>Total Books</span>
          <strong>{books.length}</strong>
        </div>

        <div className="book-list-count-card book-list-visible-count">
          <span>Visible</span>
          <strong>{visibleBooks.length}</strong>
        </div>
      </div>

      <section className="book-list-table-panel">
        <div className="book-list-table-heading">
          <div>
            <h2>2025 Master Book List</h2>
            <p>
              Edit cells directly. Changes save automatically in this browser.
            </p>
          </div>
        </div>

        <div className="book-list-table-frame">
          <table className="book-list-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>School</th>
                <th>Course Title</th>
                <th>Student Notes</th>
                <th>ISBN</th>
                <th>Author</th>
                <th>Product Title</th>
                <th>Edition</th>
                <th>Publisher</th>
                <th>Year</th>
              </tr>
            </thead>

            <tbody>
              {visibleBooks.map((book) => (
                <tr key={book.id}>
                  {(
                    [
                      ['course', 'Course'],
                      ['school', 'School'],
                      ['courseTitle', 'Course Title'],
                      ['studentNotes', 'Student Notes'],
                      ['isbn', 'ISBN'],
                      ['author', 'Author'],
                      ['productTitle', 'Product Title'],
                      ['edition', 'Edition'],
                      ['publisher', 'Publisher'],
                      ['year', 'Year'],
                    ] as const
                  ).map(([field, label]) => (
                    <td key={field}>
                      {field === 'productTitle' ? (
                        <textarea
                          className="book-list-cell-input book-list-product-title-input"
                          value={book[field]}
                          title={book[field]}
                          aria-label={`${label} for ${book.productTitle || book.course || 'book'}`}
                          rows={1}
                          onChange={(event) =>
                            updateBook(
                              book.id,
                              field,
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <input
                          type="text"
                          className="book-list-cell-input"
                          value={book[field]}
                          title={book[field]}
                          aria-label={`${label} for ${book.productTitle || book.course || 'book'}`}
                          onChange={(event) =>
                            updateBook(
                              book.id,
                              field,
                              event.target.value,
                            )
                          }
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {visibleBooks.length === 0 && (
                <tr>
                  <td
                    className="book-list-empty-state"
                    colSpan={10}
                  >
                    No books match the current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
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

  const [cohortDataSurvey, setCohortDataSurvey] =
    useState<CohortDataSurveyState>(
      () => readStoredCohortDataSurvey(),
    )

  const [purposeResearchRecords, setPurposeResearchRecords] =
    useState<readonly CohortPurposeResearchRecord[]>(
      () => readStoredPurposeResearchRecords(),
    )

  useEffect(() => {
    const getNavigableTableCell = (
      target: EventTarget | null,
    ): HTMLTableCellElement | null => {
      if (!(target instanceof Element)) {
        return null
      }

      const cell = target.closest('td')

      if (!(cell instanceof HTMLTableCellElement)) {
        return null
      }

      if (
        cell.closest('.purpose-research-table') !== null
      ) {
        return null
      }

      return cell
    }

    const isCellEditor = (
      target: EventTarget | null,
    ): boolean => {
      if (
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return true
      }

      if (!(target instanceof HTMLInputElement)) {
        return false
      }

      return ![
        'button',
        'checkbox',
        'file',
        'hidden',
        'radio',
        'reset',
        'submit',
      ].includes(target.type)
    }

    const isInteractiveTarget = (
      target: EventTarget | null,
    ): boolean => {
      if (!(target instanceof Element)) {
        return false
      }

      return target.closest(
        'button, a[href], input, textarea, select, [contenteditable="true"]',
      ) !== null
    }

    const focusTableCell = (
      cell: HTMLTableCellElement,
    ): void => {
      cell.tabIndex = -1
      cell.focus({ preventScroll: true })
      cell.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      })
    }

    const getDestinationCell = (
      sourceCell: HTMLTableCellElement,
      rowOffset: number,
      columnOffset: number,
    ): HTMLTableCellElement | null => {
      const sourceRow = sourceCell.parentElement

      if (!(sourceRow instanceof HTMLTableRowElement)) {
        return null
      }

      const tableSection = sourceRow.parentElement

      if (
        !(
          tableSection instanceof
          HTMLTableSectionElement
        ) ||
        tableSection.tagName !== 'TBODY'
      ) {
        return null
      }

      const rows = Array.from(tableSection.rows)
      const sourceRowIndex =
        rows.indexOf(sourceRow)

      if (sourceRowIndex < 0) {
        return null
      }

      const destinationRow =
        rows[sourceRowIndex + rowOffset]

      if (destinationRow === undefined) {
        return null
      }

      const destinationColumnIndex =
        sourceCell.cellIndex + columnOffset

      if (destinationColumnIndex < 0) {
        return null
      }

      return destinationRow.cells.item(
        destinationColumnIndex,
      )
    }

    const handleTableClick = (
      event: globalThis.MouseEvent,
    ): void => {
      const cell =
        getNavigableTableCell(event.target)

      if (
        cell === null ||
        isInteractiveTarget(event.target)
      ) {
        return
      }

      focusTableCell(cell)
    }

    const handleTableKeyDown = (
      event: globalThis.KeyboardEvent,
    ): void => {
      const sourceCell =
        getNavigableTableCell(event.target)

      if (sourceCell === null) {
        return
      }

      if (isCellEditor(event.target)) {
        if (
          event.key === 'Tab' &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          event.preventDefault()

          if (
            event.target instanceof HTMLElement
          ) {
            event.target.blur()
          }

          focusTableCell(sourceCell)
        }

        return
      }

      if (isInteractiveTarget(event.target)) {
        return
      }

      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return
      }

      let rowOffset = 0
      let columnOffset = 0

      switch (event.key) {
        case 'ArrowLeft':
          columnOffset = -1
          break

        case 'ArrowRight':
          columnOffset = 1
          break

        case 'ArrowUp':
          rowOffset = -1
          break

        case 'ArrowDown':
          rowOffset = 1
          break

        default:
          return
      }

      const destinationCell =
        getDestinationCell(
          sourceCell,
          rowOffset,
          columnOffset,
        )

      if (destinationCell === null) {
        return
      }

      event.preventDefault()
      focusTableCell(destinationCell)
    }

    document.addEventListener(
      'click',
      handleTableClick,
    )

    document.addEventListener(
      'keydown',
      handleTableKeyDown,
    )

    return () => {
      document.removeEventListener(
        'click',
        handleTableClick,
      )

      document.removeEventListener(
        'keydown',
        handleTableKeyDown,
      )
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      DATA_SURVEY_STORAGE_KEY,
      JSON.stringify(cohortDataSurvey),
    )
  }, [cohortDataSurvey])

  useEffect(() => {
    window.localStorage.setItem(
      PURPOSE_RESEARCH_RECORDS_STORAGE_KEY,
      JSON.stringify(purposeResearchRecords),
    )
  }, [purposeResearchRecords])

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

  function updateCohortDataSurvey(
    participantId: string,
    dateId: string,
    mark: CohortDataSurveyMark,
  ): void {
    const surveyKey = getCohortDataSurveyKey(
      participantId,
      dateId,
    )

    setCohortDataSurvey((currentSurvey) => ({
      ...currentSurvey,
      [surveyKey]: mark,
    }))
  }

  function addPurposeResearchRecord(): void {
    setPurposeResearchRecords((currentRecords) => [
      ...currentRecords,
      createEmptyPurposeResearchRecord(),
    ])
  }

  function insertPurposeResearchRecordAfter(
    recordId: string,
  ): void {
    setPurposeResearchRecords((currentRecords) => {
      const recordIndex =
        currentRecords.findIndex(
          (record) => record.id === recordId,
        )

      const newRecord =
        createEmptyPurposeResearchRecord()

      if (recordIndex < 0) {
        return [
          ...currentRecords,
          newRecord,
        ]
      }

      return [
        ...currentRecords.slice(
          0,
          recordIndex + 1,
        ),
        newRecord,
        ...currentRecords.slice(
          recordIndex + 1,
        ),
      ]
    })
  }

  function deletePurposeResearchRecord(
    recordId: string,
  ): void {
    setPurposeResearchRecords((currentRecords) =>
      currentRecords.filter(
        (record) => record.id !== recordId,
      ),
    )
  }

  function updatePurposeResearchRecord(
    recordId: string,
    field: CohortPurposeResearchField,
    value: string,
  ): void {
    setPurposeResearchRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === recordId
          ? {
            ...record,
            [field]: value,
          }
          : record,
      ),
    )
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
                <CohortPurposeResearchPage
                  contacts={contacts}
                  records={purposeResearchRecords}
                  onAddRecord={addPurposeResearchRecord}
                  onInsertRecordAfter={
                    insertPurposeResearchRecordAfter
                  }
                  onDeleteRecord={
                    deletePurposeResearchRecord
                  }
                  onUpdateRecord={
                    updatePurposeResearchRecord
                  }
                />
              }
            />

            <Route
              path="/data-survey"
              element={
                <CohortDataSurveyPage
                  survey={cohortDataSurvey}
                  onUpdateSurvey={
                    updateCohortDataSurvey
                  }
                />
              }
            />

            <Route
              path="/tlsi-dates"
              element={<CohortTlsiDatesPage />}
            />

            <Route
              path="/book-list"
              element={<CohortBookListPage />}
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