export interface DayCell {
  date: Date;
  inMonth: boolean;
  iso: string; // YYYY-MM-DD
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** 6-week grid (42 cells) starting on Sunday for the month containing `ref`. */
export function monthGrid(ref: Date): DayCell[] {
  const first = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({
      date,
      inMonth: date.getMonth() === ref.getMonth(),
      iso: toIsoDate(date),
    });
  }
  return cells;
}

export function monthRange(ref: Date): { from: string; to: string } {
  const from = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const to = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function dayRange(ref: Date): { from: string; to: string } {
  const from = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const to = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate(), 23, 59, 59);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function localIsoDate(iso: string): string {
  return toIsoDate(new Date(iso));
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
