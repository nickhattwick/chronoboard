const API_URL = "http://localhost:5001";

export const getTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const addTask = async (task) => {
  const response = await fetch(`http://localhost:5001/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return response.json();
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const response = await fetch(`http://localhost:5001/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  });
  return response.json();
};

export const updateTaskTimeSpent = async (taskId, timeSpent) => {
  const response = await fetch(`http://localhost:5001/tasks/${taskId}/time`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time_spent: timeSpent }),
  });
  return response.json();
};

export const updateTask = async (taskId, updatedTask) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const getCalendarEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/calendar-events`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

export const addCalendarEvent = async (event) => {
  const response = await fetch(`${API_URL}/calendar-events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  return response.json();
};

export const updateCalendarEvent = async (eventId, updatedEvent) => {
  try {
    const response = await fetch(`${API_URL}/calendar-events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (eventId) => {
  const response = await fetch(`${API_URL}/calendar-events/${eventId}`, {
    method: "DELETE",
  });
  return response.json();
};
