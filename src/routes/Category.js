const express = require("express");

const {
  getCategories,
  getCategory,
  createCategory,
  updateShelf,
  deleteShelf,
  getCategoriesFrontEnd,
  getCategoryFrontend,
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

router.route("/", protect, authorize("owner", "admin")).get(getCategories);
router
  .route("/frontend", protect, authorize("owner", "admin"))
  .get(getCategoriesFrontEnd);

router.route("/:id", protect, authorize("owner", "admin")).get(getCategory);
router
  .route("/frontend/:id", protect, authorize("owner", "admin"))
  .get(getCategoryFrontend);

// .put(protect, authorize('owner', 'admin'), updateShelf)
// .delete(protect, authorize('owner', 'admin'), deleteShelf)

module.exports = router;
