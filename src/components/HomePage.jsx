import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const HomePage = () => {
  return (
    <div>
      <Navigation />
      <h1>Welcome to ChronoBoard</h1>
      <ul>
        <li><Link to="/board">Board</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
        <li><Link to="/projects">Projects</Link></li>
      </ul>
    </div>
  );
};

export default HomePage;
