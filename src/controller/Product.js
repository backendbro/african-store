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
// Route for creating products and uploading imagesc
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

exports.createProducts = async (req, res) => {
  try {
    console.log(req.body);
    const formData = req.body;

    if (!req.files) {
      return `No file found`;
    }

    console.log(formData);

    const imageUrls = []; // This will hold the URLs of uploaded images

    const categoryId = req.params.categoryId;
    const userId = req.user.id;
    const role = req.user.role;

    // Upload each image to Cloudinary
    for (const image of req.files) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products/" }, // Optional: specify folder in Cloudinary
        (error, result) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json({ error: "Error uploading image to Cloudinary" });
          }
          imageUrls.push(result.secure_url); // Store the uploaded image URL

          // If all images are uploaded, create the product
          if (imageUrls.length === req.files.length) {
            createProductWithImages(
              formData,
              imageUrls,
              res,
              categoryId,
              userId,
              role
            );
          }
        }
      );

      // Convert the buffer to a readable stream and pipe it to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(image.buffer);
      bufferStream.push(null); // Signal the end of the stream
      bufferStream.pipe(stream);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading product" });
  }
};

const createProductWithImages = async (
  formData,
  imageUrls,
  res,
  categoryId,
  userId,
  role
) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      `No category found with the ID: ${categoryId}`;
    }

    //check if user is allowed to complete this action
    if (role !== "admin") {
      return `User with USER ID: ${userId} is not allowed to complete this action`;
    }

    // Step 2: Create a product document with the form data and uploaded image URLs

    const newProduct = {
      name: formData.name,
      description: formData.description,
      BasePrice: parseInt(formData.BasePrice),
      StockQuantity: parseInt(formData.StockQuantity),
      Discount: parseInt(formData.Discount),
      DiscountType: formData.DiscountType,
      PackagingType: formData.PackagingType,
      file: imageUrls,
      user: userId,
      category: categoryId,
    };

    // Step 3: Save the product to your database
    console.log(newProduct);

    const product = await Product.create(newProduct);
    // Send back the saved product response
    res.status(200).json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
};

// //@desc     Get materials
// //@@route   GET /api/v1/materials
// //@@route  GET /api/v1/:shelfId/material
// //@@access PUBLIC
exports.getProducts = async (req, res, next) => {
  if (req.body.categoryId) {
    const product = await Product.find({
      category: req.body.categoryId,
    }).populate({
      path: "category",
      select: "name description",
    });
    res.status(200).json({ success: true, data: product });
  } else {
    const product = await Product.find().populate({
      path: "category",
      select: "name description",
    });
    res.status(200).json({ success: true, data: product });
  }
};

exports.deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return `No product found with this ID: ${req.params.id}`;
  }

  //MAKE SURE USER IS COURSE OWNER
  if (req.user.role !== "admin") {
    return `User: ${req.user.id} not authorized to complete this action`;
  }

  await product.deleteOne({ id: req.params.id });
  res.status(200).json({ success: true, data: {} });
};

// //@desc     Get Single materials
// //@@route   GET /api/v1/materials/:id
// //@@access PUBLIC
exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "category",
    select: "name description",
  });
  if (!product) {
    return `No product found with this ID: ${req.params.id}`;
  }
  res.status(200).json({ success: true, data: product });
};

// //@desc    Update course
// //@@route   PUT /api/v1/material/:id
// //@@access PRIVATE
exports.updateProduct = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ error: `No material found with this ID: ${req.params.id}` });
  }

  if (req.user.role !== "admin") {
    return res
      .status(500)
      .json({ error: `No material found with this ID: ${req.params.id}` });
  }

  if (!req.files) {
    return res.status(400).json({ error: `No files uploaded yet` });
  }

  const imageUrls = [];

  const productId = req.params.productId;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const formData = req.body;

    for (const image of req.files) {
      console.log(image);
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products/" },
        (error, result) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json({ error: "Error uploading image to Cloudinary" });
          }

          imageUrls.push(result.secure_url);

          // If all images are uploaded, create the product
          if (imageUrls.length === req.files.length) {
            updateProductWithImages(
              formData,
              imageUrls,
              res,
              productId,
              userId,
              role
            );
          }
        }
      );

      // Convert the buffer to a readable stream and pipe it to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(image.buffer);
      bufferStream.push(null); // Signal the end of the stream
      bufferStream.pipe(stream);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading product" });
  }
};

const updateProductWithImages = async (
  formData,
  imageUrls,
  res,
  productId,
  userId,
  role
) => {
  try {
    const productExist = await Product.findById(productId);
    if (!productExist) {
      `No product found with the ID: ${productId}`;
    }

    //check if user is allowed to complete this action
    if (role !== "admin") {
      return `User with USER ID: ${userId} is not allowed to complete this action`;
    }

    // Step 2: Create a product document with the form data and uploaded image URLs

    const newProduct = Object.fromEntries(
      Object.entries({
        name: formData.name,
        description: formData.description,
        BasePrice: formData.BasePrice
          ? parseInt(formData.BasePrice)
          : undefined,
        StockQuantity: formData.StockQuantity
          ? parseInt(formData.StockQuantity)
          : undefined,
        Discount: formData.Discount ? parseInt(formData.Discount) : undefined,
        DiscountType: formData.DiscountType,
        PackagingType: formData.PackagingType,
        file: imageUrls,
        user: userId,
        category: formData.categoryId,
      }).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ""
      )
    );

    // Step 3: Save the product to your database
    console.log(newProduct);

    const product = await Product.create(newProduct);
    // Send back the saved product response
    res.status(200).json({ data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
};

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
