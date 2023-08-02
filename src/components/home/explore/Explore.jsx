import { memo, lazy, useEffect } from "react";
import { TitlesBar } from "./TitlesBar";
import { Room } from "./Room";
import { useAppState } from "../../../context";
import { fetchRooms } from "../../../context/reducer";
import { useState } from "react";

const Pagination = lazy(() =>
  import("../explore/Pagination").then((module) => {
    return { default: module.Pagination };
  }),
);
function Explore() {
  const { rooms, dispatch } = useAppState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchRooms(1, 6).then((result) => {
      dispatch({ type: "fetchRooms", payload: { paginatedRooms: result.rooms, total: result.total } });
      setLoading(false);
    });
  }, []);
  return (
    <div id='explore'>
      <TitlesBar />
      <div className='rooms-container-explore'>
        {loading ? (
          <div className='loading-container w-52 h-52 grid place-content-center ms-auto me-auto'>
            <i className='bx bx-loader bx-spin'></i>
          </div>
        ) : rooms.paginatedRooms.length ? (
          rooms.paginatedRooms.map((room) => {
            const { id, avatar, name, isPrivate, max, owner_id } = room;
            return <Room key={id} roomID={id} ownerID={owner_id} roomAvatar={avatar} roomName={name} isPrivate={+isPrivate} count='0' max={max} />;
          })
        ) : (
          <div className='mt-40'>
            <img className='ms-auto me-auto w-72' src='https://svgshare.com/i/w5q.svg' alt='empty' />
          </div>
        )}
      </div>
      {rooms.total && rooms.total > 5 ? <Pagination totalPages={rooms.total} /> : ""}
    </div>
  );
}

export default memo(Explore);
