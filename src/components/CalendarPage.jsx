import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTasks, addTask, updateTask, getCalendarEvents, addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from '../api'; // Import updateCalendarEvent function
import './CalendarPage.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, eventId: null });
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
        const calendarEvents = await getCalendarEvents();
        const formattedEvents = calendarEvents.map((event) => {
          const task = tasks.find((task) => task.id === event.task_id);
          return {
            id: event.id.toString(),
            title: task ? task.title : 'Unknown Task',
            start: event.start,
            end: event.end,
            allDay: event.all_day,
            extendedProps: {
              description: task ? task.description : '',
              priority: task ? task.priority : 'Medium',
            },
          };
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu({ visible: false, x: 0, y: 0, eventId: null });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenuRef]);

  const handleAddTaskToServer = async (title) => {
    try {
      const newTask = {
        title,
        due_date: new Date().toISOString(),
        description: '',
        priority: 'low',
      };
      const addedTask = await addTask(newTask);
      setTasks([...tasks, addedTask]);
      const newEvent = {
        id: addedTask.id.toString(),
        title: addedTask.title,
        start: new Date(addedTask.due_date),
        allDay: false,
        extendedProps: {
          description: addedTask.description,
          priority: addedTask.priority,
        },
      };
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (selectedTask) {
      const newEvent = {
        id: selectedTask.id.toString(),
        title: selectedTask.title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: false,
        extendedProps: {
          description: selectedTask.description,
          priority: selectedTask.priority,
        },
      };
      setEvents([...events, newEvent]);
      setSelectedTask(null);
    } else {
      setShowModal(true);
    }
  };

  const handleEventDrop = async (eventDropInfo) => {
    const updatedEvent = {
      start: eventDropInfo.event.startStr,
      end: eventDropInfo.event.endStr,
      all_day: eventDropInfo.event.allDay,
    };
    try {
      await updateCalendarEvent(eventDropInfo.event.id, updatedEvent);
      const updatedEvents = events.map((event) =>
        event.id === eventDropInfo.event.id
          ? { ...event, start: eventDropInfo.event.startStr, end: eventDropInfo.event.endStr }
          : event
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
  };

  const handleEventResize = async (eventResizeInfo) => {
    const updatedEvent = {
      start: eventResizeInfo.event.startStr,
      end: eventResizeInfo.event.endStr,
      all_day: eventResizeInfo.event.allDay,
    };
    try {
      await updateCalendarEvent(eventResizeInfo.event.id, updatedEvent);
      const updatedEvents = events.map((event) =>
        event.id === eventResizeInfo.event.id
          ? { ...event, start: eventResizeInfo.event.startStr, end: eventResizeInfo.event.endStr }
          : event
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
  };

  const handleTaskAdd = (task) => {
    setSelectedTask(task);
  };

  const handleEventClick = (clickInfo) => {
    setContextMenu({
      visible: true,
      x: clickInfo.jsEvent.clientX,
      y: clickInfo.jsEvent.clientY,
      eventId: clickInfo.event.id,
    });
    clickInfo.jsEvent.preventDefault();
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteCalendarEvent(contextMenu.eventId);
      setEvents(events.filter((event) => event.id !== contextMenu.eventId));
      setContextMenu({ visible: false, x: 0, y: 0, eventId: null });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'task-list' && destination.droppableId === 'calendar') {
      const task = tasks.find((task) => task.id.toString() === result.draggableId);
      if (task) {
        handleTaskAdd(task);
      }
    }
  };

  const handleModalSubmit = async () => {
    const task = tasks.find((task) => task.title.toLowerCase() === searchTerm.toLowerCase());
    if (task && selectedDate && selectedTime) {
      const updatedTask = {
        ...task,
        due_date: `${selectedDate}T${selectedTime}`,
      };
      try {
        await updateTask(updatedTask.id, updatedTask);
        const newEvent = {
          task_id: updatedTask.id,
          start: updatedTask.due_date,
          end: updatedTask.due_date,
          all_day: false,
        };
        const addedEvent = await addCalendarEvent(newEvent);
        setEvents([...events, {
          id: addedEvent.id.toString(),
          title: updatedTask.title,
          start: updatedTask.due_date,
          allDay: false,
          extendedProps: {
            description: updatedTask.description,
            priority: updatedTask.priority,
          },
        }]);
        setShowModal(false);
        setSelectedTask(null);
        setSelectedDate('');
        setSelectedTime('');
        setSearchTerm('');
        // Reload tasks to ensure persistence
        const updatedTasks = await getTasks();
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  return (
    <div className="calendar-page">
      <h2>Calendar</h2>
      <button onClick={() => setShowModal(true)}>Add Task to Calendar</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select Task and Date/Time</h3>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              list="task-suggestions"
            />
            <datalist id="task-suggestions">
              {tasks.map((task) => (
                <option key={task.id} value={task.title} />
              ))}
            </datalist>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <button onClick={handleModalSubmit}>OK</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={handleDeleteEvent}
          ref={contextMenuRef}
        >
          Delete Event
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list" direction="horizontal">
          {(provided) => (
            <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
              <h3>Tasks</h3>
              <ul>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <button onClick={() => handleTaskAdd(task)}>{task.title}</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          select={handleDateSelect}
          events={events}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="85vh"
          contentHeight="auto"
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          scrollTime="08:00:00"
          nowIndicator={true}
          dayMaxEventRows={true}
          allDaySlot={false}
          views={{
            dayGridMonth: { height: '85vh', dayMaxEventRows: true, fixedWeekCount: true },
            timeGridWeek: { contentHeight: 'auto' },
            timeGridDay: { contentHeight: 'auto' },
          }}
        />
      </DragDropContext>
    </div>
  );
};

export default CalendarPage;