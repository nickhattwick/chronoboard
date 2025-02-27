import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getTasks } from '../api';
import './CalendarPage.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getTasks().then((tasks) => {
      const formattedEvents = tasks.map((task) => ({
        id: task.id.toString(),
        title: task.title,
        start: task.due_date ? new Date(task.due_date) : new Date(),
        allDay: false,
        extendedProps: {
          description: task.description,
          priority: task.priority,
        },
      }));
      setEvents(formattedEvents);
    });
  }, []);

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Enter a title for your task:');
    if (title) {
      let newEvent = {
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: false,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventDrop = (eventDropInfo) => {
    const updatedEvents = events.map((event) =>
      event.id === eventDropInfo.event.id
        ? { ...event, start: eventDropInfo.event.startStr }
        : event
    );
    setEvents(updatedEvents);
  };

  return (
    <div className="calendar-page">
      <h2>Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={true}
        selectable={true}
        select={handleDateSelect}
        events={events}
        eventDrop={handleEventDrop}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="85vh" /* Keeps the calendar large */
        contentHeight="auto"
        slotMinTime="00:00:00" /* Allows scrolling up to midnight */
        slotMaxTime="24:00:00" /* Allows scrolling down to midnight */
        scrollTime="08:00:00" /* Default scroll to 8 AM */
        nowIndicator={true} /* Shows red "current time" line */
        dayMaxEventRows={true} /* Ensures multiple events per row */
        allDaySlot={false} /* Removes unnecessary "All-day" row */
        views={{
          dayGridMonth: { height: '85vh', dayMaxEventRows: true, fixedWeekCount: true },
          timeGridWeek: { contentHeight: 'auto' },
          timeGridDay: { contentHeight: 'auto' },
        }}
      />
    </div>
  );
};

export default CalendarPage;