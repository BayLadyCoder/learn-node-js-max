const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const targetFilePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(targetFilePath, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        // update existing product
        const existingProductIndex = products.findIndex(
          (product) => product.id === this.id
        );
        const existingProduct = products[existingProductIndex];
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(targetFilePath, JSON.stringify(updatedProducts), (err) => {
          console.error(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(targetFilePath, JSON.stringify(products), (err) => {
          console.error(err);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    return getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      callback(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((product) => product.id !== id);

      fs.writeFile(targetFilePath, JSON.stringify(updatedProducts), (err) => {
        console.error(err);
      });
    });
  }
};
