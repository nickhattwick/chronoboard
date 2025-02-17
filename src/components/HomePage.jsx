import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to ChronoBoard</h1>
      <div className="home-buttons">
        <Link to="/board">Board</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/projects">Projects</Link>
      </div>
    </div>
  );
};

export default HomePage;