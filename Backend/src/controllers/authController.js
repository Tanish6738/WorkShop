const bcrypt = require("bcrypt");
const User = require("../models/User");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} = require("../auth/jwt");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return error(res, "VALIDATION_ERROR", "Missing fields", 400);
    const existing = await User.findOne({ email });
    if (existing)
      return error(res, "CONFLICT", "Email already registered", 409);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });
    return respond(
      res,
      { id: user._id, email: user.email, name: user.name },
      201
    );
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, "UNAUTHORIZED", "Invalid credentials", 401);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return error(res, "UNAUTHORIZED", "Invalid credentials", 401);
  const access = signAccessToken(user);
  const refresh = signRefreshToken(user);
  // Set both legacy 'token' and new 'accessToken' cookies for compatibility
  const accessOpts = { httpOnly: true, sameSite: 'lax', maxAge: 15 * 60 * 1000 };
  res.cookie('accessToken', access, accessOpts);
  res.cookie('token', access, accessOpts);
  res.cookie("refreshToken", refresh, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });
  return respond(res, { accessToken: access, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function me(req, res) {
  const user = req.user;
  return respond(res, {
    id: user._id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  });
}

async function updateMe(req, res) {
  try {
    const { name, avatarUrl, bio } = req.body;
    if (name !== undefined) req.user.name = name;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
    if (bio !== undefined) req.user.bio = bio;
    await req.user.save();
    return respond(res, {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
      bio: req.user.bio,
    });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!valid)
      return error(res, "UNAUTHORIZED", "Invalid current password", 401);
    req.user.passwordHash = await bcrypt.hash(newPassword, 12);
    await req.user.save();
    return respond(res, { changed: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return error(res, "UNAUTHORIZED", "Missing refresh token", 401);
    const payload = verifyToken(token, true);
    const user = await User.findById(payload.sub);
    if (!user) return error(res, "UNAUTHORIZED", "User not found", 401);
  const accessToken = signAccessToken(user);
  const accessOpts = { httpOnly: true, sameSite: 'lax', maxAge: 15 * 60 * 1000 };
  res.cookie('accessToken', accessToken, accessOpts);
  res.cookie('token', accessToken, accessOpts);
  return respond(res, { accessToken });
  } catch (e) {
    return error(res, "UNAUTHORIZED", "Invalid refresh token", 401);
  }
}

async function logout(_req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('token');
  res.clearCookie("refreshToken");
  return respond(res, { logout: true });
}

module.exports = {
  register,
  login,
  me,
  updateMe,
  changePassword,
  refresh,
  logout,
};
