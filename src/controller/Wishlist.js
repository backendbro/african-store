const Wishlist = require("../model/Wishlist");
const Product = require("../model/Product");

async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find user's wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // If no wishlist exists, create one and add the product
      wishlist = new Wishlist({ userId, products: [productId] });
      await wishlist.save();

      // Mark product as wishlisted for this user
      product.isWishlisted = true;
      await product.save();

      return res.status(200).json({ message: "Added to wishlist", wishlist });
    }

    // Check if product is already in wishlist
    const index = wishlist.products.indexOf(productId);
    if (index !== -1) {
      // Remove product from wishlist
      wishlist.products.splice(index, 1);
      await wishlist.save();

      // Update product's wishlisted status (only for this user)
      product.isWishlisted = false;
      await product.save();

      return res
        .status(200)
        .json({ message: "Removed from wishlist", wishlist });
    } else {
      // Add product to wishlist
      wishlist.products.push(productId);
      await wishlist.save();

      // Mark product as wishlisted
      product.isWishlisted = true;
      await product.save();

      return res.status(200).json({ message: "Added to wishlist", wishlist });
    }
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
