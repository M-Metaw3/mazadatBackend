const express = require('express');
const router = express.Router();
// const authenticateAdmin = require('../middlewares/authenticateAdmin');
const {
  withdrawFromWallet,
  addToWallet,
deleteTransaction,
getAllTransactions,updateTransaction

} = require('../controllers/WalletController/WalletController');

router.post('/withdraw', withdrawFromWallet);
router.post('/deposit', addToWallet);
router.get('/transactions', getAllTransactions);
router.put('/transactions', updateTransaction);
router.delete('/transactions', deleteTransaction);

module.exports = router;
