const express = require('express');
const router = express.Router();
const { cashOut } = require('../controllers/gameController');

router.post('/cashout', cashOut);

module.exports = router;
