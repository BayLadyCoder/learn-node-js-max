const express = require('express');

const router = express.Router();

// use `router` instead of `app`, and we can use it as a middleware in app.js
router.get('/add-product', (req, res, next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title" /><button type="submit">Submit</button></form>'
  );
});

router.post('/product', (req, res, next) => {
  console.log('/product', { body: req.body });
  res.redirect('/');
});

module.exports = router;
