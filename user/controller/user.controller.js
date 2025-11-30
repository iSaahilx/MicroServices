const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const COOKIE_MAX_AGE = 60 * 60 * 1000; // 1 hour
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE
};

function sanitizeUser(userDoc) {
    return {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email
    };
}

function generateToken(userDoc) {
    return jwt.sign(
        { id: userDoc._id, email: userDoc.email, name: userDoc.name },
        process.env.JWT_SECRET || 'change-me',
        { expiresIn: TOKEN_EXPIRES_IN }
    );
}

function getTokenFromRequest(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return req.cookies?.token;
}

function setAuthCookie(res, token) {
    res.cookie('token', token, COOKIE_OPTIONS);
}

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(newUser);
        setAuthCookie(res, token);

        res.status(201).json({
            message: 'User created successfully',
            user: sanitizeUser(newUser),
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        setAuthCookie(res, token);

        res.json({
            message: 'Logged in successfully',
            user: sanitizeUser(user),
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports.verify = async (req, res) => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({ user: sanitizeUser(user) });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Logged out successfully' });
};