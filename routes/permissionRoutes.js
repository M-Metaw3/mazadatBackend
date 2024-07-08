const express = require('express');
const permissionController = require('../controllers/permissonscontroller/permissionController');

const router = express.Router();

router
  .route('/')
  .get(permissionController.getAllPermissions)
  .post(permissionController.createPermission);

router
  .route('/:id')
  .get(permissionController.getPermission)
  .patch(permissionController.updatePermission)
  .delete(permissionController.deletePermission);

module.exports = router;
