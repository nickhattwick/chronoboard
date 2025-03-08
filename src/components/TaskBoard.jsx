import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks, addTask, updateTaskTimeSpent, getProjects, getTasksByProject } from "../api";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedTask, setSelectedTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [filterProject, setFilterProject] = useState("");

  useEffect(() => {
    getTasks().then(setTasks);
    getProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (selectedTask) {
      setTimer(selectedTask.time_spent || 0);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (filterProject) {
      getTasksByProject(filterProject).then(setTasks);
    } else {
      getTasks().then(setTasks);
    }
  }, [filterProject]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const task = { 
      title: newTaskTitle, 
      description: newTaskDescription, 
      status: "To Do", 
      priority, 
      due_date: newTaskDueDate,
      projectId: selectedProject
    };
    const addedTask = await addTask(task);
    setTasks([...tasks, { ...task, id: addedTask.id }]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setSelectedProject("");
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
    clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
    setIsRunning(false);
  };

  const saveTimeSpent = async () => {
    if (selectedTask) {
      await updateTaskTimeSpent(selectedTask.id, timer);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, time_spent: timer } : task
        )
      );
    }
  };

  useEffect(() => {
    if (!isRunning) {
      saveTimeSpent();
    }
  }, [isRunning]);

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
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>
        <button onClick={handleAddTask}>Add Task</button>

        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>

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
          <div>
            <h4>Time Spent: {Math.floor(timer / 60)}m {timer % 60}s</h4>
            <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={resetTimer}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
