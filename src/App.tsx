import { useState, type CSSProperties, type ReactNode } from 'react'
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

type AppBackgroundStyle = CSSProperties & {
  '--bnf-background-image': string
}

const navigationItems: readonly NavigationItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Cohort Contact', path: '/cohort-contact' },
  { label: 'Cohort Dates & Roles', path: '/cohort-dates-roles' },
  { label: 'Attendance', path: '/attendance' },
  { label: 'Norms', path: '/norms' },
  { label: 'Values and Vision', path: '/values-vision' },
  { label: 'Purpose & Research ?', path: '/purpose-research' },
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

      <div className="dashboard-summary-grid">
        <article className="summary-card">
          <span className="summary-card-number">01</span>
          <h2>Cohort Directory</h2>
          <p>
            Centralized roster, contact information, dissertation interests,
            and cohort member details.
          </p>
        </article>

        <article className="summary-card">
          <span className="summary-card-number">02</span>
          <h2>Meetings & Roles</h2>
          <p>
            Cohort meeting dates, rotating responsibilities, facilitators,
            recorders, and assigned roles.
          </p>
        </article>

        <article className="summary-card">
          <span className="summary-card-number">03</span>
          <h2>Attendance</h2>
          <p>
            Central location for cohort meeting attendance and participation
            tracking.
          </p>
        </article>

        <article className="summary-card">
          <span className="summary-card-number">19</span>
          <h2>Course Pages</h2>
          <p>
            Individual course workspaces organized under one expandable
            Courses navigation section.
          </p>
        </article>
      </div>

      <div className="content-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-eyebrow">Foundation</p>
            <h2>Cohort Hub Structure</h2>
          </div>
        </div>

        <div className="dashboard-intro">
          <p>
            The Beta Nu Fall Cohort Hub provides one organized location for
            cohort information, meetings, attendance, research development,
            course tracking, and shared resources.
          </p>
          <p>
            Individual page content will be migrated and redesigned from the
            existing cohort Google Sheets as each section is developed.
          </p>
        </div>
      </div>
    </section>
  )
}

function CohortContactPage() {
  return (
    <PageShell title="Cohort Contact">
      <div className="content-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-eyebrow">Cohort Directory</p>
            <h2>Beta Nu Fall Roster</h2>
          </div>
        </div>

        <div className="table-frame">
          <table className="cohort-table">
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
              <tr>
                <td className="table-empty-state" colSpan={7}>
                  Cohort roster data will be added when the shared data model
                  is established.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
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
              <span
                className={`nav-chevron ${coursesOpen ? 'nav-chevron-open' : ''
                  }`}
                aria-hidden="true"
              >
                ▾
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
                  title="Purpose & Research ?"
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