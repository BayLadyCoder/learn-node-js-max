const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex((cProduct) => {
    //   return cProduct.id === product.id;
    // });
    const updatedCart = {
      items: [{ productId: new ObjectId(product.id), quantity: 1 }],
    };
    const db = getDb();
    return db.collection('users').updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } } //https://www.mongodb.com/docs/v2.4/reference/operator/update/set/
    );
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
