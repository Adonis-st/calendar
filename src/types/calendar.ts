export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

export type CalendarView = "month" | "week" | "day";

export interface TimeSlot {
  hour: number;
  minute: number;
  time: string;
}

export interface DayEvent {
  event: CalendarEvent;
  top: number;
  height: number;
  left: number;
  width: number;
}
