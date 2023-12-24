exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[0].split('=')[1];

  console.log({ isLoggedIn });
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // https://nodejs.org/api/http.html#responsesetheadername-value
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#httponly
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
  res.setHeader('Set-Cookie', 'isLoggedIn=true; HttpOnly');
  res.redirect('/');
};
