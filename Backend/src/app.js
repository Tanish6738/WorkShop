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

// --- CORS CONFIG (custom to avoid silent preflight drops on some hosts) ---
const rawOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedOrigins = rawOrigins.length ? rawOrigins : ['http://localhost:5173'];
const wildcardVercel = /.vercel.app$/i;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const allowed = allowedOrigins.includes(origin) || wildcardVercel.test(origin);
    if (allowed) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

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