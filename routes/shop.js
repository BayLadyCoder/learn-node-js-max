const path = require('path');
const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId([0-9a-fA-F]{24})', shopController.getProduct);
// router.get('/cart', shopController.getCart);
// router.post('/cart', shopController.postCart);
// router.get('/checkout', shopController.getCheckout);
// router.get('/orders', shopController.getOrders);
// router.post('/create-order', shopController.postOrder);
// router.post('/cart-delete-item', shopController.postCartDeleteItem);

module.exports = router;
