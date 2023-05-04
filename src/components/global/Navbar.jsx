import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "../../state";
export const Navbar = () => {
  const { loggedIn, logout } = useAppState();
  const location = useLocation();
  const navigate = useNavigate();
  function toggleMenu() {
    document.getElementById("menu").classList.toggle("hidden");
  }
  function authLogout() {
    logout();
    navigate("/login");
  }
  useEffect(() => {
    if (location.pathname === "/live") {
      document.getElementById("appNavBar").classList.add("hidden");
    }
    return () => document.getElementById("appNavBar").classList.remove("hidden");
  }, [location]);
  return (
    <nav id='appNavBar'>
      <div className='wrapper flex justify-between shadow border-b-[1px] border-b-white/2 mb-2'>
        <div id='logo' className='w-36'>
          <Link to={"/explore"}>
            <img src='https://svgshare.com/i/m9r.svg' alt='logo' />
          </Link>
        </div>
        {loggedIn && (
          <div id='user-info' className='relative grid place-content-center'>
            <div id='profile' onClick={toggleMenu} className='w-12 h-12 rounded-full overflow-hidden cursor-pointer'>
              <img src='https://avatars.dicebear.com/api/bottts/ro.svg' alt='user avatar' />
            </div>
            <ul id='menu' className='absolute top-full right-0 bg-indigo-300 w-36 border border-indigo-400 rounded topArrow hidden z-10'>
              <li>
                <Link to={"/profile"} className='link'>
                  view profile
                </Link>
              </li>
              <li onClick={authLogout} className='link'>
                logout
              </li>
            </ul>
          </div>
        )}
        {!loggedIn && (
          <div className='grid place-content-center text-3xl text-pink-500'>
            <Link to={"/register"}>
              <i className='bx bxs-log-in-circle'></i>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
