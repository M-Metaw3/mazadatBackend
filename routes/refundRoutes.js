const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const RefundRequest = require('../models/RefundReques');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('../utils/apiFactory');






const refundController = require('../controllers/refundController/refundController');


// router.use(authMiddleware);

router.post('/request-refund',authMiddleware, refundController.createRefundRequest);
router.get('/refunds', refundController.getAllRefundRequests);
router.patch('/refund/:requestId/complete', refundController.updateRefundRequestToCompleted);
router.delete('/refund/:requestId', refundController.deleteRefundRequest);

module.exports = router;
