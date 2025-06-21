# Google Calendar Clone

A full-featured calendar UI component similar to Google Calendar, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 📅 Multiple Views

- **Month View**: Traditional calendar grid showing all days of the month
- **Week View**: Detailed weekly schedule with hourly time slots
- **Day View**: Single day view with detailed hourly breakdown

### 🎯 Event Management

- **View Events**: Display events with start/end times and titles
- **Add Events**: Click on any time slot to create new events
- **Edit Events**: Click on existing events to modify details
- **Delete Events**: Remove events with confirmation
- **Color Coding**: Choose from 8 different event colors

### 🖱️ Drag & Drop

- **Reschedule Events**: Drag events to different time slots
- **Smooth Interactions**: Powered by dnd-kit for smooth drag and drop
- **Visual Feedback**: Real-time preview during drag operations

### 🎨 Modern UI

- **Clean Design**: Modern, clean interface inspired by Google Calendar
- **Responsive**: Works on desktop and mobile devices
- **Current Time Indicator**: Red line showing current time in day/week views
- **Today Highlighting**: Current day is highlighted across all views

### 🧭 Navigation

- **Date Navigation**: Navigate between months, weeks, and days
- **Today Button**: Quick jump to current date
- **View Switching**: Seamlessly switch between month, week, and day views

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Drag & Drop**: dnd-kit
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Run the development server**:

   ```bash
   pnpm dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Basic Navigation

- Use the arrow buttons to navigate between periods
- Click "Today" to jump to the current date
- Use the view selector to switch between Month, Week, and Day views

### Managing Events

- **Add Event**: Click on any time slot or day cell
- **Edit Event**: Click on an existing event
- **Delete Event**: Use the delete button in the event modal
- **Drag Event**: Click and drag events to reschedule them

### Event Details

- **Title**: Required field for event name
- **Start Date/Time**: When the event begins
- **End Date/Time**: When the event ends
- **Color**: Choose from 8 predefined colors

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page with Calendar component
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Calendar.tsx         # Main calendar component
│   ├── CalendarToolbar.tsx  # Navigation and view controls
│   ├── MonthView.tsx        # Monthly calendar grid
│   ├── WeekView.tsx         # Weekly schedule view
│   ├── DayView.tsx          # Daily detailed view
│   └── EventModal.tsx       # Event creation/editing modal
└── types/
    └── calendar.ts          # TypeScript type definitions
```

## Local State Management

The calendar uses React's built-in state management with `useState` hooks for:

- Current date and view
- Events array
- Modal state
- Selected event for editing

All data is stored in local state and persists during the session. For production use, you would want to integrate with a backend API or database.

## Customization

### Adding New Event Colors

Edit the `EVENT_COLORS` array in `src/components/Calendar.tsx` and `src/components/EventModal.tsx`.

### Modifying Time Slots

Adjust the time slot height by modifying the `.h-15` class in `src/app/globals.css`.

### Styling Changes

All styling is done with Tailwind CSS classes. The design system uses shadcn/ui components for consistency.

## Future Enhancements

- [ ] Event recurrence (daily, weekly, monthly)
- [ ] Event categories and filtering
- [ ] Multi-day events
- [ ] Event sharing and collaboration
- [ ] Calendar export/import
- [ ] Dark mode support
- [ ] Mobile-optimized interactions
- [ ] Backend integration for data persistence

## Contributing

Feel free to submit issues and enhancement requests!
