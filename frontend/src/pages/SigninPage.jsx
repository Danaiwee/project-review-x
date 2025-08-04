import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link } from "react-router-dom";

import XSvg from "../compoenents/XSvg";
import InputField from "../compoenents/InputField";
import ButtonInput from "../compoenents/ButtonInput";
import { useUserStore } from "../stores/useUserStore";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signIn, isSigningIn } = useUserStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevSate) => ({
      ...prevSate,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    signIn(formData);
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
          <h1 className='text-4xl font-extrabold text-white mb-5'>Let's go</h1>

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
            icon={MdPassword}
            name='password'
            id='password'
            type='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='●●●●●●●●'
          />

          <ButtonInput type='submit' text='Sign in' isLoading={isSigningIn} />
        </form>

        <div className='w-full flex items-center justify-center gap-1 mt-3'>
          <p className='text-gray-500 text-sm font-semibold'>
            Don't have an account?{" "}
          </p>
          <Link to='/signup' className='text-sm text-primary font-semibold'>
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
