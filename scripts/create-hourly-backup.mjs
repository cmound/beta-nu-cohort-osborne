import {
  mkdir,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'

const APP_NAME =
  'Beta Nu Fall Cohort Hub'

const DATABASE_URL =
  'https://zaw13gypb.dexie.cloud'

const REALM_ID =
  'rlm1ecd3705-9ef7-4e93-86aa-cf597fab8f50'

const encodedServiceKey =
  process.env.DEXIE_CLOUD_SERVICE_KEY_B64

const outputDirectory =
  process.env.BACKUP_OUTPUT_DIR

if (!encodedServiceKey) {
  throw new Error(
    'DEXIE_CLOUD_SERVICE_KEY_B64 is required.',
  )
}

if (!outputDirectory) {
  throw new Error(
    'BACKUP_OUTPUT_DIR is required.',
  )
}

const serviceKeyJson =
  Buffer
    .from(
      encodedServiceKey,
      'base64',
    )
    .toString('utf8')

const serviceKeys =
  JSON.parse(
    serviceKeyJson,
  )

const credentials =
  serviceKeys[DATABASE_URL]

if (
  !credentials ||
  typeof credentials.clientId !==
    'string' ||
  typeof credentials.clientSecret !==
    'string'
) {
  throw new Error(
    'The Dexie Cloud service key does not contain credentials for the Beta Nu database.',
  )
}

async function getAccessToken() {
  const response =
    await fetch(
      `${DATABASE_URL}/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          grant_type:
            'client_credentials',
          scopes: [
            'ACCESS_DB',
            'GLOBAL_READ',
          ],
          client_id:
            credentials.clientId,
          client_secret:
            credentials.clientSecret,
        }),
      },
    )

  if (!response.ok) {
    const responseText =
      await response.text()

    throw new Error(
      `Dexie Cloud authentication failed (${response.status}): ${responseText}`,
    )
  }

  const tokenResponse =
    await response.json()

  if (
    !tokenResponse ||
    typeof tokenResponse.accessToken !==
      'string'
  ) {
    throw new Error(
      'Dexie Cloud did not return a valid access token.',
    )
  }

  return tokenResponse.accessToken
}

const accessToken =
  await getAccessToken()

async function listRealmTable(
  tableName,
) {
  const url =
    new URL(
      `${DATABASE_URL}/all/${encodeURIComponent(tableName)}`,
    )

  url.searchParams.set(
    'realmId',
    REALM_ID,
  )

  const response =
    await fetch(
      url,
      {
        method: 'GET',
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    )

  if (!response.ok) {
    const responseText =
      await response.text()

    throw new Error(
      `Failed to read ${tableName} (${response.status}): ${responseText}`,
    )
  }

  const records =
    await response.json()

  if (!Array.isArray(records)) {
    throw new Error(
      `Dexie Cloud returned an unexpected response for ${tableName}.`,
    )
  }

  return records
}

const [
  academicPlan,
  cohortContacts,
  cohortMeetings,
  courseWorkspaces,
  courseWaivers,
  courseProgress,
  cohortAttendance,
  cohortAvailability,
  cohortGroupAssignments,
  cohortPurposeResearch,
  facilitatorAgendas,
  sharedUrls,
  sharedDocuments,
  sharedDocumentState,
  cohortBooks,
] =
  await Promise.all([
    listRealmTable(
      'academicPlan',
    ),
    listRealmTable(
      'cohortContacts',
    ),
    listRealmTable(
      'cohortMeetings',
    ),
    listRealmTable(
      'courseWorkspaces',
    ),
    listRealmTable(
      'courseWaivers',
    ),
    listRealmTable(
      'courseProgress',
    ),
    listRealmTable(
      'cohortAttendance',
    ),
    listRealmTable(
      'cohortAvailability',
    ),
    listRealmTable(
      'cohortGroupAssignments',
    ),
    listRealmTable(
      'cohortPurposeResearch',
    ),
    listRealmTable(
      'facilitatorAgendas',
    ),
    listRealmTable(
      'sharedUrls',
    ),
    listRealmTable(
      'sharedDocuments',
    ),
    listRealmTable(
      'sharedDocumentState',
    ),
    listRealmTable(
      'cohortBooks',
    ),
  ])

const sharedDocumentIds =
  sharedDocuments.map(
    (record) => {
      if (
        !record ||
        typeof record !==
          'object' ||
        typeof record.id !==
          'string'
      ) {
        throw new Error(
          'A Shared Document record is missing a valid id.',
        )
      }

      return record.id
    },
  )

const exportedAt =
  new Date()

const pacificParts =
  Object.fromEntries(
    new Intl.DateTimeFormat(
      'en-US',
      {
        timeZone:
          'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      },
    )
      .formatToParts(
        exportedAt,
      )
      .filter(
        (part) =>
          part.type !==
          'literal',
      )
      .map(
        (part) => [
          part.type,
          part.value,
        ],
      ),
  )

const fileName =
  'beta-nu-fall-cohort-automatic-backup-' +
  `${pacificParts.year}-` +
  `${pacificParts.month}-` +
  `${pacificParts.day}_` +
  `${pacificParts.hour}.` +
  `${pacificParts.minute}_` +
  `${pacificParts.dayPeriod.toUpperCase()}.json`

const backup = {
  appName:
    APP_NAME,
  schemaVersion:
    3,
  exportedAt:
    exportedAt.toISOString(),
  storage:
    null,
  cloud: {
    realmId:
      REALM_ID,
    snapshotSource:
      'server',
    academicPlan,
    cohortContacts,
    cohortMeetings,
    courseWorkspaces,
    courseWaivers,
    courseProgress,
    cohortAttendance,
    cohortAvailability,
    cohortGroupAssignments,
    cohortPurposeResearch,
    facilitatorAgendas,
    sharedUrls,
    sharedDocumentState,
    cohortBooks,
    sharedDocumentIds,
  },
}

await mkdir(
  outputDirectory,
  {
    recursive: true,
  },
)

const outputPath =
  path.join(
    outputDirectory,
    fileName,
  )

await writeFile(
  outputPath,
  JSON.stringify(
    backup,
    null,
    2,
  ),
  'utf8',
)

console.log(
  `Backup created: ${fileName}`,
)

console.log(
  'Record counts:',
  {
    academicPlan:
      academicPlan.length,
    cohortContacts:
      cohortContacts.length,
    cohortMeetings:
      cohortMeetings.length,
    courseWorkspaces:
      courseWorkspaces.length,
    courseWaivers:
      courseWaivers.length,
    courseProgress:
      courseProgress.length,
    cohortAttendance:
      cohortAttendance.length,
    cohortAvailability:
      cohortAvailability.length,
    cohortGroupAssignments:
      cohortGroupAssignments.length,
    cohortPurposeResearch:
      cohortPurposeResearch.length,
    facilitatorAgendas:
      facilitatorAgendas.length,
    sharedUrls:
      sharedUrls.length,
    sharedDocuments:
      sharedDocumentIds.length,
    sharedDocumentState:
      sharedDocumentState.length,
    cohortBooks:
      cohortBooks.length,
  },
)