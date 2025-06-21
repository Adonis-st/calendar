"use client";

import { useState } from "react";
import { CalendarEvent } from "@/types/calendar";
import { EventModal } from "./EventModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDesktop } from "@/hooks/useDesktop";
import { Popover, PopoverContent, PopoverAnchor } from "./ui/popover";

interface CellTapHandlerProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  currentDate: Date;
  view: "month" | "week" | "day";
  clickedPosition?: { x: number; y: number } | null;
}

export function CellTapHandler({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
  currentDate,
  view,
  clickedPosition,
}: CellTapHandlerProps) {
  const isDesktop = useDesktop();

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={onClose}>
        {clickedPosition && (
          <PopoverAnchor
            style={{
              position: "fixed",
              left: clickedPosition.x,
              top: clickedPosition.y,
            }}
          />
        )}
        <PopoverContent
          className="w-96 p-0"
          align="start"
          side="right"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <EventModal
            isOpen={isOpen}
            onClose={onClose}
            event={event}
            onSave={onSave}
            onDelete={onDelete}
            currentDate={currentDate}
            view={view}
            isPopover={true}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] max-h-[600px]">
        <SheetHeader className="pb-4">
          <SheetTitle>{event ? "Edit Event" : "Add Event"}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <EventModal
            isOpen={isOpen}
            onClose={onClose}
            event={event}
            onSave={onSave}
            onDelete={onDelete}
            currentDate={currentDate}
            view={view}
            isMobile={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
