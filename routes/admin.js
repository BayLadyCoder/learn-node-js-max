const path = require('path');
const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

// use `router` instead of `app`, and we can use it as a middleware in app.js
// GET /admin/add-product
router.get('/add-product', productsController.getAddProduct);

// POST /admin/add-product
router.post('/add-product', productsController.postAddProduct);

// export default value
module.exports = router;

// export multiple values
// exports.routes = router;
// exports.products = products;
