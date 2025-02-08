const Review = require("../model/Reviews");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { name, email, rating, comment, termsAccepted } = req.body;

    if (!name || !email || !rating || !comment || !termsAccepted) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReview = new Review({
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

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
