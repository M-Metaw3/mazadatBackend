// routes/notificationRoutes.js
const express = require('express');
const notificationController = require('../controllers/NotifcationAdminController/notificationController');
// const { protect, restrictTo } = require('../middlewares/authMiddleware'); // Assume you have these middlewares set up

const router = express.Router();

router.post('/send-global-notification',
    //  protect, restrictTo('admin'),
 notificationController.sendNotification);
router.post('/schedule-notification',
    //  protect, restrictTo('admin'),
      notificationController.scheduleNotification);
router.get('/get-all-notifications',
    //  protect, restrictTo('admin'),
      notificationController.getAllNotifications);
router.delete('/:id',
    //  protect, restrictTo('admin'),
      notificationController.deleteNotification);

module.exports = router;
