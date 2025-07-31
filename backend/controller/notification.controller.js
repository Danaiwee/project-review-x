import { handleError } from "../lib/error.js";

import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const notifications = await Notification.find({ to: userId, read: false });
    if (!notifications) {
      return res.status(400).json({ error: "Notifications not found" });
    }

    await Notification.updateMany({ to: userId }, { read: true });

    return res.status(200).json(notifications);
  } catch (error) {
    handleError(res, "getNofication", error);
  }
};

export const removeNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await Notification.deleteMany({ to: userId });

    return res
      .status(200)
      .json({ message: "Deleted notifications successfully" });
  } catch (error) {
    handleError(res, "removeNotifications", error);
  }
};
