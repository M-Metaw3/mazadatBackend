const express = require('express');
const adminController = require('../controllers/AdminController/AdminController');  // Adjust the path as needed
const router = express.Router();

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);

module.exports = router;
