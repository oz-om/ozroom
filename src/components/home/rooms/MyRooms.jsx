import { getCreateRoomBlock } from "../../global";
import { Room } from "./Room";
import { NewRoom } from "./NewRoom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppState } from "../../../context";
import { fetchMyRooms } from "../../../context/reducer";

export default function MyRooms() {
  const { myRooms, dispatch } = useAppState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMyRooms().then((myRoomsData) => {
      dispatch({ type: "fetchMyRooms", payload: myRoomsData });
      setLoading(false);
    });
  }, []);

  return (
    <div id='rooms'>
      <div className='myRooms-container flex justify-center flex-wrap gap-2 max-h-[calc(100vh_-_160px)] overflow-hidden overflow-y-auto'>
        {loading ? (
          <div className='loading-container w-52 h-52 grid place-content-center'>
            <i className='bx bx-loader bx-spin'></i>
          </div>
        ) : myRooms.length ? (
          myRooms.map((room) => {
            const { id, avatar, name, topic, description, isPrivate, max, owner_id } = room;
            return <Room key={id} id={id} ownerID={owner_id} roomAvatar={avatar} roomName={name} topic={topic} desc={description} isPrivate={isPrivate} max={max} />;
          })
        ) : (
          <div className='mt-40'>
            <img className='ms-auto me-auto w-72' src='https://svgshare.com/i/w5q.svg' alt='empty' />
          </div>
        )}
      </div>
      <div id='add-room' onClick={getCreateRoomBlock} className='flex justify-end absolute bottom-4 right-0'>
        <i className='bx bxs-message-square-add bg-violet-500 text-yellow-300 rounded-full p-2 text-5xl cursor-pointer relative w-14 h-14 before:content-["\ee3c"] before:absolute before:left-2/4 before:top-2/4 before:-translate-y-2/4 before:-translate-x-2/4'></i>
      </div>
      <NewRoom />
    </div>
  );
}
