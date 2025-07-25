const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const { fetchPrices } = require('../services/cryptoPriceService');
const { v4: uuidv4 } = require('uuid');

exports.getBalance = async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    const prices = await fetchPrices();
    const balanceUSD = {
      BTC: player.wallet.BTC * prices.BTC,
      ETH: player.wallet.ETH * prices.ETH
    };
    res.json({ wallet: player.wallet, balanceUSD });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

exports.placeBet = async (req, res) => {
  try {
    const { playerId, usdAmount, currency } = req.body;
    if (!['BTC', 'ETH'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });

    const prices = await fetchPrices();
    const player = await Player.findById(playerId);
    const cryptoAmount = usdAmount / prices[currency];

    if (player.wallet[currency] < cryptoAmount) return res.status(400).json({ error: 'Insufficient balance' });

    player.wallet[currency] -= cryptoAmount;
    await player.save();

    const transaction = new Transaction({
      playerId,
      usdAmount,
      cryptoAmount,
      currency,
      transactionType: 'bet',
      transactionHash: uuidv4(),
      priceAtTime: prices[currency]
    });
    await transaction.save();

    res.json({ success: true, cryptoAmount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place bet' });
  }
};
