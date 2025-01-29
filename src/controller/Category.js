const { Category } = require("../model/Category");

exports.getCategories = async (_req, res) => {
  const category = await Category.find().populate("food");
  if (!category) {
    return `No shelf found.`;
  }

  res
    .status(200)
    .json({ success: true, count: category.length, data: category });
};

exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.body.id).populate("material");

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
