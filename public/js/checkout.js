const STRIPE_PUBLIC_TEST_API =
  'pk_test_51Oa1zTDiQQ6NcTAHlkems6lbqfONeZosVrRBhNcwP3M5rqLuPPAq1BoWbzXqQQRZYXAgBpF31aOcQRejtCgmxRMd00eghgAHtQ';

const stripe = Stripe(STRIPE_PUBLIC_TEST_API);

const orderBtn = document.getElementById('order-btn');

orderBtn.addEventListener('click', function () {
  const sessionId = this.getAttribute('data-session-id');
  stripe.redirectToCheckout({
    sessionId,
  });
});
