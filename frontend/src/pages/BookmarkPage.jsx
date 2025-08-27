import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import Posts from "../compoenents/Posts";
import { usePostStore } from "../stores/usePostStore.js";
import { useEffect } from "react";

const BookmarkPage = () => {
  const { isFetchingPosts, fetchPosts, posts } = usePostStore();

  useEffect(() => {
    fetchPosts("Bookmarks");
  }, [fetchPosts]);

  return (
    <main className='container'>
      <div className='flex gap-10 px-4 py-2 items-center mt-1 border-b border-gray-700'>
        <Link to='/'>
          <FaArrowLeft className='size-4' />
        </Link>

        <div className='flex flex-col justify-center'>
          <p className='font-bold text-lg'>Bookmark</p>
          <p className='text-sm text-slate-500'>{posts?.length} posts</p>
        </div>
      </div>

      <Posts posts={posts} isFetchingPosts={isFetchingPosts} />
    </main>
  );
};

export default BookmarkPage;
