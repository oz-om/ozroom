import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../state";

export const Login = () => {
  const { loggedIn, login } = useAppState();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/explore");
    }
  }, [loggedIn]);

  function authLogin() {
    login();
  }
  return (
    <div id='login-container' className='grid place-content-center py-32'>
      {!loggedIn && (
        <div id='login' className='rounded-xl bg-indigo-600/25 px-10 py-2'>
          <div id='head' className='grid place-content-center py-4'>
            <i className='bx bxs-plug bx-rotate-180 text-5xl'></i>
          </div>
          <div id='inputs'>
            <div id='user'>
              <label className=''>user name/email:</label>
              <input type='text' name='user' placeholder='user name or email' className='input mb-4' />
            </div>
            <div id='pass'>
              <label className=''>password:</label>
              <input type='password' name='pass' placeholder='password' className='input mb-4' />
            </div>
            <button onClick={authLogin} className='px-4 py-1 bg-violet-500 rounded-md w-28 mx-auto my-5 block'>
              login
            </button>
          </div>
          <p className='text-indigo-100 py-3'>
            you don't have one
            <Link to='/register' className='text-violet-300 ml-2'>
              create one?
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};
