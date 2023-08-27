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
        cart.products[existingProductIndex] = [updatedProduct];
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
};
