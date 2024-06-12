const localization = (req, res, next) => {
    req.language = req.headers['accept-language'] || 'en';
    next();
  };
  
  module.exports = localization;
  