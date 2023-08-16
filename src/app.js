
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
// Required Imports
const express = require('express');
const app = express();
const cors = require('cors');
const { db } = require('./db');
const router = require('./routes');
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', router);

// Listener
app.listen(PORT, () => {
  console.log('\x1b[33m%s\x1b[0m', '[!] Connection to database...');
  // Database connection error
  db.on('error', (err) => {
    console.error(err);
  });
  // Database connection open
  db.on('open', () => {
    console.log('\x1b[32m', '[+] Database Connected');
    console.log('\x1b[32m', `[+] Server Started: http://localhost:${PORT}`);
  });
});