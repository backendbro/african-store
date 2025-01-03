import { Router } from "express";
const router = Router()

import { Register } from "../controller/Auth";

router.post("/register", Register)

export default router 