// keeps every api response in the same { success, message, data } shape for the frontend to rely on
function sendSuccess(res, statusCode, message, data = null) {
  return res.status(statusCode).json({ success: true, message, data });
}

function sendError(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({ success: false, message, errors });
}

module.exports = { sendSuccess, sendError };
