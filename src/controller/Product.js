// const ErrorResponse = require("../ultis/ErrorResponse");
// const asyncHandler = require("express-async-handler");
// const Material = require("../models/materials");
// const Shelf = require("../models/shelf");
// const path = require("path");
// const fs = require("fs");
// const os = require("os");
// const https = require("https");

const Category = require("../model/Category");
const Product = require("../model/Product");

//@desc     Create materials
//@@route  POST /api/v1/:materialId/material
//@@access PUBLIC

const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// Route for creating products and uploading images
exports.createProducts = async (req, res) => {
  try {
    const formData = req.body;

    // Step 1: Handle the images upload
    const imageUrls = []; // This will hold the URLs of uploaded images

    // Upload each image to Cloudinary
    for (const image of formData.images) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "products/", // Optional: specify folder in Cloudinary
      });
      imageUrls.push(uploadResponse.secure_url); // Get the secure URL of the uploaded image
    }

    // Step 2: Create a product document with the form data and uploaded image URLs
    const newProduct = new Product({
      name: formData.name,
      description: formData.description,
      BasePrice: formData.BasePrice,
      StockQuantity: formData.StockQuantity,
      Discount: formData.Discount,
      DiscountType: formData.DiscountType,
      PackagingType: formData.PackagingType,
      imageUrls: imageUrls, // Store the uploaded image URLs
    });

    // Step 3: Save the product to your database
    const savedProduct = await newProduct.save();

    // Send back the saved product response
    res.status(200).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading product" });
  }
};

exports.createProduces = async (req, res) => {
  req.body.category = req.params.categoryId;
  req.body.user = req.user.id;

  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    `No category found with the ID: ${req.params.categoryId}`;
  }

  //check if user is allowed to complete this action
  if (req.user.role !== "admin") {
    return `User with USER ID: ${req.user.id} is not allowed to complete this action`;
  }

  const product = await Product.create(req.body);
  res.status(200).json({ success: true, data: product });
};

// //@desc     Get materials
// //@@route   GET /api/v1/materials
// //@@route  GET /api/v1/:shelfId/material
// //@@access PUBLIC
// exports.getFoods = async (req, res, next) => {
//   if (req.body.categoryId) {
//     const food = await Food.find({ category: req.body.categoryId }).populate({
//       path: "category",
//       select: "name description email",
//     });
//     res.status(200).json({ success: true, data: food });
//   } else {
//     const food = await Food.find().populate({
//       path: "category",
//       select: "name description email",
//     });
//     res.status(200).json({ success: true, data: food });
//   }
// };

// //@desc     Get Single materials
// //@@route   GET /api/v1/materials/:id
// //@@access PUBLIC
// exports.getMaterial = asyncHandler(async (req, res, next) => {
//   const material = await Material.findById(req.params.id).populate({
//     path: "shelf",
//     select: "name description email",
//   });
//   if (!material) {
//     return next(
//       new ErrorResponse(`No material found with this ID: ${req.params.id}`)
//     );
//   }
//   res.status(200).json({ success: true, data: material });
// });

// //@desc    Update course
// //@@route   PUT /api/v1/material/:id
// //@@access PRIVATE
// exports.updateMaterial = asyncHandler(async (req, res, next) => {
//   let material = await Material.findById(req.params.id);
//   if (!material) {
//     return next(
//       new ErrorResponse(`No material found with this ID: ${req.params.id}`)
//     );
//   }
//   //MAKE SURE USER IS COURSE OWNER
//   if (material.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(
//       new ErrorResponse(
//         `User: ${req.user.id} not authorized to complete this action`,
//         404
//       )
//     );
//   }

//   material = await Material.findOneAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({ success: true, data: material });
// });

// //@desc    DELETE course
// //@@route   DELETE /api/v1/material/:id
// //@@access PRIVATE
// exports.deleteMaterial = asyncHandler(async (req, res, next) => {
//   let material = await Material.findById(req.params.id);
//   if (!material) {
//     return next(
//       new ErrorResponse(`No material found with this ID: ${req.params.id}`)
//     );
//   }

//   //MAKE SURE USER IS COURSE OWNER
//   if (material.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(
//       new ErrorResponse(
//         `User: ${req.user.id} not authorized to complete this action`,
//         404
//       )
//     );
//   }

//   await material.delete();
//   res.status(200).json({ success: true, data: {} });
// });
