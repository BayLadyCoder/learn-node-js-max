const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// use `router` instead of `app`, and we can use it as a middleware in app.js
// GET /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct);

// GET /admin/edit-product
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// GET /admin/products
router.get('/products', isAuth, adminController.getProducts);

// POST /admin/add-product
router.post('/add-product', isAuth, adminController.postAddProduct);

// POST /admin/edit-product
router.post('/edit-product', isAuth, adminController.postEditProduct);

// POST /admin/products
router.post('/delete-product/', isAuth, adminController.postDeleteProduct);

// export default value
module.exports = router;

// export multiple values
// exports.routes = router;
// exports.products = products;
