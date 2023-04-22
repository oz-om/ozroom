import { getCreateRoomBlock } from "../../global";
import { Room } from "./Room";
import { NewRoom } from "./NewRoom";

export const MyRooms = ({ myRooms }) => {
  return (
    <div id='rooms'>
      <div className='myRooms-container grid auto-fill gap-2 max-h-[calc(100vh_-_160px)] overflow-hidden overflow-y-auto'>
        {myRooms.map((room) => {
          const { id, cover, name, topic, desc, isPrivate, max } = room;
          return <Room key={id} id={id} roomAvatar={cover} roomName={name} topic={topic} desc={desc} isPrivate={isPrivate} max={max} />;
        })}
      </div>
      <div id='add-room' onClick={getCreateRoomBlock} className='flex justify-end absolute bottom-4 right-0'>
        <i className='bx bxs-message-square-add bg-violet-500 text-yellow-300 rounded-full p-2 text-5xl cursor-pointer relative w-14 h-14 before:content-["\ee3c"] before:absolute before:left-2/4 before:top-2/4 before:-translate-y-2/4 before:-translate-x-2/4'></i>
      </div>
      <NewRoom />
    </div>
  );
};
