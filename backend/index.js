const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5001;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Database setup
const db = new sqlite3.Database("./data.db", (err) => {
  if (err) console.error("Database connection failed", err);
  else console.log("Connected to SQLite");
});

// Create table for tasks
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  due_date TEXT,
  time_spent INTEGER DEFAULT 0
)`);

// Create table for calendar events
db.run(`CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER,
  start TEXT,
  end TEXT,
  all_day BOOLEAN,
  FOREIGN KEY(task_id) REFERENCES tasks(id)
)`);

// API to get tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else {
      // Ensure every task has a priority
      const tasksWithPriority = rows.map(task => ({
        ...task,
        priority: task.priority || "Medium"
      }));
      res.json(tasksWithPriority);
    }
  });
});

// API to get tasks with due dates
app.get("/tasks/with-due-dates", (req, res) => {
  db.all("SELECT * FROM tasks WHERE due_date IS NOT NULL", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// API to update task status
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run("UPDATE tasks SET status = ? WHERE id = ?", [status, id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Task updated successfully" });
  });
});

// API to update task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  db.run(
    "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?",
    [title, description, status, priority, due_date, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: "Task updated successfully" });
    }
  );
});

// API to update time spent on a task
app.patch("/tasks/:id/time", (req, res) => {
  const { id } = req.params;
  const { time_spent } = req.body;

  db.run("UPDATE tasks SET time_spent = ? WHERE id = ?", [time_spent, id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Time spent updated successfully" });
  });
});

// API to add task
app.post("/tasks", (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  const validPriority = ["High", "Medium", "Low"].includes(priority) ? priority : "Medium";

  db.run(
    "INSERT INTO tasks (title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?)",
    [title, description || "", status, validPriority, due_date || "No due date"],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

// API to get calendar events
app.get("/calendar-events", (req, res) => {
  db.all("SELECT * FROM calendar_events", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// API to add calendar event
app.post("/calendar-events", (req, res) => {
  const { task_id, start, end, all_day } = req.body;

  db.run(
    "INSERT INTO calendar_events (task_id, start, end, all_day) VALUES (?, ?, ?, ?)",
    [task_id, start, end, all_day],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

// API to update calendar event
app.put("/calendar-events/:id", (req, res) => {
  const { id } = req.params;
  const { start, end, all_day } = req.body;

  db.run(
    "UPDATE calendar_events SET start = ?, end = ?, all_day = ? WHERE id = ?",
    [start, end, all_day, id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: "Calendar event updated successfully" });
    }
  );
});

// API to delete calendar event
app.delete("/calendar-events/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM calendar_events WHERE id = ?", [id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Calendar event deleted successfully" });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
