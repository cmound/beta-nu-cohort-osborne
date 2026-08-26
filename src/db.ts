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

class BetaNuDatabase extends Dexie {
  readonly academicPlan:
    Table<CloudAcademicPlanRecord, string>

  readonly cohortContacts:
    Table<CloudCohortContactRecord, string>

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

    this.academicPlan =
      this.table(
        'academicPlan',
      )

    this.cohortContacts =
      this.table(
        'cohortContacts',
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