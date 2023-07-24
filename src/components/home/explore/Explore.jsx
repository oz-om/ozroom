import { memo, lazy, useEffect } from "react";
import { TitlesBar } from "./TitlesBar";
import { Room } from "./Room";
import { useAppState } from "../../../context";
import { fetchRooms } from "../../../context/reducer";

const Pagination = lazy(() =>
  import("../explore/Pagination").then((module) => {
    return { default: module.Pagination };
  }),
);
function Explore() {
  const { rooms, dispatch } = useAppState();
  useEffect(() => {
    fetchRooms(1, 6).then((result) => {
      dispatch({ type: "fetchRooms", payload: { paginatedRooms: result.rooms, total: result.total } });
    });
  }, []);
  return (
    <div id='explore'>
      <TitlesBar />
      <div className='rooms-container-explore'>
        {rooms.paginatedRooms?.map((room) => {
          const { id, avatar, name, isPrivate, max, owner_id } = room;
          return <Room key={id} roomID={id} ownerID={owner_id} roomAvatar={avatar} roomName={name} isPrivate={+isPrivate} count='0' max={max} />;
        })}
      </div>
      {rooms.total && rooms.total > 5 && <Pagination totalPages={rooms.total} />}
    </div>
  );
}

export default memo(Explore);
