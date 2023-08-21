const path = require('path');
const express = require('express');
const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('require.main.filename', require.main.filename);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', { products: adminData.products, docTitle: 'Shop' });
});

module.exports = router;
