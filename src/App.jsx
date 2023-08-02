import { useState } from "react";
import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader } from "./components/global/Loader";
import { Navbar } from "./components/global/Navbar";
import { useAppState } from "./context";
const apiKey = process.env.VITE_API_KEY;

const Home = lazy(() => import("./pages/Home.jsx"));
const Explore = lazy(() => import("./components/home/explore/Explore"));
const MyRooms = lazy(() => import("./components/home/rooms/MyRooms"));
const EditRoom = lazy(() => import("./components/home/rooms/EditRoom"));

const Live = lazy(() => import("./pages/Live"));
const MeetingUi = lazy(() => import("./pages/Meeting"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  const { dispatch } = useAppState();
  useEffect(() => {
    async function initServer() {
      let req = await fetch(`${apiKey}/init`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      let res = await req.json();
      if (res.loggedIn) {
        dispatch({ type: "login", payload: res.user });
      } else {
        dispatch({ type: "logout", payload: res.user });
      }
    }
    initServer();
  }, []);

  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className='h-screen'>
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='explore' element={<Explore />} />
            <Route path='rooms'>
              <Route path='' element={<MyRooms />} />
              <Route path='edit' element={<EditRoom />} />
            </Route>
          </Route>

          <Route path='/live' element={<Live />} />
          <Route path='/meeting' element={<MeetingUi />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<div className='h-[calc(100vh_-_70px)]'> error 404 not found</div>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
