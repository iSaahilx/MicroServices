import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import './CalendarView.css';

function CalendarView({ appointments, onEdit, onDelete }) {
  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, apt) => {
    const date = format(parseISO(apt.start_time), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(apt);
    return acc;
  }, {});

  const sortedDates = Object.keys(appointmentsByDate).sort();

  if (sortedDates.length === 0) {
    return (
      <div className="empty-state">
        <p>No appointments scheduled. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      {sortedDates.map(date => (
        <div key={date} className="date-section">
          <h2 className="date-header">
            {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="appointments-for-date">
            {appointmentsByDate[date].map(appointment => (
              <div key={appointment.id} className="calendar-appointment">
                <div className="appointment-time-range">
                  {format(parseISO(appointment.start_time), 'h:mm a')} - 
                  {format(parseISO(appointment.end_time), 'h:mm a')}
                </div>
                <div className="appointment-details">
                  <h4>{appointment.title}</h4>
                  {appointment.description && (
                    <p>{appointment.description}</p>
                  )}
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-actions">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(appointment)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(appointment.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CalendarView;

