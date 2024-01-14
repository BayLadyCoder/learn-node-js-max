const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const rootDir = require('../utils/path');
const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
        hasProducts: products.length > 0,
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') // get hydrated product by/in productId
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } }; // get all product data from ._doc
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });

      order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
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

  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('Order not found'));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join(rootDir, 'invoices', invoiceName);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="' + invoiceName + '"'
      );

      // generating a new pdf file
      const pdfDoc = new PDFDocument(); // readable stream

      // readable stream writing to writable streams (as local file and res)
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      // writing to pdf
      pdfDoc.fontSize(24).text('Invoice');
      pdfDoc
        .fontSize(20)
        .text(
          '----------------------------------------------------------------------'
        );

      let totalPrice = 0;

      order.products.forEach(({ quantity, product }) => {
        totalPrice += quantity * product.price;
        pdfDoc
          .fontSize(14)
          .text(`${product.title}: $${product.price} x ${quantity} items`);
      });
      pdfDoc.fontSize(20).text(' ');
      pdfDoc.fontSize(18).text(`Total Price: $${totalPrice}`);

      // done writing to pdf
      pdfDoc.end();

      // ! read file to the memory first, then send it, not efficient for large files
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'attachment; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });

      // ! streaming response data, read file in chunks
      // const file = fs.createReadStream(invoicePath);

      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'attachment; filename="' + invoiceName + '"'
      // );

      // // readable stream writing to a writable stream
      // // respond object is a writable stream, so we can do this
      // file.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
};
