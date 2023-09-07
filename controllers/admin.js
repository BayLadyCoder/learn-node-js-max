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

  if (!editMode || !productId) {
    return res.redirect('/');
  }

  req.user
    .getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
    .then((products) => {
      if (products.length === 0) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products[0],
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
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

  // Sequelize adds special methods like
  // depending on the association/relations we added
  // Example, .createProduct() comes from
  // Product.belongsTo(User, { constrains: true, onDelete: 'CASCADE' });
  // User.hasMany(Product);
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then((result) => {
      // console.log('result', result);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  // updated data
  const { id, title, imageUrl, description, price } = req.body;

  Product.findByPk(id)
    .then((product) => {
      if (!product) {
        return;
      }

      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;

      // .save() returns a promise
      return product.save();
    })
    .then((result) => {
      // result is the instance of the product
      // console.dir(result);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { id } = req.body;

  Product.findByPk(id)
    .then((product) => {
      if (product) {
        // .destroy() returns a promise
        return product.destroy();
      }
    })
    .then((result) => {
      // result is the instance of the product
      // console.dir(result);
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
