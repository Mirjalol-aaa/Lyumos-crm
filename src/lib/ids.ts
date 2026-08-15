/** RFC 4122 UUID v1–v5 pattern (case-insensitive). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/** Business payment identifier shown in the UI, e.g. PAY-STU-1001-August */
export function paymentCode(studentCode: string, month: string): string {
  return `PAY-${studentCode}-${month}`;
}
