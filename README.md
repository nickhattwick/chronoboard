# ChronoBoard

## Overview
ChronoBoard is a task management and calendar application designed to help users organize their tasks, projects, and events efficiently. It provides a user-friendly interface to manage tasks, track time spent, and visualize tasks on a calendar.

## Key Features
- Task Management: Create, update, and delete tasks with descriptions, due dates, and priorities.
- Project Management: Organize tasks into projects and manage them separately.
- Calendar Integration: Visualize tasks on a calendar and sync due dates.
- Drag and Drop: Easily move tasks between different statuses using drag and drop.
- Time Tracking: Track time spent on tasks and save the time logs.
- Responsive Design: User-friendly interface that works on both desktop and mobile devices.

## Installation Instructions
To set up the app locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/nickhattwick/chronoboard.git
   cd chronoboard
   ```

2. Install dependencies for the frontend:
   ```bash
   npm install
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Start the backend server:
   ```bash
   cd backend
   node index.js
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

6. Open the link provided by `npm run dev` to access the app.

## Usage
1. **Home Page**: The home page provides quick access to the task board, calendar, and projects.
2. **Task Board**: Create, update, and manage tasks. Drag and drop tasks between different statuses (To Do, In Progress, Done).
3. **Calendar**: Visualize tasks on a calendar. Add tasks to specific dates and sync due dates.
4. **Projects**: Organize tasks into projects and manage them separately.

## Tech Stack
- **Frontend**: React, Vite, FullCalendar, React Router
- **Backend**: Node.js, Express, SQLite
- **Styling**: CSS, CSS Modules

## Contributing
We welcome contributions from the community! If you would like to contribute, please follow these guidelines:

1. Fork the repository and create a new branch for your feature or bugfix.
2. Make your changes and ensure that the code is well-documented and follows the project's coding standards.
3. Submit a pull request with a clear description of your changes.

## Future Enhancements
- Add user authentication and authorization.
- Implement notifications and reminders for tasks.
- Improve the user interface and user experience.
- Add more advanced filtering and sorting options for tasks.
- Integrate with external calendar services (e.g., Google Calendar).
