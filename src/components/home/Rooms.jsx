import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppState } from "../../state";

export const Rooms = () => {
  const { loggedIn, fetchRooms } = useAppState();
  useEffect(() => {
    if (loggedIn) {
      fetchRooms();
    }
  }, []);

  return (
    <div id='rooms-container'>
      <Outlet />
    </div>
  );
};

// https://avatars.dicebear.com/api/bottts/ro.svg?background=%23A3D521
