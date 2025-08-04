import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  isFetchingPosts: false,
  isCreatingPost: false,

  createPost: async () => {},
}));
