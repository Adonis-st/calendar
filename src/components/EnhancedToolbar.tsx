"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid3X3,
  Clock,
  Keyboard,
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

interface EnhancedToolbarProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  isDesktop: boolean;
}

export function EnhancedToolbar({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onGoToToday,
  isDesktop,
}: EnhancedToolbarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const toggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };

  return (
    <div className="relative bg-white border-b z-20">
      {/* Main toolbar */}
      <div className="flex items-center justify-between p-4">
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
          {/* Keyboard shortcuts button for desktop */}
          {isDesktop && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleShortcuts}
              className="h-8 w-8 p-0"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          )}

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

      {/* Keyboard shortcuts overlay */}
      {showShortcuts && isDesktop && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-white/95 backdrop-blur-sm border rounded-lg shadow-lg px-4 py-2">
          <div className="text-sm text-gray-700 font-medium">
            ⌘ Shortcuts: M (Month) • W (Week) • D (Day) • T (Today) • ← →
            (Navigate)
          </div>
        </div>
      )}
    </div>
  );
}
