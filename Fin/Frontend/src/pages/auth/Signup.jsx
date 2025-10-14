import React, { useContext, useState } from 'react';
import Authlayout from '../../components/layout/Authlayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/Usercontext';
import uploadImage from '../../utils/uploadImage';

const Signup = () => {

  const [profilepic, setProfilepic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileimageurl = "";

    if (!fullName) {
      setError("Enter your good name");
      return;
    }
    if (!email) {
      setError("Seems You Forget to Enter your email address");
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

      if (profilepic) {
        const imageuploadRes = await uploadImage(profilepic);
        const rawUrl = imageuploadRes.imageurl;
        profileimageurl = encodeURI(rawUrl);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileimageurl
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
        setError("everything went wrong..");
      }
    }
  }

  return (
    <Authlayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center' >
        <h3 className='text-xl text-black font-semibold'>Create an account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>join us today, just enter details below.</p>


        <form onSubmit={handleSignup} action="">

          <ProfilePhotoSelector image={profilepic} setImage={setProfilepic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="fullname"
              placeholder="John"
              type="text"
            />

            <Input
              type='text'
              value={email}
              onChange={({ target }) => setEmail(target.value.toLowerCase())}
              label="Email address"
              placeholder='john@example.com'
            />

            <div className='col-span-2'>
              <Input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder='minimum 8 character'
              />
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='btn-primary'>
            Sign Up
          </button>

          <p className='text-[13px] text-slate-800 mt-3 '>Already joined Team ?{" "} <Link className="font-medium text-primary underline" to="/login" >Login</Link></p>

        </form>
      </div>
    </Authlayout>
  )
}

export default Signup; 