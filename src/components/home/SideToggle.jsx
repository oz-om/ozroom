import { memo } from "react";
import { NavLink } from "react-router-dom";

export const SideToggle = memo(() => {
  return (
    <nav className='toggle-sides flex justify-center mb-2 rounded-md'>
      <NavLink to={"explore"} className={"inline-block w-full text-center px-2 py-1 cursor-pointer hover:bg-violet-600/30 "}>
        explore
      </NavLink>
      <NavLink to='rooms' className={"inline-block w-full text-center px-2 py-1 cursor-pointer hover:bg-violet-600/30 "}>
        rooms
      </NavLink>
    </nav>
  );
});
