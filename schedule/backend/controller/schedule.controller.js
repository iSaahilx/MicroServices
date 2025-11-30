const Appointment = require('../models/appointment.model');
const axios = require('axios');

// Middleware to verify user token with user service
async function verifyUserToken(token) {
    try {
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
        const response = await axios.get(`${userServiceUrl}/api/users/verify`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}

module.exports.getAppointments = async (req, res) => {
    try {
        const user_id = req.user.id;
        const appointments = await Appointment.findByUserId(user_id);
        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify the appointment belongs to the user
        if (appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ appointment });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.createAppointment = async (req, res) => {
    try {
        const { title, description, start_time, end_time, status } = req.body;
        
        // Validation
        if (!title || !start_time || !end_time) {
            return res.status(400).json({ message: 'Title, start_time, and end_time are required' });
        }

        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        const appointmentData = {
            user_id: req.user.id,
            title,
            description,
            start_time,
            end_time,
            status: status || 'scheduled'
        };

        const appointment = await Appointment.create(appointmentData);
        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify the appointment belongs to the user
        if (appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedAppointment = await Appointment.update(id, req.body);
        res.json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify the appointment belongs to the user
        if (appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Appointment.delete(id);
        res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.getAppointmentsByRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        const user_id = req.user.id;
        
        const appointments = await Appointment.findByDateRange(startDate, endDate);
        // Filter by user_id
        const userAppointments = appointments.filter(apt => apt.user_id === user_id);
        
        res.json({ appointments: userAppointments });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

