const { Router } = require("express");
const router = Router();

const { Register, Login, loggedInUser } = require("../controller/Auth");
const { protect } = require("../middleware/Auth");

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", protect, loggedInUser);

module.exports = router;
