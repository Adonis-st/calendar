"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: "prev" | "next") => void;
}

export function MiniCalendar({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onMonthChange,
}: MiniCalendarProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="p-4">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange("prev")}
          className="h-6 w-6 p-0"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <h3 className="text-sm font-medium">
          {format(currentDate, "MMM yyyy")}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMonthChange("next")}
          className="h-6 w-6 p-0"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs text-center text-muted-foreground font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 text-xs relative ${
                !isCurrentMonth ? "text-muted-foreground/50" : ""
              } ${
                isCurrentDay
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : isSelected
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent"
              }`}
              onClick={() => onDateSelect(day)}
            >
              {format(day, "d")}
              {/* Event indicator */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-current rounded-full opacity-60" />
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
