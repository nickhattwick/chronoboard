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

// API to update task status
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run("UPDATE tasks SET status = ? WHERE id = ?", [status, id], function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Task updated successfully" });
  });
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
