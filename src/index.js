const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.port || 5050;

const tournamentRouter = require('./routers/tournamentRouter');
const userRouter = require('./routers/userRouter');

// Paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(tournamentRouter);

// Serve static files from the Vue build
const publicPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));

// Handle SPA routing, redirect all unmatched routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log("✅ Connected to MongoDB");

    const db = client.db("alpenjugo"); // ← deine Datenbank

    // Optional: Zugriff auf Collections
    // const users = db.collection("users");
    // const tournaments = db.collection("tournaments");

    // Jetzt kannst du den DB-Zugang an deine Router weitergeben, falls nötig

    // Starte den Server erst nach erfolgreicher Verbindung:
    app.listen(port, () => {
      console.log("🚀 Server is up on the port " + port);
    });
  })
  .catch(error => {
    console.error("❌ MongoDB connection failed:", error);
  });

app.listen(port, () => {
   console.log("server is up on the port " + port);
});