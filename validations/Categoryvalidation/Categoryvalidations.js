const Joi = require('joi');

const CategorySchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(10).required(),

});

module.exports = CategorySchema;
