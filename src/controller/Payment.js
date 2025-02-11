const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  try {
    console.log(req.body);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"], // Only specify 'card' here

    //   line_items: req.body.items.map((item) => ({
    //     price_data: {
    //       currency: item.currency,
    //       product_data: {
    //         name: item.name,
    //         images: item.images || [], // Ensure images are passed, default to an empty array if none
    //       },
    //       unit_amount: item.price * 100, // Convert to cents
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: "payment",
    //   billing_address_collection: "required",
    //   shipping_address_collection: { allowed_countries: [] },
    //   success_url: `${process.env.BASE_URL}/public/success.html`,
    //   cancel_url: `${process.env.BASE_URL}/public/canceled.html`,
    // });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: item.currency,
          product_data: {
            name: item.name,
            images: item.images || [],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),

      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            display_name: req.body.shippingMethod || "Standard Shipping",
            type: "fixed_amount",
            fixed_amount: {
              amount: req.body.shippingFee * 100,
              currency: req.body.currency || "usd",
            },
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: req.body.deliveryEstimate.minimum.value,
              },
              maximum: {
                unit: "business_day",
                value: req.body.deliveryEstimate.maximum.value,
              },
            },
          },
        },
      ],

      success_url: `${process.env.BASE_URL1}/public/success.html`,
      cancel_url: `${process.env.BASE_URL1}/public/canceled.html`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
