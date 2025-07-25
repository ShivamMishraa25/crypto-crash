const GameRound = require('../models/GameRound');
const Player = require('../models/Player');
const Transaction = require('../models/Transaction');
const { fetchPrices } = require('../services/cryptoPriceService');
const { v4: uuidv4 } = require('uuid');

exports.cashOut = async (req, res) => {
  try {
    const { playerId, roundId, multiplier } = req.body;
    const round = await GameRound.findById(roundId);
    const bet = round.bets.find(b => b.playerId.toString() === playerId && !b.cashedOut);

    if (!bet) return res.status(400).json({ error: 'No active bet found' });
    if (multiplier > round.crashPoint) return res.status(400).json({ error: 'Crash already occurred' });

    const prices = await fetchPrices();
    const payoutCrypto = bet.cryptoAmount * multiplier;
    const payoutUSD = payoutCrypto * prices[bet.currency];

    const player = await Player.findById(playerId);
    player.wallet[bet.currency] += payoutCrypto;
    await player.save();

    bet.cashedOut = true;
    bet.cashoutMultiplier = multiplier;
    bet.payoutUSD = payoutUSD;
    await round.save();

    const transaction = new Transaction({
      playerId,
      usdAmount: payoutUSD,
      cryptoAmount: payoutCrypto,
      currency: bet.currency,
      transactionType: 'cashout',
      transactionHash: uuidv4(),
      priceAtTime: prices[bet.currency]
    });
    await transaction.save();

    res.json({ success: true, payoutUSD });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cash out' });
  }
};
