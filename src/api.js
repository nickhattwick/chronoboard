const API_URL = "http://localhost:5001";

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
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