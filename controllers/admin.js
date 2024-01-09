const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const { productId } = req.params;

  if (!editMode || !productId) {
    return res.redirect('/');
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id') // manually select fields (title price) or explicitly exclude field (-_id)
    // .populate('userId', 'name') // get hydrated User by userId and select only name field
    .then((products) => {
      res.render('admin/products', {
        products,
        path: '/admin/products',
        pageTitle: 'Admin Products',
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    _id: new mongoose.Types.ObjectId('659cc1c1acbd3a928326fc99'),
    title,
    imageUrl,
    description,
    price,
    userId: req.user._id, // can also use just req.user, mongoose will only select the id from user
  });

  product
    .save()
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/edit-product',
      //   editing: false,
      //   hasError: true,
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: [],
      //   product: {
      //     title,
      //     imageUrl,
      //     price,
      //     description,
      //   },
      // });

      // res.redirect('/500');

      const error = new Error(err.message);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        _id: id,
        title,
        imageUrl,
        price,
        description,
      },
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;

      product.save().then(() => {
        res.redirect('/admin/products');
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { id: productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
