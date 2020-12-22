const mongoose = require('mongoose');
const mongoDB_URI = 'mongodb://127.0.0.1:27017/pardha';
mongoose.connect(mongoDB_URI, { useNewUrlParser: true })
.catch(e => {
    console.error('Connection error ', e.message)
})
const db = mongoose.connection;
module.exports = db;