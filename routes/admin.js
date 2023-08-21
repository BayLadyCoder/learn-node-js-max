const path = require('path');
const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

// use `router` instead of `app`, and we can use it as a middleware in app.js
// GET /admin/add-product
router.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

// POST /admin/add-product
router.post('/add-product', (req, res, next) => {
  console.log('POST /add-product', { body: req.body });
  products.push({ title: req.body.title });
  res.redirect('/');
});

// export default value
// module.exports = router;

// export multiple values
exports.routes = router;
exports.products = products;
