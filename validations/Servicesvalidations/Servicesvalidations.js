const Joi = require('joi');

const servicesvalidation = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    decription: Joi.string().min(20).required(),
});

module.exports = servicesvalidation;
