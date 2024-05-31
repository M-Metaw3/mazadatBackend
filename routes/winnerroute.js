const express = require('express');
const router = express.Router();
// const categoryvalidation = require('../validations/Categoryvalidation/Categoryvalidations');
const joifunctions = require('../validations/mainjoivalidations');
const winnercontroller = require('../controllers/testcontroller/test');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/',DepositController.createDeposit);
// router.get('/', DepositController.getAllDeposit);
router.get('/:userId',authMiddleware, winnercontroller.getUserBidHistory);





module.exports = router;







