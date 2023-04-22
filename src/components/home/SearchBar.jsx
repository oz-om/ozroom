import { memo } from "react";

export const SearchBar = memo(() => {
  return (
    <div id='search-bar' className='relative overflow-hidden flex items-center pl-2 backdrop-blur-md shadow-sm shadow-violet-400 w-11/12 mx-auto rounded-md'>
      <i className='bx bx-search-alt text-3xl absolute z-[-1] text-violet-500'></i>
      <input type='text' className='w-full bg-transparent outline-none pl-10 py-2' placeholder='search' />
    </div>
  );
});
