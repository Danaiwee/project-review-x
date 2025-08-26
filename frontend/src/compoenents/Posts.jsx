import { useEffect } from "react";
import { POSTS } from "../constants";
import { usePostStore } from "../stores/usePostStore";

import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";

const Posts = ({ feedType }) => {
  const { fetchPosts, isFetchingPosts, posts } = usePostStore();

  useEffect(() => {
    fetchPosts(feedType);
  }, [feedType, fetchPosts]);

  return (
    <>
      {isFetchingPosts && (
        <div className='flex flex-col justify-center'>
          {[...Array(5)].map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      )}

      {posts && posts.length === 0 && (
        <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
      )}

      {posts && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
