"use client";

import { useMemo, useState, useEffect } from "react";
import {
  format,
  eachHourOfInterval,
  isSameDay,
  isSameHour,
  addHours,
  differenceInMinutes,
  addMinutes,
} from "date-fns";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CalendarEvent } from "@/types/calendar";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  onEventDrop,
}: DayViewProps) {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const timeSlots = useMemo(() => {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    return eachHourOfInterval({ start: dayStart, end: dayEnd });
  }, [currentDate]);

  const dayEvents = useMemo(() => {
    const filteredEvents = events.filter((event) =>
      isSameDay(event.start, currentDate)
    );

    return filteredEvents.map((event) => {
      const startMinutes =
        event.start.getHours() * 60 + event.start.getMinutes();
      const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();
      const duration = endMinutes - startMinutes;

      return {
        event,
        top: (startMinutes / 60) * 60, // 60px per hour
        height: Math.max((duration / 60) * 60, 30), // Minimum height of 30px
        left: 0,
        width: 100,
      };
    });
  }, [events, currentDate]);

  const handleDragStart = (event: DragStartEvent) => {
    const eventId = event.active.id as string;
    const eventData = events.find((e) => e.id === eventId);
    if (eventData) {
      setDraggedEvent(eventData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedEvent(null);

    if (!event.over) return;

    const eventId = event.active.id as string;
    const targetHour = event.over.data.current?.hour as number;

    if (targetHour !== undefined) {
      const eventData = events.find((e) => e.id === eventId);
      if (eventData) {
        const duration = differenceInMinutes(eventData.end, eventData.start);
        const newStart = addHours(currentDate, targetHour);
        const newEnd = addMinutes(newStart, duration);
        onEventDrop(eventId, newStart, newEnd);
      }
    }
  };

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentTimePosition = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 60) * 60; // 60px per hour
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex">
        {/* Time column */}
        <div className="w-16 border-r bg-gray-50">
          <div className="h-12 border-b flex items-center justify-center font-medium">
            {format(currentDate, "EEE, MMM d")}
          </div>
          {timeSlots.map((time, index) => (
            <div
              key={index}
              className="h-15 border-b text-xs text-gray-500 p-1 text-right"
            >
              {format(time, "HH:mm")}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 relative">
          {/* Time slots */}
          {timeSlots.map((time, timeIndex) => (
            <div
              key={timeIndex}
              className="h-15 border-b border-gray-100 relative"
              data-hour={time.getHours()}
            >
              {/* Current time indicator */}
              {isToday && isSameHour(time, currentTime) && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                  style={{ top: getCurrentTimePosition() % 60 }}
                />
              )}
            </div>
          ))}

          {/* Events */}
          {dayEvents.map((dayEvent) => (
            <div
              key={dayEvent.event.id}
              className="absolute left-1 right-1 rounded p-2 text-sm cursor-pointer z-20 shadow-sm"
              style={{
                top: dayEvent.top,
                height: dayEvent.height,
                backgroundColor: dayEvent.event.color + "20",
                color: dayEvent.event.color,
                border: `1px solid ${dayEvent.event.color}`,
              }}
              onClick={() => onEventClick(dayEvent.event)}
            >
              <div className="font-medium truncate">{dayEvent.event.title}</div>
              <div className="text-xs opacity-75 mt-1">
                {format(dayEvent.event.start, "HH:mm")} -{" "}
                {format(dayEvent.event.end, "HH:mm")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {draggedEvent && (
          <div
            className="bg-white border rounded shadow-lg p-2 text-sm"
            style={{
              backgroundColor: draggedEvent.color + "20",
              color: draggedEvent.color,
              border: `1px solid ${draggedEvent.color}`,
            }}
          >
            <div className="font-medium">{draggedEvent.title}</div>
            <div className="text-xs opacity-75">
              {format(draggedEvent.start, "HH:mm")} -{" "}
              {format(draggedEvent.end, "HH:mm")}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
