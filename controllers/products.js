const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('POST /add-product', { body: req.body });
  products.push({ title: req.body.title });
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  console.log('require.main.filename', require.main.filename);
  res.render('shop', {
    products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
};
