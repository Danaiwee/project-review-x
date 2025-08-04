import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { Link } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";
import XSvg from "../compoenents/XSvg";
import InputField from "../compoenents/InputField";
import ButtonInput from "../compoenents/ButtonInput";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { signUp, isSigningUp } = useUserStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevSate) => ({
      ...prevSate,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signUp(formData);
  };
  return (
    <main className='max-w-screen mx-auto flex h-screen px-10 gap-5'>
      <div className='flex-1 hidden lg:flex items-center justify-center px-4'>
        <XSvg className='w-full fill-white' />
      </div>

      <div className='flex-1 flex flex-col justify-center items-center px-4'>
        <form
          className='w-full mx-auto md:mx-20 flex gap-4 flex-col'
          onSubmit={handleFormSubmit}
        >
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white mb-5'>
            Join Today
          </h1>

          <InputField
            icon={MdOutlineMail}
            name='email'
            id='email'
            type='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='john@email.com'
          />

          <InputField
            icon={FaUser}
            name='username'
            id='username'
            value={formData.username}
            onChange={handleInputChange}
            placeholder='johndoe'
          />

          <InputField
            icon={MdDriveFileMoveOutline}
            name='fullName'
            id='fullName'
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder='John Doe'
          />

          <InputField
            icon={MdPassword}
            name='password'
            id='password'
            type='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='●●●●●●●●'
          />

          <ButtonInput type='submit' text='Sign up' isLoading={isSigningUp} />
        </form>

        <div className='w-full flex items-center justify-center gap-1 mt-3'>
          <p className='text-gray-500 text-sm font-semibold'>
            Already have an account?{" "}
          </p>
          <Link to='/signin' className='text-sm text-primary font-semibold'>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
