'use client';

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, isValid } from 'date-fns';
import { Dialog } from '@headlessui/react';

interface CalendarEvent {
  id: string;
  subject: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

// Dummy API functions (replace with actual implementations or mock data)
const fetchOutlookCalendarEvents = async (): Promise<CalendarEvent[]> => {
  // Replace with a real API call if needed
  return [
    {
      id: "1",
      subject: "Meeting with team",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
    },
  ];
};

const updateOutlookEvent = async (eventId: string, updatedEvent: Partial<CalendarEvent>) => {
  console.log(`Updated event ${eventId} with`, updatedEvent);
};

const deleteOutlookEvent = async (eventId: string) => {
  console.log(`Deleted event ${eventId}`);
};

export default function OutlookCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CalendarEvent>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Set hydrated to true after client-side rendering
  }, []);

  useEffect(() => {
    // Fetch events (no authentication required)
    fetchOutlookCalendarEvents()
      .then((fetchedEvents) => setEvents(fetchedEvents))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const nextMonth = () => setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
  const prevMonth = () => setCurrentMonth(addDays(startOfMonth(currentMonth), -1));
  const resetToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditForm({
      subject: event.subject,
      start: event.start,
      end: event.end,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedEvent) {
      await updateOutlookEvent(selectedEvent.id, editForm);
      setIsModalOpen(false);
      fetchOutlookCalendarEvents().then(setEvents);
    }
  };

  const handleDelete = async (eventId: string) => {
    await deleteOutlookEvent(eventId);
    setIsModalOpen(false);
    setSelectedEvent(null);
    fetchOutlookCalendarEvents().then(setEvents);
  };

  const renderCalendarCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter((event) =>
          isSameDay(new Date(event.start.dateTime), day)
        );

        const dynamicClasses = isHydrated
          ? `${isSameDay(day, selectedDate ?? new Date()) ? 'bg-blue-300' : ''}
             ${isToday(day) ? 'ring-2 ring-blue-500' : ''}`
          : '';

        days.push(
          <div
            className={`border p-1 cursor-pointer flex flex-col items-start h-24 w-full ${dynamicClasses} 
              ${!isSameMonth(day, currentMonth) ? 'text-gray-400 bg-gray-100' : ''}`}
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className="font-bold mb-2">{format(day, 'd')}</span>
            {dayEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="bg-blue-500 text-white text-xs truncate rounded px-1 mt-1 w-full">
                {isValid(new Date(event.start.dateTime))
                  ? format(new Date(event.start.dateTime), 'p')
                  : 'Invalid Date'}{' '}
                {event.subject}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="bg-gray-200 text-gray-600 text-xs rounded px-1 mt-1">
                +{dayEvents.length - 2}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderSelectedDayEvents = () => {
    const validDate = selectedDate ?? new Date();
    const dayEvents = events.filter((event) =>
      isSameDay(new Date(event.start.dateTime), validDate)
    );

    return (
      <div className="ml-4 p-4 border-l-2 border-gray-300">
        <h2 className="text-xl mb-2">Appointments for {format(validDate, 'MMMM d, yyyy')}:</h2>
        {dayEvents.length > 0 ? (
          <ul>
            {dayEvents.map((event) => (
              <li key={event.id} className="mb-2 border border-gray-300 p-2 rounded">
                <p className="font-semibold">
                  {isValid(new Date(event.start.dateTime))
                    ? format(new Date(event.start.dateTime), 'p')
                    : 'Invalid Date'}{' '}
                  - {event.subject}
                </p>
                <button
                  onClick={() => handleEventClick(event)}
                  className="mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments for this day.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-row space-x-4">
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-9 mb-4">
          <button onClick={prevMonth} className="bg-gray-300 p-2 rounded">←</button>
          <h1 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h1>
          <button onClick={nextMonth} className="bg-gray-300 p-2 rounded">→</button>
          <button onClick={resetToToday} className="bg-blue-500 text-white p-2 rounded ml-2">Today</button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        {renderCalendarCells()}
      </div>
      <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg">
        {isHydrated ? renderSelectedDayEvents() : <p>Loading appointments...</p>}
      </div>
    </div>
  );
}
