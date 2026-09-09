import { requireSupabase } from './supabase';
import { isUuid } from './ids';

type EntityTable = 'teachers' | 'groups' | 'students';

/** Resolve a frontend business code or UUID to the database UUID. */
export async function resolveEntityUuid(
  table: EntityTable,
  codeOrUuid: string,
): Promise<string> {
  if (isUuid(codeOrUuid)) {
    return codeOrUuid;
  }

  try {
    const client = requireSupabase();
    const { data, error } = await client
      .from(table)
      .select('id')
      .eq('code', codeOrUuid)
      .maybeSingle();

    if (error) {
      console.warn(`[EntityResolver] Failed to resolve ${table} ${codeOrUuid}:`, error.message);
      return codeOrUuid;
    }
    if (data && data.id) {
      return data.id;
    }
  } catch (err) {
    console.warn(`[EntityResolver] Supabase connection error for ${table} ${codeOrUuid}:`, err);
  }

  return codeOrUuid;
}

/** Batch-resolve business codes to UUIDs for a table. */
export async function resolveEntityUuidMap(
  table: EntityTable,
  codes: string[],
): Promise<Map<string, string>> {
  const uniqueCodes = [...new Set(codes.filter(c => !isUuid(c)))];
  const map = new Map<string, string>();

  for (const code of uniqueCodes) {
    map.set(code, await resolveEntityUuid(table, code));
  }

  for (const value of codes) {
    if (isUuid(value)) {
      map.set(value, value);
    }
  }

  return map;
}
