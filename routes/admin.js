const path = require('path');
const express = require('express');

const router = express.Router();

// use `router` instead of `app`, and we can use it as a middleware in app.js
// GET /admin/add-product
router.get('/add-product', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
});

// POST /admin/add-product
router.post('/add-product', (req, res, next) => {
  console.log('POST /add-product', { body: req.body });
  res.redirect('/');
});

module.exports = router;
