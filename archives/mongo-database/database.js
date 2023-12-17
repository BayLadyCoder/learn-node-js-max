const {
  MongoClient,
  //  ServerApiVersion
} = require('mongodb');

let _db;
const uri =
  'mongodb+srv://rachadabayc:oVS2JvvnG5k0eQ7p@cluster0.bhlelx4.mongodb.net/?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db();
      console.log('mongodb connected');
      callback();
    })
    .catch((err) => console.log('mongodb connection error: ', err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

// use this code in app.js
// mongoConnect(() => {
//   app.listen(3000);
// });

module.exports = { mongoConnect, getDb };

// this code below is from mongodb website
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
