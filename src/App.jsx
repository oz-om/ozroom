import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/global/Navbar";

import { useAppState } from "./state";

const Home = lazy(() => import("./pages/Home.jsx"));

const Explore = lazy(() =>
  import("./components/home/explore/Explore").then((module) => {
    return { default: module.Explore };
  }),
);
const MyRooms = lazy(() =>
  import("./components/home/rooms/MyRooms").then((module) => {
    return { default: module.MyRooms };
  }),
);
const EditRoom = lazy(() =>
  import("./components/home/rooms/EditRoom").then((module) => {
    return { default: module.EditRoom };
  }),
);

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
          <Route path='/profile' element={<Profile />} ba />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
