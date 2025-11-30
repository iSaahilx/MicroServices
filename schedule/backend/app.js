const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/db');
db.connect();

const scheduleRoutes = require('./routes/schedule.routes');
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3003',
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('morgan')('dev'));

// Routes
app.use('/api/schedules', scheduleRoutes);

app.get('/', (req, res) => {
    res.send('Schedule service is running. Use /api/schedules for data.');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'schedule-service' });
});

module.exports = app;

