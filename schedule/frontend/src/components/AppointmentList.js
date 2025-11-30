import React from 'react';
import { format } from 'date-fns';
import './AppointmentList.css';

function AppointmentList({ appointments, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="empty-state">
        <p>No appointments scheduled. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map(appointment => (
        <div key={appointment.id} className="appointment-card">
          <div className="appointment-header">
            <h3>{appointment.title}</h3>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(appointment.status) }}
            >
              {appointment.status}
            </span>
          </div>
          
          {appointment.description && (
            <p className="appointment-description">{appointment.description}</p>
          )}
          
          <div className="appointment-time">
            <span>Start: {format(new Date(appointment.start_time), 'PPpp')}</span>
            <span>End: {format(new Date(appointment.end_time), 'PPpp')}</span>
          </div>
          
          <div className="appointment-actions">
            <button 
              className="btn btn-primary"
              onClick={() => onEdit(appointment)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => onDelete(appointment.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppointmentList;

