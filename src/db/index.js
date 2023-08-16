
const mongoose = require('mongoose');
const path = require('node:path');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

module.exports = {
  db: mongoose.connection,
};