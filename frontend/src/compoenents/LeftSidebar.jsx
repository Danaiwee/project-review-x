import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import { LEFTSIDEBAR_LINK } from "../constants";
import XSvg from "./XSvg";

const LeftSidebar = () => {

  const handleLogout = () => {};

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
                to={link.href}
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
  
        <Link
          to='/profile'
          className='mt-auto mb-10 flex gap-2 items-start tranition-all duration-300 py-2 px-4 rounded-md'
        >
          <div className='avatar hidden md:inline-flex'>
            <div className='w-8 rounded-full'>
              <img src='/avatar.png' />
            </div>
          </div>

          <div className='flex justify-between flex-1'>
            <div className='hidden md:block'>
              <p className='text-white font-bold text-sm w-20 truncate'>
                John Doe
              </p>
              <p className='text-slate-500 text-sm'>@johndoe</p>
            </div>
            <BiLogOut
              className='size-5 cursor-pointer'
              onClick={handleLogout}
            />
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSidebar;
