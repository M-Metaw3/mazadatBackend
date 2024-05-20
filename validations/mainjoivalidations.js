const Joi = require('joi');
const Apperror=require('../utils/appError')
// Function to validate an object using Joi schema
const validateObject =  (schema) => {
return async(req, res, next) => {
    const { error } = await schema.validate(req.body);
    if (error) {
     return   next(new Apperror(error.details[0].message, 400));
        
    }
    if (!req.value) {
        req.value = {};
    }
    req.value['body'] = req.body;
    next();
}
};
module.exports =validateObject
