// runs a zod schema against req.body and returns a clean 400 if it fails, otherwise passes through
const { sendError } = require('../utils/response');

function validateBody(schema) {
  return function checkRequestBody(req, res, next) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Invalid request data';
      return sendError(res, 400, firstError);
    }

    req.body = result.data;
    next();
  };
}

module.exports = validateBody;
