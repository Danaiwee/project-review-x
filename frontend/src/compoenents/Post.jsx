import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { IoClose } from "react-icons/io5";
import { FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";

import { formatPostDate } from "../lib/utils.js";
import { useUserStore } from "../stores/useUserStore.js";
import { usePostStore } from "../stores/usePostStore.js";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const { text, user, createdAt, image, comments, _id, likes, bookmarks } =
    post;
  const { username, fullName, profileImg, _id: postUserId } = user;

  const { authUser } = useUserStore();
  const {
    deletePost,
    isDeleting,
    likeUnlike,
    isCommenting,
    createComment,
    toggleBookmark,
  } = usePostStore();

  const isMyPost = authUser._id === postUserId;
  const isLiked = likes.includes(authUser._id);
  const isBookmarked = bookmarks.includes(authUser._id);

  const handleDeletePost = async () => {
    await deletePost(_id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    createComment(_id, comment);
    setComment("");
  };

  const handleLikePost = async () => {
    setIsLiking(true);
    try {
      await likeUnlike(_id, authUser._id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmarkPost = async () => {
    setIsToggling(true);
    try {
      await toggleBookmark(post._id, authUser._id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsToggling(false);
    }
  };
  return (
    <>
      <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
        <div className='avatar'>
          <Link
            to={`/profile/${username}`}
            className='w-8 rounded-full overflow-hidden'
          >
            <img src={profileImg || "/avatar.png"} />
          </Link>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-2 items-center'>
            <Link
              to={`/profile/${username}`}
              className='font-bold flex gap-2 items-center'
            >
              {fullName}
              <span className='text-sm text-gray-700 font-normal'>
                @{username}
              </span>
            </Link>

            <div className='flex items-center text-xs text-gray-700'>
              <span>&middot;&nbsp;</span>
              <span>{formatPostDate(createdAt)}</span>
            </div>

            {isMyPost && (
              <div className='flex justify-end flex-1'>
                {isDeleting ? (
                  <Loader2 className='size-4 animate-spin text-red-400' />
                ) : (
                  <IoClose
                    className='cursor-pointer text-gray-700 hover:text-red-400'
                    onClick={handleDeletePost}
                  />
                )}
              </div>
            )}
          </div>

          <div className='flex flex-col gap-3 overflow-hidden mt-3 mb-1'>
            <span className='text-md'>{text}</span>
            {image && (
              <img
                src={image}
                alt='Post image'
                className='h-80 object-contain rounded-lg'
              />
            )}
          </div>

          <div className='flex justify-between mt-3 mr-3'>
            <div className='flex gap-4 items-center w-2/3 justify-between'>
              <div
                className='flex gap-1 items-center cursor-pointer group'
                onClick={() =>
                  document.getElementById(`comments_modal${_id}`).showModal()
                }
              >
                <FaRegComment className='size-4 text-slate-500 group-hover:text-primary' />
                <span className='text-sm text-slate-500 group-hover:text-primary'>
                  {comments.length}
                </span>
              </div>

              {/*Comment Modal*/}
              <dialog
                id={`comments_modal${_id}`}
                className='modal border-none outline-none'
              >
                <div className='modal-box rounded border border-gray-600'>
                  <div className='flex justify-between'>
                    <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                    <IoClose
                      className='hover:text-red-400 cursor-pointer transition duration-300'
                      onClick={() =>
                        document.getElementById(`comments_modal${_id}`).close()
                      }
                    />
                  </div>
                  <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                    {comments.length === 0 && (
                      <p className='text-sm text-slate-500'>
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}

                    {comments.length > 0 &&
                      comments.map((comment) => (
                        <div
                          className='flex gap-2 items-start border-b border-gray-700 pb-4'
                          key={comment._id}
                        >
                          <div className='avatar'>
                            <div className='w-8 rounded-full'>
                              <img
                                src={comment.user.profileImg || "/avatar.png"}
                              />
                            </div>
                          </div>

                          <div className='flex flex-col'>
                            <div className='flex items-center gap-1'>
                              <span className='font-bold'>
                                {comment.user.fullName}
                              </span>
                              <span className='text-sm text-gray-700'>
                                @{comment.user.username}
                              </span>
                            </div>
                            <div className='text-sm mt-1'>{comment.text}</div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <form
                    onSubmit={handleCommentSubmit}
                    className='flex flex-col gap-2 items-end mt-4  pt-2'
                  >
                    <textarea
                      className='textarea w-full p-2 rounded text-md resize-none border focus:outline-none border-gray-800'
                      placeholder='Add a comment'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <button className='btn btn-primary rounded-full btn-sm text-white px-6'>
                      {isCommenting ? (
                        <Loader2 className='animate-spin' />
                      ) : (
                        <>Post</>
                      )}
                    </button>
                  </form>
                </div>

                <form method='dialog' className='modal-backdrop'>
                  <button className='outline-none'>Close</button>
                </form>
              </dialog>

              <div className='flex gap-1 items-center group cursor-pointer'>
                <BiRepost className='size-6 text-slate-500 group-hover:text-green-500' />
                <span className='text-sm text-slate-500 group-hover:text-green-500'>
                  0
                </span>
              </div>

              <div
                className='flex gap-1 items-center group cursor-pointer'
                onClick={handleLikePost}
              >
                {isLiking ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <FaRegHeart
                    className={`size-4 cursor-pointer group-hover:text-pink-500 ${
                      isLiked ? "text-red-500" : "text-slate-500"
                    }`}
                  />
                )}
                <span
                  className={`text-sm group-hover:text-pink-500 ${
                    isLiked ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {likes.length}
                </span>
              </div>
            </div>

            <div
              className='flex w-1/3 justify-end gap-2 items-center'
              onClick={handleBookmarkPost}
            >
              {isToggling ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <FaRegBookmark
                  className={`size-4 cursor-pointer group-hover:text-blue-500 ${
                    isBookmarked ? "text-blue-500" : "text-slate-500"
                  }`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
