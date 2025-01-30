const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateShelf,
  deleteShelf,
} = require("../controller/Category");

const router = express.Router();

//bring the material route
// const foodRouter = require('./Food')

// this will help us to re route any request from the material router to
// the shelf endpoint.
//so we can do //localhost:${PORT}/api/v1/shelf/shelfId/material
// router.use('/:category/food', foodRouter)

const { protect, authorize } = require("../middleware/Auth");

router.post("/", protect, authorize("owner", "admin"), createCategory);

router.route("/", protect).get(getCategories);

// router
//     .route('/:id')
//         .get(getCategory)
// .put(protect, authorize('owner', 'admin'), updateShelf)
// .delete(protect, authorize('owner', 'admin'), deleteShelf)

module.exports = router;
