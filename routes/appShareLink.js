const express = require('express');
const appShareLinkController = require('../controllers/appShareLinkController/appShareLinkController');
const router = express.Router();

router
  .route('/')
  .post(appShareLinkController.createAppShareLink)
  .get(appShareLinkController.getAllAppShareLinks);

router
  .route('/:id')
  .get(appShareLinkController.getAppShareLinkById)
  .patch(appShareLinkController.updateAppShareLink)
  .delete(appShareLinkController.deleteAppShareLink);

module.exports = router;
