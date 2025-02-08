const Category = require("../model/Category");
const { Product } = require("../model/Product");

exports.getCategories = async (_req, res) => {
  const category = await Category.find()
    .populate("product")
    .setOptions({ strictPopulate: false });
  if (!category) {
    return `No category found.`;
  }

  res
    .status(200)
    .json({ success: true, count: category.length, data: category });
};

exports.getCategoriesFrontEnd = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("Page:", page, "Limit:", limit, "Skip:", skip);

    const categories = await Category.find()
      .populate("product")
      .setOptions({ strictPopulate: false })
      .skip(skip)
      .limit(limit);

    console.log("Categories found:", categories);

    const totalCategories = await Category.countDocuments();
    console.log("Total categories in DB:", totalCategories);

    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.body.id).populate("product");

  if (!category) {
    return `Category not found with ID`;
  }

  res.status(200).json({ success: true, data: category });
};

exports.createCategory = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Proper role check
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: `User with USER ID: ${req.user.id} cannot create a category`,
      });
    }

    // Ensure required fields exist
    if (!req.body.name || !req.body.description) {
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });
    }

    const category = await Category.create(req.body);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.body.id);

  if (!category) {
    return `No category found`;
  }

  if (req.user.role !== "admin" || "owner") {
    return `User is not authorized to complete this action`;
  }

  await Category.remove();
  res.status(200).json({ success: true, data: {} });
};
