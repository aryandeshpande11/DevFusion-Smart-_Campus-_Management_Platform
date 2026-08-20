// wires up express: global middleware, route mounting, and the final error handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const clubRoutes = require('./routes/clubRoutes');
const placementRoutes = require('./routes/placementRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Render (and most PaaS hosts) sit behind a reverse proxy, so Express needs
// this to trust the X-Forwarded-For header — otherwise express-rate-limit
// can't reliably tell users apart and logs a warning on every request.
app.set('trust proxy', 1);

// security + parsing middleware
app.use(helmet());
// CLIENT_URL can be a single origin or a comma-separated list (e.g. your
// stable production domain plus a staging one). Any *.vercel.app origin is
// allowed on top of that automatically, since Vercel mints a new URL per
// deployment and we don't want to update this env var on every redeploy.
const allowedOrigins = env.clientUrl.split(',').map((url) => url.trim());

app.use(
    cors({
        origin(origin, callback) {
            // no origin header = server-to-server or curl/Postman, not a browser — allow it
            if (!origin) return callback(null, true);

            const isExplicitlyAllowed = allowedOrigins.includes(origin);
            const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

            if (isExplicitlyAllowed || isVercelPreview) return callback(null, true);
            return callback(new Error(`CORS: origin ${origin} is not allowed`));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// health check for render/uptime monitors
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// feature routes, each module owns its own auth/rbac inside its router
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// unmatched routes fall here
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// must be last - catches every error passed via next(err) or catchAsync
app.use(errorHandler);

module.exports = app;