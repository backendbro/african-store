"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const Auth_1 = require("../controller/Auth");
router.post("/register", Auth_1.Register);
exports.default = router;
//# sourceMappingURL=Auth.js.map