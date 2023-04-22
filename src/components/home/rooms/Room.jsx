import { Link } from "react-router-dom";

export const Room = ({ id, roomName, roomAvatar, topic, desc, isPrivate, max }) => {
  return (
    <div id='room' className='px-5 py-2 rounded-lg basis-1/3 grid content-between'>
      <div id='my-room-cover' className='my-1 relative pt-4 group'>
        <div className='w-28 h-28 overflow-hidden ms-auto me-auto'>
          <img src={roomAvatar} alt='room cover' className='rounded-full object-cover h-full' />
        </div>
        <div className='room-name'>
          <h4 className='line-clamp-2 py-2'>{roomName}</h4>
        </div>
        <div className='desc absolute w-full h-full top-0 text-xs font-light rounded-md p-2 bg-violet-600/80 invisible group-hover:visible'>
          <p>topic: {topic}</p>
          <p>description: {desc}</p>
        </div>
      </div>

      <div id='room-details'>
        <div className='flex justify-between items-center'>
          <p className={"font-normal text-md relative w-16 greenPill " + (isPrivate ? "after:bg-red-500" : "after:bg-green-500")}>{isPrivate ? "private" : "public"}</p>
          <div id='max' className='flex items-center'>
            <span className='text-xs text-gray-100/50 font-light mr-1'>max</span>
            <p className='text-xl text-orange-400'>{max}</p>
          </div>
        </div>
        <div id='controls'>
          <div className='flex flex-wrap gap-x-4'>
            <div id='revive' className='flex grow items-center justify-center gap-x-1 bg-green-600 pl-1 pr-4 py-1 rounded-md cursor-pointer hover:bg-green-500'>
              <i className='bx bxs-leaf'></i>
              <span>revive</span>
            </div>
            <Link to={`edit?room=${id}`} id='edit' className='flex grow items-center justify-center gap-x-1 bg-sky-500 pl-1 pr-4 py-1 rounded-md cursor-pointer hover:bg-sky-700'>
              <i className='bx bx-cog'></i>
              <span>edit</span>
            </Link>
          </div>
          <div id='delete' className='flex justify-center items-center gap-x-1 py-2 mt-2 rounded-md bg-red-500 cursor-pointer hover:bg-red-400'>
            <i className='bx bx-trash'></i>
            <span>delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};
