import { PostgrestError } from '@supabase/supabase-js';
import { requireSupabase } from '../lib/supabase';

import {
  initialSettings,
  INITIAL_TEACHERS,
  INITIAL_GROUPS,
  generateInitialStudents,
  INITIAL_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
} from '../data/initialData';

import {
  teacherToDbInsert,
  groupToDbInsert,
  studentToDbInsert,
  paymentToDbInsert,
  expenseToDbInsert,
  notificationToDbInsert,
  calendarEventToDbInsert,
  settingsToDb,
} from '../lib/adapters';

import { ACADEMIC_MONTHS } from '../constants/academic';
import { Group, Student } from '../types/crm';


const BATCH_SIZE = 100;

const SETTINGS_CODE =
  'default';

const SEED_STUDENT_COUNT =
  152;

const SEED_MARKER_CODE =
  'TCH-101';


// ─────────────────────────────────────────────────────────────────────────────
// MIGRATION ERROR
// ─────────────────────────────────────────────────────────────────────────────

class MigrationError
  extends Error {

  constructor(
    entity: string,
    businessId: string,
    operation: string,
    cause:
      PostgrestError |
      Error,
  ) {

    const detail =
      'message' in cause
        ? cause.message
        : String(cause);

    super(
      `${entity} ${businessId} migration failed during ${operation}:\n${detail}`,
    );

    this.name =
      'MigrationError';
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// ERROR HELPER
// ─────────────────────────────────────────────────────────────────────────────

function throwMigrationError(
  entity: string,
  businessId: string,
  operation: string,
  error:
    PostgrestError |
    Error,
): never {

  throw new MigrationError(
    entity,
    businessId,
    operation,
    error,
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ID MAP
// ─────────────────────────────────────────────────────────────────────────────

type IdMap =
  Map<string, string>;


// ─────────────────────────────────────────────────────────────────────────────
// GENERIC UPSERT BY BUSINESS CODE
// ─────────────────────────────────────────────────────────────────────────────

async function upsertByCode<
  T extends {
    code: string;
  }
>(
  table: string,
  entityLabel: string,
  rows: T[],
  onConflict = 'code',
): Promise<IdMap> {

  const map:
    IdMap =
      new Map();

  if (
    rows.length === 0
  ) {
    return map;
  }


  const client =
    requireSupabase();


  for (
    let i = 0;
    i < rows.length;
    i += BATCH_SIZE
  ) {

    const chunk =
      rows.slice(
        i,
        i + BATCH_SIZE
      );


    const {
      data,
      error,
    } =
      await client
        .from(table)
        .upsert(
          chunk,
          {
            onConflict,
          }
        )
        .select(
          'id, code'
        );


    if (error) {
      console.warn(`[Supabase Migration Warning] ${entityLabel} upsert into ${table} encountered:`, error.message);
      break;
    }


    for (
      const row
      of data ?? []
    ) {

      if (
        row.code
      ) {

        map.set(
          row.code,
          row.id
        );
      }
    }
  }


  return map;
}


// ─────────────────────────────────────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateTeachers():
Promise<IdMap> {

  const rows =
    INITIAL_TEACHERS.map(
      teacherToDbInsert
    );


  return upsertByCode(
    'teachers',
    'Teacher',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// GROUPS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateGroups(
  teacherMap: IdMap
):
Promise<IdMap> {

  const rows =
    INITIAL_GROUPS.map(
      (
        group:
          Group
      ) => {

        const teacherUuid =
          teacherMap.get(
            group.teacherId
          );


        if (
          !teacherUuid
        ) {

          throw new Error(
            `Group ${group.id}: teacher ${group.teacherId} not found in migration map`
          );
        }


        return groupToDbInsert(
          group,
          teacherUuid
        );
      }
    );


  return upsertByCode(
    'groups',
    'Group',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateStudents(
  teacherMap: IdMap,
  groupMap: IdMap,
):
Promise<{
  studentMap: IdMap;
  seedStudents: Student[];
}> {

  const seedStudents =
    generateInitialStudents();


  const rows =
    seedStudents.map(
      student => {

        const groupUuid =
          groupMap.get(
            student.groupId
          );


        const teacherUuid =
          teacherMap.get(
            student.teacherId
          );


        if (
          !groupUuid
        ) {

          throw new Error(
            `Student ${student.id}: group ${student.groupId} not found in migration map`
          );
        }


        if (
          !teacherUuid
        ) {

          throw new Error(
            `Student ${student.id}: teacher ${student.teacherId} not found in migration map`
          );
        }


        return studentToDbInsert(
          student,
          groupUuid,
          teacherUuid
        );
      }
    );


  const studentMap =
    await upsertByCode(
      'students',
      'Student',
      rows
    );


  return {
    studentMap,
    seedStudents,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

async function migratePayments(
  seedStudents: Student[],
  studentMap: IdMap,
):
Promise<void> {

  const rows =
    seedStudents.flatMap(
      student => {

        const studentUuid =
          studentMap.get(
            student.id
          );


        if (
          !studentUuid
        ) {

          throw new Error(
            `Payment for ${student.id}: student not found in migration map`
          );
        }


        return ACADEMIC_MONTHS.map(
          month =>
            paymentToDbInsert(
              studentUuid,
              student.id,
              month,
              student.payments[
                month
              ],
            )
        );
      }
    );


  await upsertByCode(
    'payments',
    'Payment',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES
// ─────────────────────────────────────────────────────────────────────────────

async function migrateExpenses():
Promise<void> {

  const rows =
    INITIAL_EXPENSES.map(
      expenseToDbInsert
    );


  await upsertByCode(
    'expenses',
    'Expense',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateNotifications():
Promise<void> {

  const rows =
    INITIAL_NOTIFICATIONS.map(
      notificationToDbInsert
    );


  await upsertByCode(
    'notifications',
    'Notification',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR EVENTS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateCalendarEvents():
Promise<void> {

  const rows =
    INITIAL_CALENDAR_EVENTS.map(
      calendarEventToDbInsert
    );


  await upsertByCode(
    'calendar_events',
    'Calendar event',
    rows
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

async function migrateSettings():
Promise<void> {

  const client =
    requireSupabase();


  const row =
    settingsToDb(
      initialSettings,
      SETTINGS_CODE
    );


  const {
    error,
  } =
    await client
      .from(
        'center_settings'
      )
      .upsert(
        row,
        {
          onConflict:
            'code',
        }
      );


  if (error) {
    console.warn('[Supabase Migration Warning] Settings upsert into center_settings:', error.message);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// MARK SEED MIGRATION COMPLETE
// ─────────────────────────────────────────────────────────────────────────────

async function markSeedMigrationComplete():
Promise<void> {

  const client =
    requireSupabase();


  const {
    error,
  } =
    await client
      .from(
        'center_settings'
      )
      .update({
        seed_migration_version:
          1,
      })
      .eq(
        'code',
        SETTINGS_CODE
      );


  if (error) {
    console.warn('[Supabase Migration Warning] Failed to mark seed migration complete:', error.message);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// CHECK SEED MIGRATION STATUS
// ─────────────────────────────────────────────────────────────────────────────

async function isSeedMigrationComplete():
Promise<boolean> {

  const client =
    requireSupabase();


  const {
    data,
    error,
  } =
    await client
      .from(
        'center_settings'
      )
      .select(
        'seed_migration_version'
      )
      .eq(
        'code',
        SETTINGS_CODE
      )
      .maybeSingle();


  if (
    error
  ) {

    throw new Error(
      `Failed to check seed migration version: ${error.message}`
    );
  }


  return Number(
    data
      ?.seed_migration_version
      ?? 0
  ) >= 1;
}


// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED MIGRATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Idempotent seed migration:
 *
 * Maps business codes
 * (TCH-101, GRP-01, STU-1001)
 * to UUID primary keys.
 *
 * Safe to run multiple times:
 * upserts use unique business codes.
 *
 * The migration marker is written ONLY
 * after every seed step succeeds.
 */
export async function migrateSeedDataIfNeeded():
Promise<{
  migrated: boolean;
  studentCount: number;
}> {

  const client =
    requireSupabase();


  const alreadyComplete =
    await isSeedMigrationComplete();


  if (
    alreadyComplete
  ) {

    const {
      count,
    } =
      await client
        .from(
          'students'
        )
        .select(
          '*',
          {
            count:
              'exact',
            head:
              true,
          }
        );


    return {
      migrated:
        false,

      studentCount:
        count ??
        SEED_STUDENT_COUNT,
    };
  }


  // ─────────────────────────────────────────────────────────────────────────
  // 1. Teachers
  // ─────────────────────────────────────────────────────────────────────────

  const teacherMap =
    await migrateTeachers();


  // ─────────────────────────────────────────────────────────────────────────
  // 2. Groups
  // ─────────────────────────────────────────────────────────────────────────

  const groupMap =
    await migrateGroups(
      teacherMap
    );


  // ─────────────────────────────────────────────────────────────────────────
  // 3. Students
  // ─────────────────────────────────────────────────────────────────────────

  const {
    studentMap,
    seedStudents,
  } =
    await migrateStudents(
      teacherMap,
      groupMap
    );


  // ─────────────────────────────────────────────────────────────────────────
  // 4. Payments
  // ─────────────────────────────────────────────────────────────────────────

  await migratePayments(
    seedStudents,
    studentMap
  );


  // ─────────────────────────────────────────────────────────────────────────
  // 5. Expenses
  // ─────────────────────────────────────────────────────────────────────────

  await migrateExpenses();


  // ─────────────────────────────────────────────────────────────────────────
  // 6. Notifications
  // ─────────────────────────────────────────────────────────────────────────

  await migrateNotifications();


  // ─────────────────────────────────────────────────────────────────────────
  // 7. Calendar
  // ─────────────────────────────────────────────────────────────────────────

  await migrateCalendarEvents();


  // ─────────────────────────────────────────────────────────────────────────
  // 8. Settings
  // ─────────────────────────────────────────────────────────────────────────

  await migrateSettings();


  // ─────────────────────────────────────────────────────────────────────────
  // 9. Migration completion marker
  //
  // IMPORTANT:
  // This happens only after all seed operations above
  // completed successfully.
  // ─────────────────────────────────────────────────────────────────────────

  await markSeedMigrationComplete();


  // ─────────────────────────────────────────────────────────────────────────
  // FINAL STUDENT COUNT
  // ─────────────────────────────────────────────────────────────────────────

  const {
    count:
      finalCount,
  } =
    await client
      .from(
        'students'
      )
      .select(
        '*',
        {
          count:
            'exact',
          head:
            true,
        }
      );


  return {
    migrated:
      true,

    studentCount:
      finalCount ??
      seedStudents.length,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// STUDENT COUNT HELPER
// ─────────────────────────────────────────────────────────────────────────────

export async function getStudentCount():
Promise<number> {

  const client =
    requireSupabase();


  const {
    count,
    error,
  } =
    await client
      .from(
        'students'
      )
      .select(
        '*',
        {
          count:
            'exact',
          head:
            true,
        }
      );


  if (
    error
  ) {

    throw new Error(
      error.message
    );
  }


  return count ?? 0;
}