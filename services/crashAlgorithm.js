const crypto = require('crypto');

const generateSeed = () => crypto.randomBytes(16).toString('hex');

const generateCrashPoint = (seed, roundNumber) => {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const intValue = parseInt(hash.substring(0, 8), 16);
  const maxCrash = 100 * 100;
  const crash = (intValue % maxCrash) / 100 + 1;
  return parseFloat(crash.toFixed(2));
};

module.exports = { generateSeed, generateCrashPoint };
