const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  crashPoint: Number,
  startTime: Date,
  endTime: Date,
  bets: [
    {
      playerId: mongoose.Schema.Types.ObjectId,
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      cashedOut: Boolean,
      cashoutMultiplier: Number,
      payoutUSD: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('GameRound', gameRoundSchema);
