const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
})
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db('alpenjugo');
    app.locals.db = db;

    // 👉 Jetzt, wo DB verbunden ist: Router einbinden
    const userRouter = require('./routers/userRouter');
    const tournamentRouter = require('./routers/tournamentRouter');
    app.use(userRouter);
    app.use(tournamentRouter);

    // 👉 Danach: statische Dateien + Vue-Fallback
    const publicPath = path.join(__dirname, '../dist');
    app.use(express.static(publicPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });

    app.listen(port, () => {
      console.log('🚀 Server is up on port', port);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
