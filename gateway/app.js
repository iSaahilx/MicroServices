const express = require('express');
const expressProxy = require('express-http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3101';
const SCHEDULE_SERVICE_URL = process.env.SCHEDULE_SERVICE_URL || 'http://localhost:3002';
const AUTH_FRONTEND_URL = process.env.AUTH_FRONTEND_URL || 'http://localhost:3004';
const SCHEDULE_FRONTEND_URL = process.env.SCHEDULE_FRONTEND_URL || 'http://localhost:3003';

app.use('/user', expressProxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/users${req.url}`
}));
app.use('/schedule', expressProxy(SCHEDULE_SERVICE_URL));
app.use(
    '/auth-ui',
    createProxyMiddleware({
        target: AUTH_FRONTEND_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/auth-ui': '' }
    })
);
app.use(
    '/schedule-ui',
    createProxyMiddleware({
        target: SCHEDULE_FRONTEND_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/schedule-ui': '' }
    })
);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        services: [
            { path: '/user', target: USER_SERVICE_URL },
            { path: '/schedule', target: SCHEDULE_SERVICE_URL },
            { path: '/auth-ui', target: AUTH_FRONTEND_URL },
            { path: '/schedule-ui', target: SCHEDULE_FRONTEND_URL }
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});