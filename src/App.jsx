import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/global/Navbar";

import { useAppState } from "./state";
import { lazyLoad } from "./lazyLoad";

const Home = lazyLoad("./pages/Home", "Home");
const Explore = lazyLoad("./components/home/explore/Explore", "Explore");
const MyRooms = lazyLoad("./components/home/rooms/MyRooms", "MyRooms");
const EditRoom = lazyLoad("./components/home/rooms/EditRoom", "EditRoom");

const Login = lazyLoad("./pages/Login", "Login");
const Register = lazyLoad("./pages/Register", "Register");
const Profile = lazyLoad("./pages/Profile", "Profile");

function App() {
  const { rooms, myRooms } = useAppState();
  return (
    <>
      <Navbar />

      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='explore' element={<Explore rooms={rooms} />} />
          <Route path='rooms'>
            <Route path='' element={<MyRooms myRooms={myRooms} />} />
            <Route path='edit' element={<EditRoom />} />
          </Route>
        </Route>
        <Route path='/profile' element={<Profile />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
