import { IoSettingsOutline } from "react-icons/io5";
import { Loader2 } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { useNotificationStore } from "../stores/useNotificationStore";
import { useEffect } from "react";

const NotificationPage = () => {
  const {
    notifications,
    getNotifications,
    isDeleting,
    deleteAllNotifications,
  } = useNotificationStore();

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const handleDeleteNotifications = () => {
    deleteAllNotifications();
  };

  return (
    <main className='container'>
      <div className='flex justify-between items-center p-4 border-b border-gray-700'>
        <p className='font-bold'>Notification</p>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='m-1'>
            <IoSettingsOutline className='w-4 cursor-pointer' />
          </div>
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 bg-base-100 rounded-box w-52'
          >
            <li
              className='p-2 hover:bg-gray-900 cursor-pointer'
              onClick={handleDeleteNotifications}
            >
              Delete all notifications
            </li>
          </ul>
        </div>
      </div>

      {isDeleting && (
        <div className='flex justify-center h-full items-center'>
          <Loader2 className='size-16 animate-spin' />
        </div>
      )}

      {notifications.length > 0 ? (
        <>
          {notifications.map((notification) => (
            <div
              className='h-20 border-b border-gray-700'
              key={notification._id}
            >
              <div className='flex gap-2 p-4 items-center'>
                {notification.type === "follow" && (
                  <UserPlus className='size-5 text-primary' />
                )}
                {notification.type === "like" && (
                  <FaHeart className='size-5 text-red-500' />
                )}
                <Link
                  to={`/profile/${notification.from._id}`}
                  className='flex items-center gap-1'
                >
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img
                        src={notification.from.profileImg || "/avatar.png"}
                      />
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <span className='font-bold pr-1'>
                      @{notification.from.username}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className='text-center p-4 font-bold'>No notifications 🤔</div>
      )}
    </main>
  );
};

export default NotificationPage;
