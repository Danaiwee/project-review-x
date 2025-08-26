import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { usePostStore } from "../stores/usePostStore";
import { useUserStore } from "../stores/useUserStore";

const CreatePost = () => {
  const [data, setData] = useState({
    text: "",
    image: null,
  });

  const imageRef = useRef(null);

  const { authUser } = useUserStore();
  const { createPost, isCreatingPost } = usePostStore();

  const { profileImg } = authUser;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setData((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setData((prevState) => ({ ...prevState, image: null }));
    imageRef.current.value = null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { success } = await createPost(data);

    if (success) {
      setData({
        text: "",
        image: null,
      });
      imageRef.current.value = null;
    }
  };

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar'>
        <div className='w-8 rounded-full'>
          <img src={profileImg || "/avatar.png"} />
        </div>
      </div>

      <form className='w-full flex flex-col gap-2' onSubmit={handleFormSubmit}>
        <textarea
          className='textarea w-full p-0 text-md resize-none border-none focus:outline-none border-gray-800'
          placeholder="What's happening"
          value={data.text}
          onChange={(e) =>
            setData((prevState) => ({ ...prevState, text: e.target.value }))
          }
        />

        {data.image && (
          <div className='relative w-72'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full size-5 cursor-pointer'
              onClick={handleRemoveImage}
            />

            <img
              src={data.image}
              className='w-full mx-auto h-72 object-contain rounded'
            />
          </div>
        )}

        <div className='w-full flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-3 items-center '>
            <CiImageOn
              className={`size-6 cursor-pointer ${
                data.image && "fill-primary"
              }`}
              onClick={() => imageRef.current.click()}
            />
            <BsEmojiSmileFill className='fill-primary size-5 cursor-pointer' />
          </div>

          <input
            ref={imageRef}
            type='file'
            accept='image/*'
            hidden
            onChange={handleImageChange}
          />

          <button className='btn btn-primary rounded-full btn-sm text-white px-6'>
            {isCreatingPost ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
