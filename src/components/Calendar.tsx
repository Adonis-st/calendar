"use client";

import { useState } from "react";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from "date-fns";
import { CalendarEvent, CalendarView } from "@/types/calendar";
import { CalendarToolbar } from "@/components/CalendarToolbar";
import { MonthView } from "@/components/MonthView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { EventModal } from "@/components/EventModal";

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
    setCurrentDate(new Date());
  };

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
          />
        );
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigateDate}
        onGoToToday={goToToday}
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
  );
}
