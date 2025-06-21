"use client";

import { useState, useEffect } from "react";
import { format, addHours } from "date-fns";
import { CalendarEvent, CalendarView } from "@/types/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  currentDate: Date;
  view: CalendarView;
  isMobile?: boolean;
  isPopover?: boolean;
}

const EVENT_COLORS = [
  { value: "#4285f4", label: "Blue" },
  { value: "#ea4335", label: "Red" },
  { value: "#fbbc04", label: "Yellow" },
  { value: "#34a853", label: "Green" },
  { value: "#ff6d01", label: "Orange" },
  { value: "#46bdc6", label: "Teal" },
  { value: "#7b1fa2", label: "Purple" },
  { value: "#d81b60", label: "Pink" },
];

export function EventModal({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
  currentDate,
  view,
  isMobile = false,
  isPopover = false,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState(EVENT_COLORS[0]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.start);
      setEndDate(event.end);
      setColor(
        EVENT_COLORS.find((c) => c.value === event.color) || EVENT_COLORS[0]
      );
    } else {
      setTitle("");
      setStartDate(currentDate);
      setEndDate(addHours(currentDate, 1));
      setColor(EVENT_COLORS[0]);
    }
  }, [event, currentDate, isOpen]);

  const handleSave = () => {
    const eventToSave: Omit<CalendarEvent, "id"> & { id?: string } = {
      title,
      start: startDate,
      end: endDate,
      color: color.value,
    };

    if (event?.id) {
      eventToSave.id = event.id;
    }

    onSave(eventToSave as CalendarEvent);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  const renderForm = () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setStartDate(
                new Date(e.target.value + "T" + format(startDate, "HH:mm:ss"))
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="time"
            value={format(startDate, "HH:mm")}
            onChange={(e) =>
              setStartDate(
                new Date(startDate.toDateString() + " " + e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setEndDate(
                new Date(e.target.value + "T" + format(endDate, "HH:mm:ss"))
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="time"
            value={format(endDate, "HH:mm")}
            onChange={(e) =>
              setEndDate(
                new Date(endDate.toDateString() + " " + e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Select
          value={color.value}
          onValueChange={(value) =>
            setColor(
              EVENT_COLORS.find((c) => c.value === value) || EVENT_COLORS[0]
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_COLORS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: c.value }}
                  />
                  {c.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {!isMobile && !isPopover ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">{renderForm()}</div>

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {event && onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {event ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : isPopover ? (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {event ? "Edit Event" : "Add Event"}
            </h3>
          </div>

          <div className="space-y-4">{renderForm()}</div>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {event && onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {event ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">{renderForm()}</div>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              {event && onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {event ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
