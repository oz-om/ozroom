import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../components/global/Loader";
import { useAppState } from "../context";

export default function Register() {
  const { loggedIn } = useAppState();
  const navigate = useNavigate();
  const [user, setUserData] = useState({
    user: "",
    pass: "",
  });
  const [defaultCountry, setDefaultCountry] = useState("morocco");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn.state) {
      navigate("/explore");
    }
  }, [loggedIn]);

  function setInputs(input) {
    let data = input.target;
    setUserData((prev) => ({ ...prev, [data.name]: data.value }));
  }
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(function (response) {
        response.json().then((jsonData) => {
          setDefaultCountry(jsonData.country_name);
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  async function authRegister() {
    let apiKey = process.env.VITE_API_KEY;
    setLoading(true);
    let req = await fetch(`${apiKey}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user, country: defaultCountry }),
      credentials: "include",
    });
    let res = await req.json();
    if (res.register) {
      navigate("/login");
      setLoading(false);
    } else {
      setLoading(false);
      alert(res.error);
    }
  }
  return (
    <div id='register-container' className='grid place-content-center'>
      {!loggedIn.waiting ? (
        <div id='register' className='rounded-xl bg-indigo-600/25 px-10 py-2 mt-24'>
          <div id='head' className='grid place-content-center py-4'>
            <i className='bx bxs-analyse text-6xl mx-auto mb-3 text-indigo-400'></i>
            <p>create new account</p>
          </div>
          <div id='inputs'>
            <div id='user'>
              <label className=''>full name:</label>
              <input type='text' name='user' onInput={setInputs} placeholder='full name' className='input mb-4' />
            </div>
            <div id='email'>
              <label>email:</label>
              <input type='email' name='email' onInput={setInputs} placeholder='email' className='input mb-4' />
            </div>
            <div id='pass'>
              <label className=''>password:</label>
              <input type='password' name='pass' onInput={setInputs} placeholder='password' className='input mb-4' />
            </div>
            <div className='register'>
              <button onClick={authRegister} className='px-4 py-1 bg-violet-500 rounded-md w-28 mx-auto my-5 block'>
                {loading ? <i className='bx bx-loader bx-spin'></i> : "create one"}
              </button>
            </div>
          </div>
          <p className='text-indigo-100 py-3'>
            you already have one
            <Link to='/login' className='text-violet-300 ml-2'>
              login?
            </Link>
          </p>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
