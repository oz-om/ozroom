import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/global/Navbar";

import { useAppState } from "./state";

const Home = lazy(() => import("./pages/Home.jsx"));
const Explore = lazy(() => import("./components/home/explore/Explore"));
const MyRooms = lazy(() => import("./components/home/rooms/MyRooms"));
const EditRoom = lazy(() => import("./components/home/rooms/EditRoom"));

const Live = lazy(() => import("./pages/Live"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  const { rooms, myRooms } = useAppState();
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className='h-screen'>loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='explore' element={<Explore rooms={rooms} />} />
            <Route path='rooms'>
              <Route path='' element={<MyRooms myRooms={myRooms} />} />
              <Route path='edit' element={<EditRoom />} />
            </Route>
          </Route>

          <Route path='/live' element={<Live />} ba />
          <Route path='/profile' element={<Profile />} ba />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<div className='h-[calc(100vh_-_70px)]'> error 404 not found</div>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
