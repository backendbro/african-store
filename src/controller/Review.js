const Review = require("../model/Reviews");

// Create a review for a specific product
exports.createReview = async (req, res) => {
  try {
    const { productId, name, email, rating, comment, termsAccepted } = req.body;

    if (
      !productId ||
      !name ||
      !email ||
      !rating ||
      !comment ||
      !termsAccepted
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReview = new Review({
      productId,
      name,
      email,
      rating,
      comment,
      termsAccepted,
    });

    await newReview.save();

    res
      .status(201)
      .json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all reviews for a specific product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
