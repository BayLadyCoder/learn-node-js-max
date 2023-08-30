const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // add new product, increase quantity
      if (existingProduct) {
        console.log('existingProduct', existingProduct);
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = existingProduct.qty + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products.push(updatedProduct);
      }

      // calculate totalPrice
      cart.totalPrice = cart.totalPrice + Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((product) => product.id === id);

      updatedCart.products = updatedCart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * product.qty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback(null);
      } else {
        const cart = JSON.parse(fileContent);
        callback(cart);
      }
    });
  }

  static deleteProduct(productId, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      } else {
        const cart = JSON.parse(fileContent);

        const cartProductToDelete = cart.products.find(
          (product) => product.id === productId
        );
        cart.products = cart.products.filter(
          (product) => product.id !== productId
        );
        cart.totalPrice =
          cart.totalPrice - Number(productPrice) * cartProductToDelete.qty;

        fs.writeFile(p, JSON.stringify(cart), (err) => {
          console.log(err);
        });
      }
    });
  }
};
