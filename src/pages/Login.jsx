import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppState } from "../context";

export default function Login() {
  const { loggedIn, dispatch } = useAppState();
  const navigate = useNavigate();
  const [user, setUserData] = useState({
    user: "",
    pass: "",
  });

  useEffect(() => {
    if (loggedIn) {
      navigate("/explore");
    }
  }, [loggedIn]);

  function setInputs(input) {
    let data = input.target;
    setUserData((prev) => ({ ...prev, [data.name]: data.value }));
  }

  async function authLogin() {
    let apiKey = process.env.VITE_API_KEY;

    let req = await fetch(`${apiKey}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });
    let res = await req.json();
    if (res.login) {
      dispatch({ type: "login", payload: res.user });
    }
  }

  return (
    <div id='login-container' className='grid place-content-center py-32 h-[calc(100vh_-_70px)]'>
      {!loggedIn && (
        <div id='login' className='rounded-xl bg-indigo-600/25 px-10 py-2'>
          <div id='head' className='grid place-content-center py-4'>
            <i className='bx bxs-plug bx-rotate-180 text-5xl'></i>
          </div>
          <div id='inputs'>
            <div id='user'>
              <label>user name/email:</label>
              <input type='text' name='user' onInput={setInputs} placeholder='user name or email' className='input mb-4' />
            </div>
            <div id='pass'>
              <label>password:</label>
              <input type='password' name='pass' onInput={setInputs} placeholder='password' className='input mb-4' />
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
}
