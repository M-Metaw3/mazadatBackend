
const express = require('express');
const notification = require('../controllers/notificatins/notification');

const authMiddleware = require('../middleware/authMiddleware');


const AppError = require('../utils/appError');

const router = express.Router();


// router.get('/notifications/admin', depositController.getAdminNotifications);
router.get('/:id',authMiddleware,notification.getusersNotifications );
router.post('/:id',authMiddleware,notification.readallnotifications );



module.exports = router;
