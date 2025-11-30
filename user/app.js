const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const db = require('./db/db');
db.connect();

const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
});

module.exports = app;