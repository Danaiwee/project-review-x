import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { USERS } from "../constants";
import { useRef, useState } from "react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const imageRef = useRef(null);

  const isPending = false;

  const { profileImg } = USERS[0];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    imageRef.current.value = null;
  };

  const handleFormSubmit = () => {};
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
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {image && (
          <div className='relative w-72'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full size-5 cursor-pointer'
              onClick={handleRemoveImage}
            />

            <img
              src={image}
              className='w-full mx-auto h-72 object-contain rounded'
            />
          </div>
        )}

        <div className='w-full flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-3 items-center '>
            <CiImageOn
              className={`size-6 cursor-pointer ${image && "fill-primary"}`}
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
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
