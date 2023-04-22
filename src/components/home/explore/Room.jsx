export const Room = ({ roomName, roomAvatar, isPrivate, count, max }) => {
  return (
    <div id='room' className='grid grid-cols-[auto_1fr_1fr] gap-x-2 items-center justify-around p-1 rounded-lg max-h-28'>
      <div className='w-16 h-16 overflow-hidden my-1'>
        <img src={roomAvatar} alt='room cover' className='rounded-full object-cover h-full' />
      </div>
      <div className='md:grid grid-cols-[1fr_auto]'>
        <h4 className='line-clamp-2 py-2'>{roomName}</h4>
        <p className={"font-normal text-md relative w-16 greenPill md:grid md:items-center " + (isPrivate ? "after:bg-red-500" : "after:bg-green-500")}>{isPrivate ? "private" : "public"}</p>
      </div>
      <div id='room-details' className='grid items-center md:grid-cols-3'>
        <div id='count' className='col-span-1 text-center md:col-auto'>
          <span className='text-xs text-gray-100/50 font-light md:hidden'>members</span>
          <p className='text-xl text-cyan-400'>{count}</p>
        </div>
        <div id='max' className='col-span-1 text-center md:col-auto'>
          <span className='text-xs text-gray-100/50 font-light md:hidden'>max</span>
          <p className='text-xl text-orange-400'>{max}</p>
        </div>
        <div id='join' className='col-span-2 py-1 md:col-auto'>
          <button className='bg-violet-500 block p-2 w-6/12 mx-auto rounded-xl cursor-pointer hover:bg-violet-400'>join</button>
        </div>
      </div>
    </div>
  );
};
