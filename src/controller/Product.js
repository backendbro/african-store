// const ErrorResponse = require("../ultis/ErrorResponse");
// const asyncHandler = require("express-async-handler");
// const Material = require("../models/materials");
// const Shelf = require("../models/shelf");
// const path = require("path");
// const fs = require("fs");
// const os = require("os");
// const https = require("https");
const multer = require("multer");
const path = require("path");
const Category = require("../model/Category");
const Product = require("../model/Product");

//@desc     Create materials
//@@route  POST /api/v1/:materialId/material
//@@access PUBLIC
exports.createProducts = async (req, res) => {
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
