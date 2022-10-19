const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
}).then(() => {
  console.log('connected to mogoDB');
}).catch(err => {
  console.log(err);
})

mongoose.connection.on('error', err => {
  console.log(err);
})