const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

const tournamentRouter = require('./routers/tournamentRouter');
const userRouter = require('./routers/userRouter');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRouter);
app.use(tournamentRouter);

// Serve static Vue build
const publicPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// MongoDB connection + server start
MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
})
  .then(client => {
    console.log('✅ Connected to MongoDB');
    const db = client.db('alpenjugo');

    // optional: app.locals.db = db;

    // Start server ONLY after Mongo is connected
    app.listen(port, () => {
      console.log('🚀 Server is up on port', port);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1); // Exit to avoid port conflict
  });
