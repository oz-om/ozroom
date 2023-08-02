import { useEffect, useState } from "react";
import { useAppState } from "../context";
import { uploadGetNewUrl } from "../components/global";
export default function Profile() {
  const { user, dispatch } = useAppState();
  const [allCountries, setAllCountries] = useState([]);
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    country: "",
  });
  const [waiting, setWaiting] = useState(false);

  function imagePreview(e) {
    let img = document.querySelector("#profile_img");
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
      setWaiting(true);
      uploadGetNewUrl(img).then((newURL) => {
        setWaiting(false);
        setUserInfo((prev) => ({ ...prev, avatar: newURL }));
      });
    };
  }
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/")
      .then((res) => res.json())
      .then((result) => {
        setAllCountries(result.data);
      });
    setUserInfo({
      avatar: user.avatar,
      country: user.country,
    });
  }, []);
  function toggleCountriesList() {
    document.querySelector(".countries_list").classList.toggle("hidden");
  }
  function setNewCountry(e) {
    setUserInfo((prev) => ({ ...prev, country: e.target.textContent }));
    toggleCountriesList();
  }
  async function handleUpdates() {
    let apiKey = process.env.VITE_API_KEY;
    if (waiting) {
      alert("pleas wait...");
      return;
    }
    let req = await fetch(`${apiKey}/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userInfo),
    });
    let res = await req.json(userInfo);
    if (res.updated) {
      dispatch({
        type: "updateUserInfo",
        payload: {
          country: userInfo.country,
          avatar: userInfo.avatar,
        },
      });
      console.log(res.msg);
    } else {
      console.log(res.error);
    }
  }

  return (
    <div id='profile' className='px-4overflow-y-auto'>
      <div className='grid place-content-center p-3'>
        <img id='profile_img' src={userInfo.avatar} alt='photo profile' className='w-36 h-36 border-4 border-indigo-50 rounded-full' />
        <div id='change'>
          <label htmlFor='change-photo' className='grid place-content-center'>
            <i className='bx bx-cloud-upload text-3xl'></i>
          </label>
          <input onChange={imagePreview} type='file' id='change-photo' className='hidden' />
        </div>
      </div>
      <div id='details' className='md:flex md:justify-center md:gap-x-4'>
        <div id='user-info' className='mb-4 rounded-md p-4 min-h-[215px] bg-indigo-700/25'>
          <div id='name'>
            <p className='text-white/70'>full name:</p>
            <span>{user.username}</span>
          </div>
          <div id='email'>
            <p className='text-white/70'>email:</p>
            <span>{user.email}</span>
          </div>
        </div>
        <section className='changeable bg-indigo-700/25 flex'>
          <div id='reset-pass' className='basis-2/4 rounded-md p-4'>
            <div id='old'>
              <label htmlFor='old-pass'>current password:</label>
              <input type='password' name='old' id='old-pass' placeholder='old password' className='input' />
            </div>
            <div id='new' className='mt-2'>
              <label htmlFor='new-pass'>new password:</label>
              <input type='password' name='new' id='new-pass' placeholder='new password' className='input' />
            </div>
          </div>
          <div className='country basis-2/4 rounded-md p-4'>
            <div className='current_country'>
              <p className='text-white/70'>country:</p>
              <div className='flex items-center relative'>
                <span className='px-3 py-1 rounded-md my-1 ml-2 inline-block border border-white/25'>{userInfo.country}</span>
                <div className='change_country'>
                  <div onClick={toggleCountriesList} className='px-2 ml-2 cursor-pointer flex content-center items-center rounded-md bg-violet-400'>
                    <span className='h-7'>...</span>
                  </div>
                  <ul className='countries_list hidden max-h-40 absolute overflow-y-auto bg-violet-500 rounded-md border left-[2%] bottom-[93%] w-4/6'>
                    {allCountries.map((country, i) => {
                      return (
                        <li onClick={setNewCountry} key={i} className='hover:bg-violet-700 px-2 cursor-pointer'>
                          {country.country}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div id='update' className='mt-2'>
          <button onClick={handleUpdates} className='bg-indigo-400 py-1 px-4 rounded-md ml-10 mt-3 cursor-pointer'>
            update
          </button>
        </div>
      </div>
    </div>
  );
}
