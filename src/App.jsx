import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskBoard from "./components/TaskBoard"

function App() {
  return (
    <div className="App">
      <TaskBoard />
    </div>
  );
}

export default App
