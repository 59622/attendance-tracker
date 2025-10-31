import React from 'react';

const AttendanceCard = ({ record, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      await onDelete(record.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`attendance-card ${record.status.toLowerCase()}`}>
      <div className="card-header">
        <h3>{record.employeeName}</h3>
        <span className={`status-badge ${record.status.toLowerCase()}`}>
          {record.status}
        </span>
      </div>
      
      <div className="card-body">
        <p><strong>Employee ID:</strong> {record.employeeID}</p>
        <p><strong>Date:</strong> {formatDate(record.date)}</p>
        <p><strong>Recorded:</strong> {new Date(record.timestamp).toLocaleString()}</p>
      </div>

      <div className="card-footer">
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Delete record"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default AttendanceCard;