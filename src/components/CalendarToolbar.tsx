"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid3X3,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarView } from "@/types/calendar";

interface CalendarToolbarProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  isDesktop: boolean;
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onGoToToday,
  isDesktop,
}: CalendarToolbarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Show mobile hint on first visit
    const hasSeenHint = localStorage.getItem("calendar-mobile-hint");
    if (!hasSeenHint && isMobile) {
      setShowMobileHint(true);
      setTimeout(() => setShowMobileHint(false), 5000);
      localStorage.setItem("calendar-mobile-hint", "true");
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  const getViewTitle = () => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
        return `Week of ${format(currentDate, "MMM d, yyyy")}`;
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="text-sm"
          >
            Today
            {isDesktop && (
              <span className="ml-2 text-xs text-muted-foreground">(T)</span>
            )}
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("prev")}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("next")}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h1 className="text-xl font-semibold text-gray-900">
            {getViewTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            value={view}
            onValueChange={(value: CalendarView) => onViewChange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">
                <div className="flex items-center space-x-2">
                  <Grid3X3 className="h-4 w-4" />
                  <span>Month</span>
                  {isDesktop && (
                    <span className="text-xs text-muted-foreground">(M)</span>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="week">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Week</span>
                  {isDesktop && (
                    <span className="text-xs text-muted-foreground">(W)</span>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="day">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Day</span>
                  {isDesktop && (
                    <span className="text-xs text-muted-foreground">(D)</span>
                  )}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile hint */}
      {showMobileHint && isMobile && (view === "week" || view === "day") && (
        <div className="bg-blue-50 border-b border-blue-200 p-3 text-sm text-blue-800 flex items-center space-x-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>
            💡 <strong>Tip:</strong> Long press and drag events to reschedule
            them
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileHint(false)}
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            ×
          </Button>
        </div>
      )}

      {/* Desktop keyboard shortcuts hint */}
      {isDesktop && (
        <div className="bg-gray-50 border-b border-gray-200 p-2 text-xs text-gray-600 flex items-center justify-center space-x-4">
          <span>Keyboard shortcuts:</span>
          <span>
            M (Month) • W (Week) • D (Day) • T (Today) • ← → (Navigate)
          </span>
        </div>
      )}
    </div>
  );
}
