exports.get404 = (req, res, next) => {
  // .send() or sendFile() must be last
  // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
  res
    .status(404)
    .render('404', { pageTitle: 'Page Not Found', path: undefined });
};
exports.get500 = (req, res, next) => {
  res.status(500).render('500', { pageTitle: 'Error!', path: undefined });
};
