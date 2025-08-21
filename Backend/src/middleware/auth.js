const { verifyToken } = require('../auth/jwt');
const User = require('../models/User');
const { error } = require('../utils/apiResponse');

async function requireAuth(req, res, next) {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.token || req.cookies.accessToken; // fallback cookie names
  }
  if (!token) return error(res, 'UNAUTHORIZED', 'Missing token', 401);
  try {
    const payload = verifyToken(token);
    const userId = payload.sub || payload.id;
    if (!userId) return error(res, 'UNAUTHORIZED', 'Invalid token payload', 401);
    const user = await User.findById(userId);
    if (!user) return error(res, 'UNAUTHORIZED', 'User not found', 401);
    req.user = user;
    next();
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('Token verify failed:', e.message);
    return error(res, 'UNAUTHORIZED', 'Invalid token', 401);
  }
}

function optionalAuth(req, _res, next) {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  else if (req.cookies) token = req.cookies.token || req.cookies.accessToken;
  if (token) {
    try {
      const payload = verifyToken(token);
      req.user = { _id: payload.sub || payload.id };
    } catch (e) { /* ignore invalid */ }
  }
  next();
}

function requireOwnerOrAdmin(modelGetter) {
  return async function (req, res, next) {
    try {
      const doc = await modelGetter(req);
      if (!doc) return error(res, 'NOT_FOUND', 'Resource not found', 404);
      if (doc.createdBy?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return error(res, 'FORBIDDEN', 'Not allowed', 403);
      }
      req.resource = doc;
      next();
    } catch (e) {
      return error(res, 'SERVER_ERROR', e.message, 500);
    }
  };
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return error(res, 'FORBIDDEN', 'Admin only', 403);
  if (req.user.banned) return error(res, 'FORBIDDEN', 'User banned', 403);
  next();
}

function rejectIfBanned(req, res, next) {
  if (req.user?.banned) return error(res, 'FORBIDDEN', 'Account banned', 403);
  next();
}

module.exports = { requireAuth, optionalAuth, requireOwnerOrAdmin, requireAdmin, rejectIfBanned };
