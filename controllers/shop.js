const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  //   console.log('require.main.filename', require.main.filename);

  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  // find by primary key
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      let newQuantity = 1;

      // if product exists in the database
      if (products.length > 0) {
        product = product[0];
      }

      // add new product and set quantity to 1
      return Product.findByPk(productId).then((product) => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity },
        });
      });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postCartDeleteItem = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId, (product) => {
    if (product) {
      Cart.deleteProduct(productId, product.price);
    }
    res.redirect('/cart');
  });
};
