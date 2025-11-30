const jwt = require('jsonwebtoken');
const axios = require('axios');

// Middleware to authenticate JWT tokens
async function authenticateToken(req, res, next) {
    try {
        if (process.env.DISABLE_AUTH === 'true') {
            req.user = { id: process.env.DEMO_USER_ID || 'demo-user' };
            return next();
        }
        // Get token from header or cookie
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1] || req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        // Verify token with user service
        const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001';
        
        try {
            const response = await axios.get(`${userServiceUrl}/api/users/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data && response.data.user) {
                req.user = response.data.user;
                next();
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            // If user service is not available, try to verify locally
            // This is a fallback - in production, you should always verify with user service
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { authenticateToken };

