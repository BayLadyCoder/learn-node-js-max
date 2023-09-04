const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const { productId } = req.params;
  // console.log({ query: req.query, params: req.params });

  if (!editMode || !productId) {
    return res.redirect('/');
  }

  Product.findById(productId, (product) => {
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product,
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
      res.render('admin/products', {
        products,
        path: '/admin/products',
        pageTitle: 'Admin Products',
      });
    })
    .catch((error) => console.log(error));
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  Product.create({
    title,
    price,
    imageUrl,
    description,
  })
    .then((result) => {
      console.log('result', result);
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  // updated data
  const { id, title, imageUrl, description, price } = req.body;

  const updatedProduct = new Product(id, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;
  console.log({ id });
  Product.deleteById(id);
  res.redirect('/admin/products');
};
