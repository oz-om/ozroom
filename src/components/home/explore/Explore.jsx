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
    fetchRooms().then((R) => {
      dispatch({ type: "fetchRooms", payload: R });
    });
  }, []);
  return (
    <div id='explore'>
      <TitlesBar />
      <div className='rooms-container-explore'>
        {rooms?.map((room) => {
          const { id, avatar, name, isPrivate, max, owner_id } = room;
          return <Room key={id} roomID={id} ownerID={owner_id} roomAvatar={avatar} roomName={name} isPrivate={isPrivate} count='0' max={max} />;
        })}
      </div>
      {rooms?.length > 6 && <Pagination />}
    </div>
  );
}

export default memo(Explore);
