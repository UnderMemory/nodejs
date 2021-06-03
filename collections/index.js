const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/cours-dev', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.error('MongoDB connection error: ', err);
    // setTimeout( function(){ tryConnect(); }, 1000 );
  } else {
    console.log('MongoDB connexion Success');
    // afterConnection();
    // TODO updater l'objet connection dans les collections ?
  }
});

autoIncrement.initialize(connection);
var collections = {
    Products: require('./Products')(connection),
    Users: require('./Users')(connection)
};

module.exports = collections;