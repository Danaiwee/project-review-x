import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { USERS } from "../constants";
import RightSidebarSkeleton from "./skeletons/RightSidebarSkeleton";

const RightSidebar = () => {
  const isLoading = false;

  return (
    <aside className='hidden lg:block mx-2'>
      <div className='bg-gray-900 p-4 rounded-md sticky top-3'>
        <h4 className='font-bold mb-3'>Who to follow</h4>
        <div className='flex flex-col gap-4'>
          {isLoading && (
            <>
              <RightSidebarSkeleton />
              <RightSidebarSkeleton />
              <RightSidebarSkeleton />
              <RightSidebarSkeleton />
              <RightSidebarSkeleton />
            </>
          )}

          {USERS.map((user) => (
            <Link
              key={user.username}
              to={`/profile/${user.username}`}
              className='flex items-center justify-between gap-4'
            >
              <div className='flex items-center gap-2'>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={user.profileImg || "/avatar.png"} />
                  </div>
                </div>
              </div>

              <div className='flex flex-col'>
                <p className='font-semibold tracking-tight truncate w-28'>
                  {user.fullName}
                </p>
                <p className='text-sm text-slate-500'>@{user.username}</p>
              </div>

              <button className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'>
                {isLoading ? (
                  <Loader2 className='size-5 animate-spin' />
                ) : (
                  <>Follow</>
                )}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
