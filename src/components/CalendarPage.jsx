import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTasks } from '../api';
import './CalendarPage.css';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState({});
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      return;
    }

    const updatedCalendarTasks = { ...calendarTasks };
    const task = tasks.find((task) => task.id.toString() === result.draggableId);

    if (task) {
      if (!updatedCalendarTasks[destination.droppableId]) {
        updatedCalendarTasks[destination.droppableId] = [];
      }
      updatedCalendarTasks[destination.droppableId].push(task);
      setCalendarTasks(updatedCalendarTasks);
    }
  };

  const getCurrentWeek = () => {
    const currentDate = new Date();
    const startOfWeek = currentDate.getDate() - currentDate.getDay();
    const endOfWeek = startOfWeek + 6;
    const days = [];

    for (let i = startOfWeek; i <= endOfWeek; i++) {
      const date = new Date(currentDate.setDate(i));
      days.push(date.toDateString());
    }

    return days;
  };

  const goToNextWeek = () => {
    const nextWeek = currentWeek.map((date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate.toDateString();
    });
    setCurrentWeek(nextWeek);
  };

  const goToPreviousWeek = () => {
    const previousWeek = currentWeek.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 7);
      return prevDate.toDateString();
    });
    setCurrentWeek(previousWeek);
  };

  const renderCalendar = () => {
    return currentWeek.map((date, index) => (
      <Droppable key={date} droppableId={date}>
        {(provided) => (
          <div className="calendar-day" ref={provided.innerRef} {...provided.droppableProps}>
            <h3>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]} - {date}</h3>
            {calendarTasks[date] &&
              calendarTasks[date].map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      className="calendar-task"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                      <p className="due-date">📅 {task.due_date || 'No due date'}</p>
                      <p className={`priority ${task.priority.toLowerCase()}`}>Priority: {task.priority}</p>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ));
  };

  return (
    <div className="calendar-page">
      <h2>Calendar</h2>
      <div className="calendar-navigation">
        <button onClick={goToPreviousWeek}>Previous Week</button>
        <button onClick={goToNextWeek}>Next Week</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar">{renderCalendar()}</div>
      </DragDropContext>
    </div>
  );
};

export default CalendarPage;
