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

class BetaNuDatabase extends Dexie {
  readonly academicPlan:
    Table<CloudAcademicPlanRecord, string>

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

    this.academicPlan =
      this.table(
        'academicPlan',
      )

    this.cloud.configure({
      databaseUrl:
        'https://zaw13gypb.dexie.cloud',

      requireAuth: true,
    })
  }
}

export const db =
  new BetaNuDatabase()