const express = require('express');
const router = express.Router();
const { getBalance, placeBet } = require('../controllers/walletController');

router.get('/:playerId/balance', getBalance);
router.post('/bet', placeBet);

module.exports = router;
