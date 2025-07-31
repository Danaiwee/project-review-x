import express from "express";
import {
  checkAuth,
  logout,
  signIn,
  signUp,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/check-auth", protectRoute, checkAuth);

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/logout", logout);

export default router;
