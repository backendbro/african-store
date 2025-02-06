const Wishlist = require("../model/Wishlist");
const Product = require("../model/Product");

async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      // Add product to existing wishlist (if not already present)

      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      } else {
        return res
          .status(200)
          .json({ message: "Product already exists", wishlist });
      }
    }

    await wishlist.save();

    return res
      .status(200)
      .json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Remove product from wishlist
async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (product) => !product.equals(productId)
    );

    await wishlist.save();

    return res
      .status(200)
      .json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get user's wishlist
async function getWishlist(req, res) {
  try {
    const { id: userId } = req.user;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
