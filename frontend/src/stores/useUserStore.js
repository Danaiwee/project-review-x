import { create } from "zustand";
import toast from "react-hot-toast";

import { signInValidation, signUpValidation } from "../lib/validation.js";
import axios from "../lib/axios.js";

export const useUserStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isSigningIn: false,
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/auth/check-auth");

      set({ authUser: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      signUpValidation(data);
      const response = await axios.post("/auth/sign-up", data);
      if (response.data) {
        toast.success("Signed up successfully");
      }

      set({ authUser: response.data });
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signIn: async (data) => {
    set({ isSigningIn: true });
    try {
      signInValidation(data);

      const response = await axios.post("/auth/sign-in", data);
      if (response.data) {
        toast.success("Logged in successfully");
      }

      set({ authUser: response.data });
    } catch (error) {
      console.log(error);
      toast.error("Invalid username or password");
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
