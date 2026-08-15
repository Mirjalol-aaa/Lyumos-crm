/** Academic year months (August → July). */
export const ACADEMIC_MONTHS = [
  'August', 'September', 'October', 'November', 'December',
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
] as const;

export type AcademicMonth = (typeof ACADEMIC_MONTHS)[number];

/** Map calendar month (0–11) to the active academic month label. */
export function getCurrentAcademicMonth(date = new Date()): AcademicMonth {
  const calendarMonth = date.getMonth(); // 0 = Jan … 7 = Aug
  const index = calendarMonth >= 7 ? calendarMonth - 7 : calendarMonth + 5;
  return ACADEMIC_MONTHS[index];
}

export function isCurrentCalendarMonth(isoDate: string, reference = new Date()): boolean {
  const d = new Date(isoDate);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth()
  );
}

export function monthIndex(month: string): number {
  const idx = ACADEMIC_MONTHS.indexOf(month as AcademicMonth);
  return idx >= 0 ? idx : 0;
}
