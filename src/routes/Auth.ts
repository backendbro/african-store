import { Router } from "express";
const router = Router()

import { 
    Register, 
    Login
} from "../controller/Auth";

router.post("/register", Register)
router.post("/login", Login)

export default router 