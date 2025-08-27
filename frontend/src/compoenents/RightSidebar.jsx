import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import RightSidebarSkeleton from "./skeletons/RightSidebarSkeleton";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";

const RightSidebar = () => {
  const {
    isGettingSuggestedUsers,
    getSuggestedUsers,
    suggestedUsers,
    toggleFollow,
    authUser,
  } = useUserStore();

  useEffect(() => {
    getSuggestedUsers();
  }, [getSuggestedUsers]);

  const handleFollow = async (targetId, userId) => {
    try {
      await toggleFollow(targetId, userId);
    } catch (error) {
      console.log(error);
    }
  };

  if (suggestedUsers.length === 0) return null;

  return (
    <aside className='hidden lg:block mx-2'>
      <div className='bg-gray-900 p-4 rounded-md sticky top-3'>
        <h4 className='font-bold mb-3'>Who to follow</h4>
        <div className='flex flex-col gap-4'>
          {isGettingSuggestedUsers && (
            <>
              {suggestedUsers?.map((user) => (
                <RightSidebarSkeleton key={user._id} />
              ))}
            </>
          )}

          {suggestedUsers.map((user) => (
            <div
              className='w-full flex items-center justify-between'
              key={user?.username}
            >
              <Link
                to={`/profile/${user?.username}`}
                className='flex items-center justify-between gap-4'
              >
                <div className='flex items-center gap-2'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={user?.profileImg || "/avatar.png"} />
                    </div>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <p className='font-semibold tracking-tight truncate w-28'>
                    {user.fullName}
                  </p>
                  <p className='text-sm text-slate-500'>@{user?.username}</p>
                </div>
              </Link>

              <button
                className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                onClick={() => handleFollow(user._id, authUser._id)}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
