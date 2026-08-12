import {
  useEffect,
  useState,
  type CSSProperties,
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
          className={`dashboard-info-card birthday-card${
            nextBirthdayDashboard?.isToday ? ' birthday-card-today' : ''
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

function CohortContactPage() {
  return (
    <section className="page-shell">
      <header className="dashboard-page-heading cohort-contacts-page-heading">
        <h1>Beta Nu Cohort Contacts</h1>
      </header>
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
              element={<CohortContactPage />}
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