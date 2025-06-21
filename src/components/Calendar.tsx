"use client";

import { useState } from "react";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { CalendarEvent, CalendarView } from "@/types/calendar";
import { EnhancedToolbar } from "@/components/EnhancedToolbar";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { EventModal } from "@/components/EventModal";
import { SidebarMiniCalendar } from "@/components/SidebarMiniCalendar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDesktop } from "@/hooks/useDesktop";

const EVENT_COLORS = [
  "#4285f4", // Blue
  "#ea4335", // Red
  "#fbbc04", // Yellow
  "#34a853", // Green
  "#ff6d01", // Orange
  "#46bdc6", // Teal
  "#7b1fa2", // Purple
  "#d81b60", // Pink
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: new Date(2024, 11, 15, 10, 0),
      end: new Date(2024, 11, 15, 11, 0),
      color: "#4285f4",
    },
    {
      id: "2",
      title: "Lunch with Client",
      start: new Date(2024, 11, 16, 12, 0),
      end: new Date(2024, 11, 16, 13, 30),
      color: "#34a853",
    },
    {
      id: "3",
      title: "Project Review",
      start: new Date(2024, 11, 17, 14, 0),
      end: new Date(2024, 11, 17, 15, 30),
      color: "#fbbc04",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDesktop = useDesktop();

  const navigateDate = (direction: "prev" | "next") => {
    switch (view) {
      case "month":
        setCurrentDate(
          direction === "next"
            ? addMonths(currentDate, 1)
            : subMonths(currentDate, 1)
        );
        break;
      case "week":
        setCurrentDate(
          direction === "next"
            ? addWeeks(currentDate, 1)
            : subWeeks(currentDate, 1)
        );
        break;
      case "day":
        setCurrentDate(
          direction === "next"
            ? addDays(currentDate, 1)
            : subDays(currentDate, 1)
        );
        break;
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // Update current date based on view
    switch (view) {
      case "month":
        setCurrentDate(startOfMonth(date));
        break;
      case "week":
        setCurrentDate(startOfWeek(date));
        break;
      case "day":
        setCurrentDate(date);
        break;
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentDate(
      direction === "next"
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1)
    );
  };

  // Set up keyboard shortcuts
  useKeyboardShortcuts({
    onViewChange: setView,
    onNavigate: navigateDate,
    onGoToToday: goToToday,
    isDesktop,
  });

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      color:
        event.color ||
        EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
    };
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCellClick = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
    if (view === "month") {
      setView("day");
    }
    setIsModalOpen(true);
  };

  const handleEventDrop = (eventId: string, newStart: Date, newEnd: Date) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, start: newStart, end: newEnd }
          : event
      )
    );
  };

  const handleEventResize = (eventId: string, newStart: Date, newEnd: Date) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, start: newStart, end: newEnd }
          : event
      )
    );
  };

  const renderView = () => {
    switch (view) {
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onCellClick={handleCellClick}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left: Mini Calendar Sidebar (Desktop Only) */}
      {isDesktop && (
        <div className="w-64 border-r bg-white z-10 md:block hidden">
          <SidebarMiniCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}

      {/* Right: Main Calendar View */}
      <div className="flex-1 relative z-0 flex flex-col">
        <EnhancedToolbar
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={navigateDate}
          onGoToToday={goToToday}
          isDesktop={isDesktop}
        />
        <div className="flex-1 overflow-hidden">{renderView()}</div>
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSave={selectedEvent ? updateEvent : addEvent}
          onDelete={selectedEvent ? deleteEvent : undefined}
          currentDate={currentDate}
          view={view}
        />
      </div>
    </div>
  );
}
