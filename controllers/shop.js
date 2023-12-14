const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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

  Product.findById(productId)
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
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       cart
//         .getProducts()
//         .then((products) => {
//           res.render('shop/cart', {
//             path: '/cart',
//             pageTitle: 'Your Cart',
//             products,
//           });
//         })
//         .catch((err) => console.log(err));
//     })
//     .catch((err) => console.log(err));
// };

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log('postCart result', result);
      res.redirect('/cart');
    });
};

// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           const cartProducts = products.map((product) => {
//             product.orderItem = { quantity: product.cartItem.quantity };
//             return product;
//           });
//           return order.addProducts(cartProducts);
//         })
//         .catch((err) => console.log(err));
//     })
//     .then((result) => {
//       fetchedCart.setProducts(null);
//     })
//     .then((result) => {
//       res.redirect('orders');
//     })
//     .catch((err) => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ['products'] })
//     .then((orders) => {
//       console.log('orders', orders);
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout',
//   });
// };

// exports.postCartDeleteItem = (req, res, next) => {
//   const { productId } = req.body;

//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect('/cart');
//     })
//     .catch((err) => console.log(err));
// };
