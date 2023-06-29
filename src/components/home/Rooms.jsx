import { memo } from "react";
import { Outlet } from "react-router-dom";

export const Rooms = memo(() => {
  return (
    <div id='rooms-container'>
      <Outlet />
    </div>
  );
});

// https://avatars.dicebear.com/api/bottts/ro.svg?background=%23A3D521
