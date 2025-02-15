import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks, addTask } from "../api";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const task = { 
      title: newTaskTitle, 
      description: newTaskDescription, 
      status: "To Do", 
      priority, 
      due_date: newTaskDueDate 
    };
    const addedTask = await addTask(task);
    setTasks([...tasks, { ...task, id: addedTask.id }]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className={`task-board-container ${selectedTask ? "with-details" : ""}`}>
      <div className="task-board">
        <h2>ChronoBoard</h2>

        <input 
          value={newTaskTitle} 
          onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="Task title" 
        />
        <textarea 
          value={newTaskDescription} 
          onChange={(e) => setNewTaskDescription(e.target.value)} 
          placeholder="Task description"
        />
        <input 
          type="date" 
          value={newTaskDueDate} 
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">🔥 High</option>
          <option value="Medium">⚡ Medium</option>
          <option value="Low">🌱 Low</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board">
            {["To Do", "In Progress", "Done"].map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                    <h3>{status}</h3>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              className={`task-card ${task.priority ? task.priority.toLowerCase() : "medium"}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openTaskDetails(task)} // Open details when clicked
                            >
                              <strong>{task.title}</strong>
                              <p>{task.description}</p>
                              <p className="due-date">📅 {task.due_date || "No due date"}</p>
                              <p className={`priority ${task.priority.toLowerCase()}`}>Priority: {task.priority}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Task Details Panel */}
      {selectedTask && (
        <div className="task-details open">
          <button onClick={closeTaskDetails} className="close-button">✖</button>
          <h3>{selectedTask.title}</h3>
          <p><strong>Description:</strong> {selectedTask.description}</p>
          <p><strong>Due Date:</strong> {selectedTask.due_date || "No due date"}</p>
          <p><strong>Priority:</strong> {selectedTask.priority}</p>
          <textarea placeholder="Add notes..." />
        </div>
      )}
    </div>
  );
};

export default TaskBoard;