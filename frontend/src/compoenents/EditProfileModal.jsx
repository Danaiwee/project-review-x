import { IoMdClose } from "react-icons/io";

import InputField from "./InputField";
import ButtonInput from "./ButtonInput";
import { useState } from "react";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    currentPassword: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  const isLoading = false;

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-sm px-4'
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit Profile
      </button>

      <dialog id='edit_profile_modal' className='modal'>
        <div className='w-120 modal-box border rounded-md border-gray-700 shadow-md'>
          <div className='flex justify-between'>
            <h3 className='font-bold text-lg my-3'>Update Profile</h3>
            <IoMdClose
              className='hover:text-red-400 cursor-pointer transition duration-300'
              onClick={() =>
                document.getElementById("edit_profile_modal").close()
              }
            />
          </div>

          <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
            <div className='flex items-center gap-2'>
              <InputField
                type='text'
                name='username'
                id='username'
                onChange={handleInputChange}
                value={formData.username}
                placeholder='johndoe'
                label='Username'
                readonly
              />
              <InputField
                type='text'
                name='email'
                id='email'
                onChange={handleInputChange}
                value={formData.email}
                placeholder='johhdoe@email.com'
                label='Email'
                readonly
              />
            </div>

            <div className='flex items-center gap-2'>
              <InputField
                type='text'
                name='fullName'
                id='fullName'
                onChange={handleInputChange}
                value={formData.fullName}
                placeholder='John Doe'
                label='Full Name'
              />

              <InputField
                type='text'
                name='link'
                id='link'
                onChange={handleInputChange}
                value={formData.link}
                placeholder=''
                label='Link'
              />
            </div>

            <div className='flex items-center gap-2'>
              <InputField
                type='password'
                name='currentPassword'
                id='currentPassword'
                onChange={handleInputChange}
                value={formData.currentPassword}
                placeholder='●●●●●●●●'
                label='Curent Password'
              />

              <InputField
                type='password'
                name='newPassword'
                id='newPassword'
                onChange={handleInputChange}
                value={formData.newPassword}
                placeholder='●●●●●●●●'
                label='New Password'
              />
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-semibold text-white'>Bio</label>
              <textarea
                type='text'
                name='bio'
                id='bio'
                onChange={handleInputChange}
                value={formData.bio}
                placeholder='Add bio here'
                className='w-full textarea'
              />
            </div>

            <div className='flex justify-end'>
              <ButtonInput text='Update' isLoading={isLoading} />
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
