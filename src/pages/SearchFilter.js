import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceAPI } from '../services/api';

const AttendanceForm = ({ onAttendanceAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await attendanceAPI.create(formData);
      
      setMessage({
        type: 'success',
        text: response.data.message
      });

      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });

      // Notify parent component
      if (onAttendanceAdded) {
        onAttendanceAdded();
      }

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to record attendance'
      });
    } finally {
      setLoading(false);
    }
  };

  const viewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="attendance-form-container">
      <div className="attendance-form-card">
        <h3>Record New Attendance</h3>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name *</label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employeeID">Employee ID *</label>
            <input
              type="text"
              id="employeeID"
              name="employeeID"
              value={formData.employeeID}
              onChange={handleChange}
              required
              placeholder="Enter employee ID"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Attendance Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Attendance'}
            </button>
            
            <button 
              type="button"
              className="secondary-btn"
              onClick={viewDashboard}
              disabled={loading}
            >
              View Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;