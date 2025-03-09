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

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  return response.json();
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

// Project-related API functions

export const getProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const addProject = async (project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  return response.json();
};

export const updateProject = async (projectId, updatedProject) => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
  });
  return response.json();
};

// Add projectId to task-related API functions

export const addTaskWithProject = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return response.json();
};

export const updateTaskWithProject = async (taskId, updatedTask) => {
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

// Add API functions for fetching tasks by project

export const getTasksByProject = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/tasks/by-project/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching tasks by project:', error);
    return [];
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    return null;
  }
};

// Add a new syncDueDates function to call the /calendar/sync-due-dates API route
export const syncDueDates = async () => {
  try {
    const response = await fetch(`${API_URL}/calendar/sync-due-dates`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error syncing due dates:', error);
    throw error;
  }
};
