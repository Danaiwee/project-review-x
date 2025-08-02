import { POSTS } from "../constants";

import Post from "./Post";
import PostSkeleton from "./skeletons/PostSkeleton";

const Posts = ({ feedType }) => {
  const isLoading = false;
  const isFetching = false;
  return (
    <>
      {(isLoading || isFetching) && (
        <div className='flex flex-col justify-center'>
          {[...Array(5)].map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      )}

      {POSTS && POSTS.length === 0 && (
        <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
      )}

      {POSTS && POSTS.length > 0 && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
