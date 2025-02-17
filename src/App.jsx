import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TaskBoard from './components/TaskBoard';
import CalendarPage from './components/CalendarPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/board" element={<TaskBoard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        {/* Add other routes here */}
      </Routes>
    </div>
  );
}

export default App;
