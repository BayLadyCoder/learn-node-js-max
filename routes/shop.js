const path = require('path');
const express = require('express');
const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('require.main.filename', require.main.filename);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const { products } = adminData;
  res.render('shop', {
    products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
