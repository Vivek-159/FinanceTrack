import React, { useContext, useState } from 'react'
import Authlayout from '../../components/layout/Authlayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/Usercontext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("HUH..! Seems You Forget to Enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("HUH..! That's NOT an email address, Enter correct one");
      return;
    }

    if (!password) {
      setError("Make sure to make it Secure, Enter Password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("something went wrong..")
      }
    }
  }

  return (
    <Authlayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back Buddy</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Enter Your details to login</p>

        <form onSubmit={handleLogin} action="">
          <Input
            type='text'
            value={email}
            onChange={({ target }) => setEmail(target.value.toLowerCase())}
            label="Email address"
            placeholder='john@example.com'
          />

          <Input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder='minimum 8 character'
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='btn-primary'>
            LogIn
          </button>

          <p className='text-[13px] text-slate-800 mt-3 '>Don't you Have an Account ?{" "} <Link className="font-medium text-primary underline" to="/signUp" >SignUp</Link></p>
        </form>
      </div>
    </Authlayout>
  )
};

export default Login;