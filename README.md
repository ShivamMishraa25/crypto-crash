// README.md

# Crypto Crash - Backend Assignment

This project is a backend implementation of a real-time "Crash" betting game called **Crypto Crash**, built with:

- Node.js + Express
- MongoDB (Mongoose)
- WebSockets (Socket.IO)
- CoinGecko API for real-time crypto prices

---

## 🧠 How the Game Works

- Players bet in **USD**, converted to **BTC or ETH** at live price.
- A round starts every 10 seconds.
- A **multiplier starts at 1.00x** and increases until a random **crash point**.
- Players must **cash out before crash** to win. If they miss the crash, they lose their bet.
- Winnings are credited to their wallet (simulated).

---

## 🛠 Tech Stack

- Node.js, Express
- MongoDB with Mongoose
- Socket.IO (WebSockets)
- CoinGecko API
- UUID & crypto modules for randomness

---

## 🔐 Provably Fair Algorithm

Crash point is generated using:

```
crashPoint = hash(seed + roundNumber) % 10000 / 100 + 1
```

- A new random **seed** is generated each round.
- The result is deterministic & verifiable using SHA-256.

---

## 📦 Setup Instructions

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in root:

```
MONGO_URI=mongodb://localhost:27017/crypto-crash
PORT=5000
```

3. Seed the database:

```bash
node seed/seed.js
```

4. Start the server:

```bash
node server.js
```

---

## 📡 WebSocket Events

| Event             | Payload                                                    | Description                       |
|------------------|------------------------------------------------------------|-----------------------------------|
| `round_start`     | `{ roundId, roundNumber, seed }`                            | Sent every 10s when new round starts |
| `multiplier_update` | `{ multiplier }`                                          | Every 100ms with growing multiplier |
| `player_cashout`  | `{ playerId, payoutCrypto, payoutUSD, multiplier }`       | On cashout success                |
| `round_crash`     | `{ crashPoint }`                                           | Broadcast when round ends         |
| `cashout_request` | `{ playerId }`                                             | Sent by client to cash out        |

---

## 📬 REST API Endpoints

### ➕ Place a Bet

```http
POST /api/wallet/bet
Content-Type: application/json

{
  "playerId": "68838b253d402532ee974d70",
  "usdAmount": 10,
  "currency": "BTC"
}
```

### 💰 Get Wallet Balance

```http
GET /api/wallet/:playerId/balance
```

Returns balances in BTC/ETH + USD equivalent.

### 💵 Cash Out

```http
POST /api/game/cashout
Content-Type: application/json

{
  "playerId": "68838b253d402532ee974d70",
  "roundId": "<currentRoundId>",
  "multiplier": 2.5
}
```

---

## 🧪 Postman Test Collection

Use the following:

- `POST /api/wallet/bet`
- `GET /api/wallet/:playerId/balance`
- `POST /api/game/cashout`

---

## 🔍 Testing WebSocket Client

Open [`public/client.html`] in a browser after starting the server:

```
http://localhost:5000/public/client.html
```

Watch the multiplier live. Click “Cash Out” and enter one of the seeded player IDs to simulate a win.

---

## 🚫 Disclaimer

- No real crypto or blockchain interaction.
- Prices are fetched from CoinGecko API every 10s and cached.
- Transactions and wallets are simulated for backend demo only.

---

## 👨‍💻 Developer

Shivam Mishra  
🔗 [Portfolio](https://shivammishraa25.github.io/portfolio/)  
📧 shivam.m4464@gmail.com  
🔗 [GitHub](https://github.com/shivammishraa25) | [LinkedIn](https://linkedin.com/in/shivammishraa25)
