const express = require('express');
const socialMediaLinkController = require('../controllers/socialMediaLinkController/socialMediaLinkController');
const router = express.Router();

router
  .route('/')
  .post(socialMediaLinkController.createSocialMediaLink)
  .get(socialMediaLinkController.getAllSocialMediaLinks);

router
  .route('/:id')
  .get(socialMediaLinkController.getSocialMediaLinkById)
  .patch(socialMediaLinkController.updateSocialMediaLink)
  .delete(socialMediaLinkController.deleteSocialMediaLink);

module.exports = router;
