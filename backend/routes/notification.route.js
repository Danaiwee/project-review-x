import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  removeNotifications,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);

router.delete("/", protectRoute, removeNotifications);

export default router;
