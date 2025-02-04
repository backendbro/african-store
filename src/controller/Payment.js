const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "google_pay"],
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "BR"] },
      success_url: `${process.env.BASE_URL}/success.html`,
      cancel_url: `${process.env.BASE_URL}/cancel.html`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
