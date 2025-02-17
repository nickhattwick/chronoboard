import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getTasks } from '../api';
import './CalendarPage.css';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState({});

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

  const renderCalendar = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days.map((day) => (
      <Droppable key={day} droppableId={day}>
        {(provided) => (
          <div className="calendar-day" ref={provided.innerRef} {...provided.droppableProps}>
            <h3>{day}</h3>
            {calendarTasks[day] &&
              calendarTasks[day].map((task, index) => (
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="calendar">{renderCalendar()}</div>
      </DragDropContext>
    </div>
  );
};

export default CalendarPage;
