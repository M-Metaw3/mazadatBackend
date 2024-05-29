const express = require('express');
const router = express.Router();
// const categoryvalidation = require('../validations/Categoryvalidation/Categoryvalidations');
const joifunctions = require('../validations/mainjoivalidations');
const winnercontroller = require('../controllers/winners/winner');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/',DepositController.createDeposit);
// router.get('/', DepositController.getAllDeposit);
router.get('/:id',authMiddleware, winnercontroller.getwinners);





module.exports = router;







