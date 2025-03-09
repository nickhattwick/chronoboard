import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getTasks, addTask, updateTaskTimeSpent, getProjects, getTasksByProject, getProjectById, deleteTask, updateTask, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from "../api";

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
  const [isEditing, setIsEditing] = useState(false);

  const [projectDetails, setProjectDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  const [dueDateFilter, setDueDateFilter] = useState(() => {
    return localStorage.getItem("dueDateFilter") || "All Tasks";
  });

  useEffect(() => {
    getProjects().then(setProjects);
    
    if (projectIdFromUrl) {
      setFilterProject(projectIdFromUrl);
      getProjectById(projectIdFromUrl).then(setProjectDetails);
      getTasksByProject(projectIdFromUrl).then(setTasks);
    } else {
      getTasks().then(setTasks);
    }
  }, [projectIdFromUrl]);

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

  useEffect(() => {
    localStorage.setItem("dueDateFilter", dueDateFilter);
  }, [dueDateFilter]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    const task = { 
      title: newTaskTitle, 
      description: newTaskDescription, 
      status: "To Do", 
      priority, 
      due_date: newTaskDueDate,
      projectId: projectIdFromUrl || selectedProject // Default to project from URL if available
    };
    const addedTask = await addTask(task);
    setTasks([...tasks, { ...task, id: addedTask.id }]);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate("");
    setSelectedProject("");

    if (newTaskDueDate) {
      const newEvent = {
        task_id: addedTask.id,
        start: newTaskDueDate,
        end: newTaskDueDate,
        all_day: true,
      };
      await addCalendarEvent(newEvent);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
    setSelectedTask(null);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    const updatedTask = { 
      ...selectedTask, 
      title: newTaskTitle, 
      description: newTaskDescription, 
      priority, 
      due_date: newTaskDueDate 
    };
    await updateTask(selectedTask.id, updatedTask);
    setTasks(tasks.map((task) => (task.id === selectedTask.id ? updatedTask : task)));
    setSelectedTask(updatedTask);
    setIsEditing(false);

    if (newTaskDueDate) {
      const newEvent = {
        task_id: selectedTask.id,
        start: newTaskDueDate,
        end: newTaskDueDate,
        all_day: true,
      };
      await updateCalendarEvent(selectedTask.id, newEvent);
    } else {
      await deleteCalendarEvent(selectedTask.id);
    }
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

  const startEditing = () => {
    setIsEditing(true);
    setNewTaskTitle(selectedTask.title);
    setNewTaskDescription(selectedTask.description);
    setNewTaskDueDate(selectedTask.due_date);
    setPriority(selectedTask.priority);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const filterTasksByDueDate = (tasks) => {
    const now = new Date();
    switch (dueDateFilter) {
      case "Next 7 Days":
        return tasks.filter((task) => {
          const dueDate = new Date(task.due_date);
          return dueDate >= now && dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        });
      case "Next 14 Days":
        return tasks.filter((task) => {
          const dueDate = new Date(task.due_date);
          return dueDate >= now && dueDate <= new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        });
      case "Next 30 Days":
        return tasks.filter((task) => {
          const dueDate = new Date(task.due_date);
          return dueDate >= now && dueDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        });
      case "Next 90 Days":
        return tasks.filter((task) => {
          const dueDate = new Date(task.due_date);
          return dueDate >= now && dueDate <= new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        });
      case "All Tasks":
      default:
        return tasks;
    }
  };

  return (
    <div className={`task-board-container ${selectedTask ? "with-details" : ""}`}>
      
      {projectDetails && (
        <div className="project-header">
          <h2>{projectDetails.title}</h2>
          <p>{projectDetails.description}</p>
        </div>
      )}

      <div className="task-board">
        <h2>{projectDetails ? projectDetails.title : "ChronoBoard"}</h2>

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
        
        {!projectIdFromUrl && (
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        )}

        <button onClick={handleAddTask}>Add Task</button>

        <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.title}</option>
          ))}
        </select>

        <select value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)}>
          <option value="All Tasks">All Tasks</option>
          <option value="Next 7 Days">Next 7 Days</option>
          <option value="Next 14 Days">Next 14 Days</option>
          <option value="Next 30 Days">Next 30 Days</option>
          <option value="Next 90 Days">Next 90 Days</option>
        </select>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="board" style={{ overflowY: 'scroll', maxHeight: '70vh' }}>
            {["To Do", "In Progress", "Done"].map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                    <h3>{status}</h3>
                    {filterTasksByDueDate(tasks)
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openTaskDetails(task)}
                            >
                              <strong>{task.title}</strong>
                              <p>{task.description}</p>
                              <p className="due-date">📅 {task.due_date || "No due date"}</p>
                              <p className="priority">Priority: {task.priority}</p>
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

      {selectedTask && (
        <div className="task-details open">
          <button onClick={closeTaskDetails} className="close-button">✖</button>
          {isEditing ? (
            <>
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
              <button onClick={handleUpdateTask}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{selectedTask.title}</h3>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Due Date:</strong> {selectedTask.due_date || "No due date"}</p>
              <p><strong>Priority:</strong> {selectedTask.priority}</p>
              <button onClick={startEditing}>Edit</button>
              <button onClick={() => handleDeleteTask(selectedTask.id)}>Delete Task</button>
            </>
          )}
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
