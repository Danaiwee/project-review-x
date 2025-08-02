import { FaArrowLeft } from "react-icons/fa";
import { POSTS } from "../constants";
import { Link } from "react-router-dom";
import Posts from "../compoenents/Posts";

const BookmarkPage = () => {
  const isLoading = false;
  const isFetching = false;
  const user = [];

  const posts = POSTS;
  return (
    <main className='container'>
      {(isLoading || isFetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isFetching && !user && (
        <p className='text-center text-lg mt-20'>User not found</p>
      )}

      <div className='flex gap-10 px-4 py-2 items-center mt-1 border-b border-gray-700'>
        <Link to='/'>
          <FaArrowLeft className='size-4' />
        </Link>

        <div className='flex flex-col justify-center'>
          <p className='font-bold text-lg'>Bookmark</p>
          <p className='text-sm text-slate-500'>{posts.length} posts</p>
        </div>
      </div>

      <Posts feedType='posts' />
    </main>
  );
};

export default BookmarkPage;
