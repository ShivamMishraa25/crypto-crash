require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('../models/Player');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Clear existing players
  await Player.deleteMany();

  // Sample Players
  const players = [
    {
      username: 'player1',
      wallet: { BTC: 0.005, ETH: 0.1 }
    },
    {
      username: 'player2',
      wallet: { BTC: 0.01, ETH: 0.2 }
    },
    {
      username: 'player3',
      wallet: { BTC: 0.002, ETH: 0.05 }
    }
  ];

  const result = await Player.insertMany(players);
  console.log('✅ Seeded Players:\n', result.map(p => ({
    _id: p._id,
    username: p.username,
    BTC: p.wallet.BTC,
    ETH: p.wallet.ETH
  })));

  mongoose.connection.close();
};

seed();
