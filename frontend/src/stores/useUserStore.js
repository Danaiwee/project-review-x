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
  isFetching: false,
  userProfile: null,
  isGettingSuggestedUsers: false,
  suggestedUsers: [],

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

  getUserProfile: async (username) => {
    set({ isFetching: true });
    try {
      const response = await axios.get(`/users/profile/${username}`);
      if (response.data.error) throw new Error("Failed to get user profile");

      set({ userProfile: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetching: false });
    }
  },

  getSuggestedUsers: async () => {
    set({ isGettingSuggestedUsers: true });
    try {
      const reponse = await axios.get("/users/suggested");
      if (reponse.data.error) throw new Error("Failed to get suggested users");

      set({ suggestedUsers: reponse.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isGettingSuggestedUsers: false });
    }
  },

  toggleFollow: async (targetId) => {
    try {
      const response = await axios.post(`/users/followUnfollow/${targetId}`);
      if (response.data.error)
        throw new Error("Failed to follow/unfollow user");

      const updatedAuthUser = response.data.authUser;
      const updatedTargetUser = response.data.targetUser;

      const isFollowed = updatedAuthUser.following.includes(targetId);

      set((prevState) => ({
        // keep all of userProfile, but update following/followers if needed
        userProfile:
          prevState.userProfile && prevState.userProfile._id === targetId
            ? {
                ...prevState.userProfile,
                followers: updatedTargetUser.followers,
              }
            : prevState.userProfile,
        authUser: updatedAuthUser, // keep authUser in sync too
      }));

      await useUserStore.getState().getSuggestedUsers();

      toast.success(
        isFollowed ? "Followed successfully" : "Unfollowed successfully"
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to toggle follow");
    }
  },
}));
