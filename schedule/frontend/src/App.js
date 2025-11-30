import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './App.css';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import CalendarView from './components/CalendarView';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Configure axios to include token in requests
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromUrl}`;
      params.delete('token');
      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
      window.history.replaceState({}, '', newUrl);
      return;
    }

    const token =
      localStorage.getItem('token') ||
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1];

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/schedules`);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        alert('Please login first');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (appointmentData) => {
    try {
      const response = await axios.post(`${API_URL}/api/schedules`, appointmentData);
      setAppointments([...appointments, response.data.appointment]);
      setShowForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const handleUpdateAppointment = async (id, appointmentData) => {
    try {
      const response = await axios.put(`${API_URL}/api/schedules/${id}`, appointmentData);
      setAppointments(appointments.map(apt => 
        apt.id === id ? response.data.appointment : apt
      ));
      setShowForm(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/schedules/${id}`);
      setAppointments(appointments.filter(apt => apt.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Schedule Management</h1>
        <div className="header-actions">
          <button 
            className={`view-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            className={`view-btn ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setSelectedAppointment(null);
              setShowForm(true);
            }}
          >
            + New Appointment
          </button>
        </div>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : view === 'list' ? (
          <AppointmentList
            appointments={appointments}
            onEdit={handleEdit}
            onDelete={handleDeleteAppointment}
          />
        ) : (
          <CalendarView
            appointments={appointments}
            onEdit={handleEdit}
            onDelete={handleDeleteAppointment}
          />
        )}
      </main>

      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSubmit={selectedAppointment ? 
            (data) => handleUpdateAppointment(selectedAppointment.id, data) :
            handleCreateAppointment
          }
          onCancel={() => {
            setShowForm(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}

export default App;

