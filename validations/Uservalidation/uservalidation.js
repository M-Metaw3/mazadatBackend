const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{3,30}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and be alphanumeric',
        }),
    passwordConfirm: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
        }),
});

module.exports = userSchema;
