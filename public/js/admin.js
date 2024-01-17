const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=id]').value;
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement = btn.parentNode.parentNode;

  fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfToken,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log({ data });
      productElement.remove();
    })
    .catch((err) => console.log({ err }));
};
