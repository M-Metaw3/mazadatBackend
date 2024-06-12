const express = require('express');
const phoneNumberController = require('../controllers/phoneNumberController/phoneNumberController');
const router = express.Router();

router
  .route('/')
  .post(phoneNumberController.createPhoneNumber)
  .get(phoneNumberController.getAllPhoneNumbers);

router
  .route('/:id')
  .get(phoneNumberController.getPhoneNumberById)
  .patch(phoneNumberController.updatePhoneNumber)
  .delete(phoneNumberController.deletePhoneNumber);

module.exports = router;
