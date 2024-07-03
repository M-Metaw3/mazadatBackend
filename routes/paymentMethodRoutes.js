// routes/paymentMethodRoutes.js
const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController/paymentMethodController');
const validatePaymentMethod = require('../validationswithexpress/validatePaymentMethod');
const validationMiddleware = require('../middleware/validationMiddleware');


const router = express.Router();

router
  .route('/')
  .get(paymentMethodController.getPaymentMethods)
  .post(validatePaymentMethod,validationMiddleware, paymentMethodController.createPaymentMethod);

router
  .route('/:id')
  .get(paymentMethodController.getPaymentMethod)
  .patch(validatePaymentMethod, paymentMethodController.updatePaymentMethod)
  .delete(paymentMethodController.deletePaymentMethod);

module.exports = router;
