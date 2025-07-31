import * as authService from "./auth.service.js";
import { Router } from "express";
const router = Router();
router.post("/signUp", authService.signUp);
router.post("/logIn", authService.logIn);
export default router;
