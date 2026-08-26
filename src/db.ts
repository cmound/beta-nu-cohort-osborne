import {
  Dexie,
  type Table,
} from 'dexie'
import dexieCloud from 'dexie-cloud-addon'

export interface CloudAcademicPlanRecord {
  readonly id: string
  readonly realmId: string
  readonly programYear: string
  readonly calendarYear: string
  readonly code: string
  readonly className: string
  readonly startDate: string
  readonly endDate: string
  readonly termYear: string
  readonly length: string
}

export type CloudCohortTimeZone =
  | 'Eastern'
  | 'Central'
  | 'Mountain'
  | 'Arizona (MST)'
  | 'Pacific'
  | 'Alaska'
  | 'Hawaii-Aleutian'

export type CloudCohortContactStatus =
  | 'Active'
  | 'Inactive'

export interface CloudCohortContactRecord {
  readonly id: string
  readonly realmId: string
  readonly name: string
  readonly timeZone: CloudCohortTimeZone
  readonly phoneDigits: string
  readonly email: string
  readonly industry: string
  readonly birthdayMonth: number | null
  readonly birthdayDay: number | null
  readonly dissertationInterest: string
  readonly isMentor: boolean
  readonly status: CloudCohortContactStatus
  readonly inactiveDate: string
  readonly isFormer: boolean
  readonly sortOrder: number
}

export type CloudCohortProgramYear =
  | 'Year 1'
  | 'Year 2'

export interface CloudCohortMeetingRecord {
  readonly id: string
  readonly realmId: string
  readonly year: CloudCohortProgramYear
  readonly date: string
  readonly term: string
  readonly meetingNumber: string
  readonly facilitator: string
  readonly communityBuilder: string
  readonly recorder: string
  readonly timeKeeper: string
  readonly processObserver: string
}

export interface CloudCourseAssignmentRecord {
  readonly id: string
  readonly asn: string
  readonly name: string
  readonly dueDate: string
  readonly points: string
}

export type CloudCourseWebinarRequirement =
  | ''
  | 'Required'
  | 'Optional'

export interface CloudCourseWebinarRecord {
  readonly id: string
  readonly webinarNumber: string
  readonly session: string
  readonly topic: string
  readonly date: string
  readonly pacificStartTime: string
  readonly required:
  CloudCourseWebinarRequirement
}

export interface CloudCourseWorkspaceRecord {
  readonly id: string
  readonly realmId: string
  readonly courseSlug: string
  readonly assignmentsPageUrl: string
  readonly professorName: string
  readonly professorEmail: string
  readonly professorPhoneDigits: string
  readonly professorOfficeHours: string
  readonly assignments:
  readonly CloudCourseAssignmentRecord[]
  readonly webinarZoomUrl: string
  readonly webinars:
  readonly CloudCourseWebinarRecord[]
}

export interface CloudCourseWaiverRecord {
  readonly id: string
  readonly realmId: string
  readonly contactId: string
  readonly courseCode: string
}

export type CloudCourseProgressStatus =
  | "Haven't Started"
  | 'In Progress'
  | 'Done'
  | 'Help!'

export interface CloudCourseProgressRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly courseSlug: string
  readonly contactId: string
  readonly assignmentId: string
  readonly status:
  CloudCourseProgressStatus
}

export type CloudCohortAttendanceMark =
  | ''
  | 'X'
  | 'A'

export interface CloudCohortAttendanceRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly contactId: string
  readonly meetingId: string
  readonly mark: CloudCohortAttendanceMark
}

export type CloudCohortAvailabilityMark =
  | ''
  | 'P'
  | 'C'
  | 'A'
  | 'I'

export interface CloudCohortAvailabilityRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly participantId: string
  readonly dateId: string
  readonly mark:
  CloudCohortAvailabilityMark
}

export interface CloudCohortGroupRecord {
  readonly id: string
  readonly memberIds:
  readonly string[]
  readonly targetSize: number
}

export interface CloudCohortGroupAssignmentsRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly activityDate: string
  readonly excludedStudentIds:
  readonly string[]
  readonly groups:
  readonly CloudCohortGroupRecord[]
}

export interface CloudCohortPurposeResearchRecord {
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

export interface CloudCohortPurposeResearchWorkspaceRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly records:
  readonly CloudCohortPurposeResearchRecord[]
}

export type CloudFacilitatorAgendaStatus =
  | 'Draft'
  | 'Final'

export interface CloudFacilitatorAgendaItemRecord {
  readonly id: string
  readonly agendaItem: string
  readonly name: string
  readonly durationMinutes: number
  readonly details: string
  readonly isDefault: boolean
}

export interface CloudFacilitatorAgendaRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly meetingId: string
  readonly isSaved: boolean
  readonly status:
  CloudFacilitatorAgendaStatus
  readonly savedAt: string
  readonly housekeepingNotes: string
  readonly agendaItems:
  readonly CloudFacilitatorAgendaItemRecord[]
}

export interface CloudCohortSharedUrlRecord {
  readonly id: string
  readonly realmId: string
  readonly owner: string
  readonly websiteName: string
  readonly url: string
  readonly source: string
  readonly notes: string
  readonly addedAt: string
}

class BetaNuDatabase extends Dexie {
  readonly academicPlan:
    Table<CloudAcademicPlanRecord, string>

  readonly cohortContacts:
    Table<CloudCohortContactRecord, string>

  readonly cohortMeetings:
    Table<CloudCohortMeetingRecord, string>

  readonly courseWorkspaces:
    Table<CloudCourseWorkspaceRecord, string>

  readonly courseWaivers:
    Table<CloudCourseWaiverRecord, string>

  readonly courseProgress:
    Table<CloudCourseProgressRecord, string>

  readonly cohortAttendance:
    Table<CloudCohortAttendanceRecord, string>

  readonly cohortAvailability:
    Table<CloudCohortAvailabilityRecord, string>

  readonly cohortGroupAssignments:
    Table<CloudCohortGroupAssignmentsRecord, string>

  readonly cohortPurposeResearch:
    Table<CloudCohortPurposeResearchWorkspaceRecord, string>

  readonly facilitatorAgendas:
    Table<CloudFacilitatorAgendaRecord, string>

  readonly sharedUrls:
    Table<CloudCohortSharedUrlRecord, string>

  constructor() {
    super(
      'BetaNuCohortCloud',
      {
        addons: [
          dexieCloud,
        ],
      },
    )

    this.version(1).stores({
      academicPlan:
        'id, realmId, code, startDate, endDate',

      realms:
        '@realmId',

      members:
        '@id, realmId, [email+realmId]',

      roles:
        '[realmId+name]',
    })

    this.version(2).stores({
      cohortContacts:
        'id, realmId, email, status',
    })

    this.version(3).stores({
      cohortMeetings:
        'id, realmId, date, year',
    })

    this.version(4).stores({
      courseWorkspaces:
        'id, realmId, courseSlug',
    })

    this.version(5).stores({
      courseWaivers:
        'id, realmId, contactId, courseCode',
    })

    this.version(6).stores({
      courseProgress:
        'id, realmId, courseSlug, contactId, assignmentId',
    })

    this.version(7).stores({
      cohortAttendance:
        'id, realmId, contactId, meetingId',
    })

    this.version(8).stores({
      cohortAvailability:
        'id, realmId, participantId, dateId',
    })

    this.version(9).stores({
      cohortGroupAssignments:
        'id, realmId, owner',
    })

    this.version(10).stores({
      cohortPurposeResearch:
        'id, realmId, owner',
    })

    this.version(11).stores({
      facilitatorAgendas:
        'id, realmId, owner, meetingId, isSaved',
    })

    this.version(12).stores({
      sharedUrls:
        'id, realmId, owner, url, addedAt',
    })

    this.academicPlan =
      this.table(
        'academicPlan',
      )

    this.cohortContacts =
      this.table(
        'cohortContacts',
      )

    this.cohortMeetings =
      this.table(
        'cohortMeetings',
      )

    this.courseWorkspaces =
      this.table(
        'courseWorkspaces',
      )

    this.courseWaivers =
      this.table(
        'courseWaivers',
      )

    this.courseProgress =
      this.table(
        'courseProgress',
      )

    this.cohortAttendance =
      this.table(
        'cohortAttendance',
      )

    this.cohortAvailability =
      this.table(
        'cohortAvailability',
      )

    this.cohortGroupAssignments =
      this.table(
        'cohortGroupAssignments',
      )

    this.cohortPurposeResearch =
      this.table(
        'cohortPurposeResearch',
      )

    this.facilitatorAgendas =
      this.table(
        'facilitatorAgendas',
      )

    this.sharedUrls =
      this.table(
        'sharedUrls',
      )

    this.cloud.configure({
      databaseUrl:
        'https://zaw13gypb.dexie.cloud',

      requireAuth: true,
      disableWebSocket: false,
      disableEagerSync: false,
    })
  }
}

export const db =
  new BetaNuDatabase()