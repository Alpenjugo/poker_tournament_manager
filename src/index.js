const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

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

app.listen(port, () => {
   console.log("server is up on the port " + port);
});