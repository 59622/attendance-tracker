import React from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceForm from '../components/AttendanceForm';

const AttendanceFormPage = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Mark Employee Attendance</h2>
        <p>Record daily attendance for employees</p>
        <button 
          className="secondary-btn"
          onClick={goToDashboard}
        >
          View Attendance Dashboard
        </button>
      </div>

      <div className="page-content">
        <AttendanceForm />
      </div>
    </div>
  );
};

export default AttendanceFormPage;