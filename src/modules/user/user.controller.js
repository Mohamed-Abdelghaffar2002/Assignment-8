import * as userService from "./user.service.js";
import { Router } from "express";
const router = Router();
router.patch("/", userService.userUpdate);
router.delete("/", userService.userDelete);
router.get("/", userService.userDataById);
export default router;