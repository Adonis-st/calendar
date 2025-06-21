import { useEffect } from "react";
import { CalendarView } from "@/types/calendar";

interface KeyboardShortcutsProps {
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  isDesktop: boolean;
}

export function useKeyboardShortcuts({
  onViewChange,
  onNavigate,
  onGoToToday,
  isDesktop,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    if (!isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Don't trigger shortcuts when modifier keys are pressed (except for arrow keys)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "m":
          event.preventDefault();
          onViewChange("month");
          break;
        case "w":
          event.preventDefault();
          onViewChange("week");
          break;
        case "d":
          event.preventDefault();
          onViewChange("day");
          break;
        case "t":
          event.preventDefault();
          onGoToToday();
          break;
        case "arrowleft":
          event.preventDefault();
          onNavigate("prev");
          break;
        case "arrowright":
          event.preventDefault();
          onNavigate("next");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onViewChange, onNavigate, onGoToToday, isDesktop]);
}
