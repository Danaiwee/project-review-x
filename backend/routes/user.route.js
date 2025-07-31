import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollow,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);

router.post("/followUnFollow/:id", protectRoute, followUnfollow);
router.post("/profile/update", protectRoute, updateUser);

export default router;
