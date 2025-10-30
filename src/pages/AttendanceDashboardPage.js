import React from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceDashboard from '../components/AttendanceDashboard';

const AttendanceDashboardPage = () => {
  const navigate = useNavigate();

  const goToForm = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      {/* HEADER SECTION */}
      <div className="page-header">
        <h2>Attendance Records Dashboard</h2>
        <p>View and manage all attendance records</p>
        <button 
          className="secondary-btn"
          onClick={goToForm}
        >
         Mark New Attendance
        </button>
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="page-content">
        <AttendanceDashboard />
      </div>
    </div>
  );
};

export default AttendanceDashboardPage;