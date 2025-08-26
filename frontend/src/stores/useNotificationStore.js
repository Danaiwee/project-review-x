import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useNotificationStore = create((set) => ({
  isGetting: false,
  isDeleting: false,
  notifications: [],

  getNotifications: async () => {
    set({ isGetting: true });
    try {
      const response = await axios.get("/notifications");
      if (response.data.error) throw new Error("Failed to load notifications");

      set({ notifications: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isGetting: false });
    }
  },

  deleteAllNotifications: async () => {
    set({ isDeleting: true });
    try {
      const response = await axios.delete("/notifications");
      if (response.data.error)
        throw new Error("Failed to delete notifications");

      set({ notifications: [] });
      toast.success("Deleted notifications successfully");
    } catch (error) {
      console.log(error);
    } finally {
      set({ isDeleting: false });
    }
  },
}));
