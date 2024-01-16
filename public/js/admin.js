const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=id]').value;
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
  console.log('clicked', { productId, csrfToken });
};
