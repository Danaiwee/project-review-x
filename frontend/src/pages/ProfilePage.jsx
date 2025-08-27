import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";

import { formatMemberSinceDate } from "../lib/utils.js";

import EditProfileModal from "../compoenents/EditProfileModal";
import ProfileHeaderSkeleton from "../compoenents/skeletons/ProfileHeaderSkeleton";
import Tab from "../compoenents/Tab.jsx";
import Posts from "../compoenents/Posts.jsx";
import { useUserStore } from "../stores/useUserStore.js";
import { usePostStore } from "../stores/usePostStore.js";

const ProfilePage = () => {
  const params = useParams();
  const usernameParams = params.username;

  const [feedType, setFeedType] = useState("Posts");

  const coverImageRef = useRef(null);
  const profileImageRef = useRef(null);

  const {
    userProfile: user,
    getUserProfile,
    authUser,
    isFetching,
  } = useUserStore();

  const { isFetchingPosts, posts, fetchPosts } = usePostStore();

  useEffect(() => {
    getUserProfile(usernameParams);
  }, [usernameParams, getUserProfile]);

  useEffect(() => {
    fetchPosts(feedType);
  }, [feedType, fetchPosts]);

  const isMyProfile = authUser?._id === user?._id;

  const isLoading = false;
  const isFollowed = false;

  const handleImageChange = () => {};

  const handleFollow = () => {};

  return (
    <main className='container'>
      {(isLoading || isFetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isFetching && !user && (
        <p className='text-center text-lg mt-20'>User not found</p>
      )}

      <div className='flex gap-10 px-4 py-2 items-center mt-1'>
        <Link to='/'>
          <FaArrowLeft className='size-4' />
        </Link>

        <div className='flex flex-col justify-center'>
          <p className='font-bold text-lg'>{user?.fullName}</p>
          <p className='text-sm text-slate-500'>{posts.length} posts</p>
        </div>
      </div>

      {/*COVER IMAGE*/}
      <div className='relative'>
        <img
          src={user?.coverImg || "/cover.jpg"}
          className='object-cover w-full h-52 z-20'
          alt='cover image'
        />

        {isMyProfile && (
          <div
            className='absolute top-2 right-2 rounded-full p-2 cursor-pointer group-hover/cover:opacity-100 transition duration-300 z-50'
            onClick={() => coverImageRef.current.click()}
          >
            <MdEdit className='size-4 text-white' />
          </div>
        )}

        <input
          type='file'
          hidden
          ref={coverImageRef}
          onChange={(e) => handleImageChange(e, "coverImage")}
        />

        <input
          type='file'
          hidden
          ref={profileImageRef}
          onChange={(e) => handleImageChange(e, "profileImage")}
        />

        {/*USER AVATAR*/}
        <div className='avatar absolute -bottom-16 left-4'>
          <div className='w-32 rounded-full relative'>
            <img src={user?.profileImg || "/avatar.png"} />
            {isMyProfile && (
              <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover:opacity-100 cursor-pointer'>
                <MdEdit
                  className='size-4 text-white'
                  onClick={() => profileImageRef.current.click()}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-end px-4 mt-5'>
        {isMyProfile ? (
          <EditProfileModal />
        ) : (
          <button
            className={`btn btn-outline rounded-full btn-sm flex items-center gap-2 px-6 ${
              isFollowed ? "bg-primary" : "bg-gray-700"
            }`}
            onClick={handleFollow}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className='size-4 animate-spin' />
            ) : isFollowed ? (
              "Following"
            ) : (
              "Follow"
            )}
          </button>
        )}
      </div>

      <div className='flex flex-col gap-2 mt-14 px-4'>
        <div className='flex flex-col'>
          <p className='font-bold text-lg'>{user?.fullName}</p>
          <p className='text-sm text-slate-500'>@{user?.username}</p>
          <p className='text-sm my-1'>{user?.bio}</p>
        </div>

        <div className='flex gap-4 flex-wrap'>
          {user?.link && (
            <div className='flex gap-1 items-center'>
              <>
                <FaLink className='size-3 text-slate-500' />
                <a
                  href={user?.link}
                  target='_blank'
                  rel='noreferrer'
                  className='text-sm text-primary hover:underline'
                >
                  {user?.link}
                </a>
              </>
            </div>
          )}

          <div className='flex gap-2 items-center'>
            <IoCalendarOutline className='size-4 text-slate-500' />
            <span className='text-sm text-slate-500'>
              {formatMemberSinceDate(user?.createdAt)}
            </span>
          </div>
        </div>

        <div className='flex gap-2'>
          <div className='flex gap-1 items-center'>
            <p className='font-bold text-xs'>
              {user?.following.length} following
            </p>
            <p className='font-bold text-xs'>
              {user?.followers.length} followers
            </p>
          </div>
        </div>
      </div>

      <div className='flex w-full border-b border-gray-700 mt-4 relative'>
        <Tab
          setFeedType={setFeedType}
          feedType={feedType}
          text='Posts'
          value='Posts'
        />
        <Tab
          setFeedType={setFeedType}
          feedType={feedType}
          text='Likes'
          value='Likes'
        />
        <Tab
          setFeedType={setFeedType}
          feedType={feedType}
          text='Retweet'
          value='Retweet'
        />
      </div>
      <Posts
        feedType={feedType}
        isFetchingPosts={isFetchingPosts}
        posts={posts}
      />
    </main>
  );
};

export default ProfilePage;
