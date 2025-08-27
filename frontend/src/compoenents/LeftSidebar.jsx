import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import { LEFTSIDEBAR_LINK } from "../constants";
import XSvg from "./XSvg";
import { useUserStore } from "../stores/useUserStore";
import { Loader2 } from "lucide-react";

const LeftSidebar = () => {
  const { authUser, logout, isLoggingOut } = useUserStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className='md:flex-[2_2_0] w-18 max-w-52'>
      <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
        <Link to='/' className='flex justify-center md:justify-start'>
          <XSvg className='px-2 size-12 fill-white rounded-full mx-2' />
        </Link>

        <ul className='flex flex-col gap-3 mt-4'>
          {LEFTSIDEBAR_LINK.map((link) => (
            <li
              key={link.title}
              className='flex justify-center md:justify-start'
            >
              <Link
                to={
                  link.title === "Profile"
                    ? `/profile/${authUser.username}`
                    : link.href
                }
                className='flex gap-3 items-center hover:bg-stone-900 rounded-md transition-all duration-300 py-2 w-full cursor-pointer px-2 mx-2'
              >
                <link.icon className='size-8' />
                <span className='text-md hidden md:block text-white'>
                  {link.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className='flex items-center justify-between mt-auto mb-10 pr-4'>
          <Link
            to='/profile'
            className=' flex gap-2 items-start tranition-all duration-300 py-2 px-4 rounded-md'
          >
            <div className='avatar hidden md:inline-flex'>
              <div className='w-8 rounded-full'>
                <img src='/avatar.png' />
              </div>
            </div>

            <div className='hidden md:block'>
              <p className='text-white font-bold text-sm w-20 truncate'>
                {authUser?.fullName}
              </p>
              <p className='text-slate-500 text-sm'>@{authUser.username}</p>
            </div>
          </Link>

          {isLoggingOut ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <BiLogOut
              className='size-5 cursor-pointer'
              onClick={handleLogout}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
