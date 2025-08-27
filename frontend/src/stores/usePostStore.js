import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const usePostStore = create((set) => ({
  posts: [],
  isLiked: false,
  isFetchingPosts: false,
  isCreatingPost: false,
  isDeletingPost: false,
  iscommenting: false,
  isToggling: false,

  fetchPosts: async (feedType, username) => {
    set({ isFetchingPosts: true });

    try {
      let endpoint = "";

      switch (feedType) {
        case "For you":
          endpoint = "/posts/all";
          break;

        case "Following":
          endpoint = "/posts/following-posts";
          break;

        case "Posts":
          endpoint = `/posts/user-posts/${username}`;
          break;

        case "Likes":
          endpoint = `/posts/liked-posts/${username}`;
          break;

        case "Bookmarks":
          endpoint = "/posts/bookmarks";
          break;

        case "Retweet":
          endpoint = `/posts/retweets/${username}`;
          break;

        default:
          endpoint = "/posts/all";
      }

      const response = await axios.get(endpoint);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      set({ posts: response.data || [] });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isFetchingPosts: false });
    }
  },

  createPost: async (data, feedType = "For you") => {
    set({ isCreatingPost: true });
    try {
      const response = await axios.post("/posts/create", data);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      toast.success("Crated post successfully");
      await usePostStore.getState().fetchPosts(feedType);

      return { success: true };
    } catch (error) {
      console.log(error);
      toast.error("Failed to create post");
    } finally {
      set({ isCreatingPost: false });
    }
  },

  deletePost: async (postId) => {
    set({ isDeletingPost: true });

    try {
      const response = await axios.delete(`/posts/${postId}`);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      set((prevState) => ({
        posts: prevState.posts.filter((post) => post._id !== postId),
      }));

      toast.success("Deleted post successfully");
    } catch (error) {
      console.log(error);
    } finally {
      set({ isDeletingPost: false });
    }
  },

  likeUnlike: async (postId, userId) => {
    try {
      const response = await axios.post(`/posts/like-unlike/${postId}`);
      const updatedLikes = response.data;

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        ),
        isLiked: updatedLikes.includes(userId),
      }));

      const isLiked = updatedLikes.includes(userId);
      toast.success(
        isLiked ? "Liked post successfully" : "Unliked post successfully"
      );
    } catch (error) {
      console.log(error);
    }
  },

  createComment: async (postId, text) => {
    set({ iscommenting: true });
    try {
      const response = await axios.post(`/posts/comments/${postId}`, { text });
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const newComment = response.data.newComment;
      set((prevState) => ({
        posts: prevState.posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ),
      }));

      toast("Commented post successfully");
    } catch (error) {
      console.log(error);
    } finally {
      set({ iscommenting: false });
    }
  },

  toggleBookmark: async (postId, userId) => {
    try {
      const response = await axios.post(`/posts/bookmark/${postId}`);
      if (response.data.error) {
        throw new Error("Failed to add bookmark");
      }

      set((prevState) => ({
        posts: prevState.posts.map((post) =>
          post._id === postId ? { ...post, bookmarks: response.data } : post
        ),
      }));

      const isBookmarked = response.data.includes(userId);
      toast.success(
        isBookmarked
          ? "Added post to your bookmark"
          : "Removed post from your bookmark"
      );
    } catch (error) {
      console.log(error);
    }
  },

  retweetPost: async (postId, userId) => {
    try {
      const response = await axios.post(`/posts/retweet/${postId}`);
      if (response.data.error) throw new Error("Failed to retweet post");

      const updatedRetweets = response.data;

      set((prevState) => ({
        posts: prevState.posts.map((post) =>
          post._id.toString() === postId
            ? { ...post, retweets: updatedRetweets }
            : post
        ),
      }));

      const isRetweet = updatedRetweets.includes(userId);
      if (isRetweet) {
        toast.success("Retweet post successfully");
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
