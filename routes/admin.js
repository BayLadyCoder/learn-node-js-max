const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// use `router` instead of `app`, and we can use it as a middleware in app.js
// GET /admin/add-product
router.get('/add-product', adminController.getAddProduct);

// GET /admin/edit-product
router.get('/edit-product/:productId', adminController.getEditProduct);

// GET /admin/products
router.get('/products', adminController.getProducts);

// POST /admin/add-product
router.post('/add-product', adminController.postAddProduct);

// export default value
module.exports = router;

// export multiple values
// exports.routes = router;
// exports.products = products;
