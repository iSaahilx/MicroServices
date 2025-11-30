const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/schedule.controller');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all appointments for the authenticated user
router.get('/', scheduleController.getAppointments);

// Get a specific appointment
router.get('/:id', scheduleController.getAppointment);

// Create a new appointment
router.post('/', scheduleController.createAppointment);

// Update an appointment
router.put('/:id', scheduleController.updateAppointment);

// Delete an appointment
router.delete('/:id', scheduleController.deleteAppointment);

// Get appointments by date range
router.get('/range/:startDate/:endDate', scheduleController.getAppointmentsByRange);

module.exports = router;

