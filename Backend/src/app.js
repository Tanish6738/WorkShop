const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/db.js');

dotenv.config();
connectDB();

app.use(morgan('dev'));

// --- CORS CONFIG (using official cors middleware for reliable preflights) ---
// Supports a comma‑separated CLIENT_ORIGIN list and any *.vercel.app frontend deployments.
const rawOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const fallbackOrigins = ['http://localhost:5173'];
const staticAllowed = rawOrigins.length ? rawOrigins : fallbackOrigins;
const vercelRegex = /\.vercel\.app$/i;

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin like server-to-server (no origin header)
    if (!origin) return callback(null, true);
    if (staticAllowed.includes(origin) || vercelRegex.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 204, // some legacy browsers choke on 200 for preflight
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const apiResponse = require('./utils/apiResponse');
const { error } = apiResponse;

app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.get('/api/version', (_req, res) => res.json({ success: true, data: { version: process.env.APP_VERSION || '1.0.0' } }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/prompts', require('./routes/promptRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api', require('./routes/engagementRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => error(res, 'NOT_FOUND', 'Route not found', 404));
// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  return error(res, 'SERVER_ERROR', err.message || 'Internal error', 500);
});

module.exports = app;