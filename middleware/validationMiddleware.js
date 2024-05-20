const { validationResult } = require('express-validator');

const validationMiddleware = (req, res, next) => {
  console.log(req.body)
  const errors =   validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validationMiddleware;
