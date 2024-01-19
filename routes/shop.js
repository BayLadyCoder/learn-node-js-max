const path = require('path');
const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId([0-9a-fA-F]{24})', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.post('/cart', isAuth, shopController.postCart);
router.post('/create-order', isAuth, shopController.postOrder);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

module.exports = router;
