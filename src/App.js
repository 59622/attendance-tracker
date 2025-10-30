import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AttendanceFormPage from './pages/AttendanceFormPage';
import AttendanceDashboardPage from './pages/AttendanceDashboardPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<AttendanceFormPage />} />
            <Route path="/dashboard" element={<AttendanceDashboardPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 employee attendance tracker. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;