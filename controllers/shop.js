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

  // findAll always returns an array
  // Product.findAll({ where: { id: productId } })
  //   .then((products) => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => console.log(err));

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
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then(([products, fieldData]) => {
        const cartProducts = [];
        for (const product of products) {
          const cartProductData = cart?.products.find(
            (prod) => prod.id === product.id
          );

          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }

        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          cartProducts,
        });
      })
      .catch((error) => console.log(error));
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
    res.redirect('/cart');
  });
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
