import { memo, lazy } from "react";
import { TitlesBar } from "./TitlesBar";
import { Room } from "./Room";

const Pagination = lazy(() =>
  import("../explore/Pagination").then((module) => {
    return { default: module.Pagination };
  }),
);
export const Explore = memo(({ rooms }) => {
  return (
    <div id='explore'>
      <TitlesBar />
      <div className='rooms-container-explore'>
        {rooms.map((room) => {
          const { id, cover, name, isPrivate, max } = room;
          return <Room key={id} roomAvatar={cover} roomName={name} isPrivate={isPrivate} count='0' max={max} />;
        })}
      </div>
      {rooms.length > 6 && <Pagination />}
    </div>
  );
});
