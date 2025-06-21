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
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CalendarEvent, DayEvent } from "@/types/calendar";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newStart: Date, newEnd: Date) => void;
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
  onCellClick: (
    date: Date,
    event?: CalendarEvent | null,
    clickEvent?: React.MouseEvent
  ) => void;
}

// Draggable Event Component
function DraggableEvent({
  event,
  dayEvent,
  onClick,
  onResize,
}: {
  event: CalendarEvent;
  dayEvent: DayEvent;
  onClick: () => void;
  onResize?: (eventId: string, newStart: Date, newEnd: Date) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: event.id,
      data: {
        event,
        type: "event",
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleResizeStart = (
    e: React.MouseEvent | React.TouchEvent,
    direction: "start" | "end"
  ) => {
    e.stopPropagation();
    // This would be implemented with a resize library like react-resizable-panels
    // For now, we'll just show the cursor
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        top: dayEvent.top,
        height: dayEvent.height,
        backgroundColor: event.color + "20",
        color: event.color,
        border: `1px solid ${event.color}`,
        opacity: isDragging ? 0.5 : 1,
        touchAction: "none",
        userSelect: "none",
      }}
      className={`absolute left-1 right-1 rounded p-2 text-sm cursor-move z-20 shadow-sm group min-h-[32px] touch-target ${
        isDragging ? "dragging" : ""
      }`}
      onClick={onClick}
    >
      <div className="font-medium truncate select-none">{event.title}</div>
      <div className="text-xs opacity-75 mt-1 select-none">
        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
      </div>

      {/* Mobile drag indicator */}
      <div className="absolute top-1 right-1 w-2 h-2 bg-current opacity-50 rounded-full md:hidden" />

      {/* Resize handles */}
      {onResize && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity touch-none"
            onMouseDown={(e) => handleResizeStart(e, "start")}
            onTouchStart={(e) => handleResizeStart(e, "start")}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity touch-none"
            onMouseDown={(e) => handleResizeStart(e, "end")}
            onTouchStart={(e) => handleResizeStart(e, "end")}
          />
        </>
      )}
    </div>
  );
}

// Droppable Time Slot Component
function DroppableTimeSlot({
  hour,
  children,
  onClick,
}: {
  hour: number;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${hour}`,
    data: {
      hour,
      type: "timeSlot",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-15 border-b border-gray-100 relative touch-manipulation cursor-pointer ${
        isOver ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  onEventDrop,
  onEventResize,
  onCellClick,
}: DayViewProps) {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
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
    const dropData = event.over.data.current;

    if (dropData?.type === "timeSlot" && dropData.hour !== undefined) {
      const eventData = events.find((e) => e.id === eventId);
      if (eventData) {
        const duration = differenceInMinutes(eventData.end, eventData.start);
        const newStart = addHours(currentDate, dropData.hour);
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

  const handleCellClick = (date: Date, e: React.MouseEvent) => {
    onCellClick(date, undefined, e);
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick(event);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex max-w-full">
        {/* Time column */}
        <div className="w-16 border-r bg-gray-50 flex-shrink-0">
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
        <div className="flex-1 relative min-w-0">
          {/* Time slots */}
          {timeSlots.map((time, timeIndex) => (
            <DroppableTimeSlot
              key={timeIndex}
              hour={time.getHours()}
              onClick={(e) => handleCellClick(time, e)}
            >
              {/* Current time indicator */}
              {isToday && isSameHour(time, currentTime) && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
                  style={{ top: getCurrentTimePosition() % 60 }}
                />
              )}
            </DroppableTimeSlot>
          ))}

          {/* Events */}
          {dayEvents.map((dayEvent) => (
            <DraggableEvent
              key={dayEvent.event.id}
              event={dayEvent.event}
              dayEvent={dayEvent}
              onClick={() => handleEventClick(dayEvent.event)}
              onResize={onEventResize}
            />
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
