import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AppointmentForm.css';

function AppointmentForm({ appointment, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    status: 'scheduled'
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title || '',
        description: appointment.description || '',
        start_time: appointment.start_time ? 
          new Date(appointment.start_time).toISOString().slice(0, 16) : '',
        end_time: appointment.end_time ? 
          new Date(appointment.end_time).toISOString().slice(0, 16) : '',
        status: appointment.status || 'scheduled'
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      });
      toast.success(appointment ? 'Appointment updated!' : 'Appointment created!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{appointment ? 'Edit Appointment' : 'Create New Appointment'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">Start Time *</label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_time">End Time *</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {appointment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;

