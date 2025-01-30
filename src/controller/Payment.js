const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

exports.makePayment = (req,res) => {
  

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
});

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
}