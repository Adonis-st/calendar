"use client";

import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Grid3X3,
  Clock,
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
}

export function CalendarToolbar({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onGoToToday,
}: CalendarToolbarProps) {
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
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToToday}
          className="text-sm"
        >
          Today
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
              </div>
            </SelectItem>
            <SelectItem value="week">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Week</span>
              </div>
            </SelectItem>
            <SelectItem value="day">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Day</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
