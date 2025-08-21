const jwt = require('jsonwebtoken');

const signAccessToken = (user) => {
  return jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const signRefreshToken = (user) => {
  return jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token, refresh = false) => {
  return jwt.verify(token, refresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET);
};

module.exports = { signAccessToken, signRefreshToken, verifyToken };
