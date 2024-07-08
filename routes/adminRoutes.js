const express = require('express');
const adminController = require('../controllers/AdminController/AdminController'); 
const subcategoryended = require('../controllers/AdminController/getendedsubcategory');  // Adjust the path as needed
 // Adjust the path as needed
const router = express.Router();

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.post('/add-permission', adminController.addPermissionToAdmin);
router.post('/remove-permission', adminController.removePermissionFromAdmin);
router.get('/endedauction', subcategoryended.getEndedSubcategories);
router.get('/endedauction/:subcategoryId', subcategoryended.getItemsBySubcategory);
router.get('/endedauction/details/:itemId/:status', subcategoryended.getWinnersOrLosersByItem);
router.post('/endedauction/admin-action', subcategoryended.adminActionOnWinner);

router
  .route('/')
  .get(adminController.getAllAdmins)
  .post(adminController.createAdmin);

router
  .route('/:id')
  .get(adminController.getAdminById)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

router
  .route('/:id/permissions')
  .post(adminController.addPermissionToAdmin);

router
  .route('/:id/permissions/:permissionId')
  .delete(adminController.removePermissionFromAdmin);


module.exports = router;
