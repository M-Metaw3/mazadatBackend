const express = require('express');
const router = express.Router();
// const categoryvalidation = require('../validations/Categoryvalidation/Categoryvalidations');
const joifunctions = require('../validations/mainjoivalidations');
const DepositController = require('../controllers/biding/Bidcontroller');

// router.post('/',DepositController.createDeposit);
router.get('/', DepositController.getAllDeposit);
// router.get('/:id', DepositController.getDeposit);
// router.put('/:id', DepositController.updateDeposit);
// router.delete('/:id', DepositController.deleteDeposit);




module.exports = router;







