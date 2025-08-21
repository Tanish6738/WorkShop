module.exports = function success(res, data = null, status = 200) {
  return res.status(status).json({ success: true, data });
};

module.exports.error = function error(res, code = 'SERVER_ERROR', message = 'Something went wrong', status = 500, details) {
  return res.status(status).json({ success: false, error: { code, message, details } });
};
