const path = require('path');
const express = require('express');
const { body } = require('express-validator');

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
router.post(
  '/add-product',
  isAuth,
  [
    body('title', 'Title must have at least 3 characters')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price', 'Invalid price').isFloat(),
    body('description', 'Description must be between 5-400 characters')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProduct
);

// POST /admin/edit-product
router.post(
  '/edit-product',
  isAuth,
  [
    body('title', 'Title must have at least 3 characters')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price', 'Invalid price').isFloat(),
    body('description', 'Description must be between 5-400 characters')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// POST /admin/products
// router.post('/delete-product/', isAuth, adminController.postDeleteProduct);

// DELETE /products/:productId
router.delete('/products/:productId', isAuth, adminController.deleteProduct);

// export default value
module.exports = router;

// export multiple values
// exports.routes = router;
// exports.products = products;
