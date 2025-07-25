const GameRound = require('../models/GameRound');
const { generateSeed, generateCrashPoint } = require('../services/crashAlgorithm');

let currentMultiplier = 1;
let currentRound = null;
let roundNumber = 0;
let seed = '';
let interval = null;

const startNewRound = async (io) => {
  seed = generateSeed();
  roundNumber++;
  const crashPoint = generateCrashPoint(seed, roundNumber);
  const startTime = new Date();

  currentRound = new GameRound({
    roundNumber,
    crashPoint,
    startTime,
    bets: []
  });
  await currentRound.save();

  currentMultiplier = 1;
  io.emit('round_start', { roundId: currentRound._id, roundNumber, seed });

  interval = setInterval(async () => {
    currentMultiplier = parseFloat((currentMultiplier + 0.01 * currentMultiplier).toFixed(2));
    io.emit('multiplier_update', { multiplier: currentMultiplier });

    if (currentMultiplier >= crashPoint) {
      clearInterval(interval);
      currentRound.endTime = new Date();
      await currentRound.save();
      io.emit('round_crash', { crashPoint });
      setTimeout(() => startNewRound(io), 10000);
    }
  }, 100);
};

const gameSocketHandler = (socket, io) => {
  socket.on('cashout_request', async ({ playerId }) => {
    if (!currentRound) return;
    const bet = currentRound.bets.find(b => b.playerId.toString() === playerId && !b.cashedOut);
    if (!bet || currentMultiplier >= currentRound.crashPoint) return;

    const payoutCrypto = bet.cryptoAmount * currentMultiplier;
    const payoutUSD = bet.usdAmount * currentMultiplier;

    bet.cashedOut = true;
    bet.cashoutMultiplier = currentMultiplier;
    bet.payoutUSD = payoutUSD;
    await currentRound.save();

    io.emit('player_cashout', {
      playerId,
      payoutCrypto,
      payoutUSD,
      multiplier: currentMultiplier
    });
  });
};

setTimeout(() => startNewRound(require('socket.io')().sockets), 2000); // dummy for initial trigger

module.exports = gameSocketHandler;
