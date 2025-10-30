import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import AttendanceCard from '../pages/AttendanceCard';      
import SearchFilter from '../pages/SearchFilter';         

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  const loadRecords = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getFiltered(filterParams);
      setRecords(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load attendance records');
      console.error('Error loading records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleDeleteRecord = async (id) => {
    try {
      await attendanceAPI.delete(id);
      loadRecords(filters);
    } catch (err) {
      setError('Failed to delete record');
      console.error('Error deleting record:', err);
    }
  };

  const stats = {
    total: records.length,
    present: records.filter(r => r.status === 'Present').length,
    absent: records.filter(r => r.status === 'Absent').length
  };

  return (
    <div className="attendance-dashboard">
      {/* Statistics Section */}
      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total Records</h3>
          <span className="stat-number">{stats.total}</span>
        </div>
        <div className="stat-card present">
          <h3>Present</h3>
          <span className="stat-number">{stats.present}</span>
        </div>
        <div className="stat-card absent">
          <h3>Absent</h3>
          <span className="stat-number">{stats.absent}</span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <SearchFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading and Error States */}
      {loading && <div className="loading">Loading attendance records...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Records Section */}
      {!loading && (
        <div className="records-container">
          <h3>Attendance Records ({records.length})</h3>
          
          {records.length === 0 ? (
            <div className="no-records">
              No attendance records found
            </div>
          ) : (
            <div className="records-grid">
              {records.map(record => (
                <AttendanceCard 
                  key={record.id} 
                  record={record} 
                  onDelete={handleDeleteRecord}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;