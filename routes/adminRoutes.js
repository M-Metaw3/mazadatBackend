const express = require('express');
const adminController = require('../controllers/AdminController/AdminController'); 
const subcategoryended = require('../controllers/AdminController/getendedsubcategory');  // Adjust the path as needed
 // Adjust the path as needed
const router = express.Router();

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/endedauction', subcategoryended.getEndedSubcategories);
router.get('/endedauction/:subcategoryId', subcategoryended.getItemsBySubcategory);
router.get('/endedauction/details/:itemId/:status', subcategoryended.getWinnersOrLosersByItem);
router.post('/endedauction/admin-action', subcategoryended.adminActionOnWinner);




module.exports = router;
