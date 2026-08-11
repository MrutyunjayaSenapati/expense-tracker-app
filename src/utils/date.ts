/**
 * Centralized Date utility for formatting and grouping
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function parseDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  return new Date(dateInput);
}

export function formatDate(dateInput: string | Date): string {
  const d = parseDate(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const month = MONTH_ABBR[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function formatMonthYear(dateInput: string | Date = new Date()): string {
  const d = parseDate(dateInput);
  if (isNaN(d.getTime())) return '';
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(dateInput: string | Date): string {
  const d = parseDate(dateInput);
  if (isNaN(d.getTime())) return '';
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${ampm}`;
}

export function isToday(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isYesterday(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

export function formatRelativeDate(dateInput: string | Date): string {
  if (isToday(dateInput)) return 'Today';
  if (isYesterday(dateInput)) return 'Yesterday';
  const d = parseDate(dateInput);
  const currentYear = new Date().getFullYear();
  if (d.getFullYear() === currentYear) {
    return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
  }
  return formatDate(dateInput);
}

export function getGroupedDateKey(dateInput: string | Date): string {
  const d = parseDate(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
