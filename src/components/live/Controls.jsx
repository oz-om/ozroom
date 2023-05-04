import ava_1 from "../../assets/images/ava_1.png";
import ava_2 from "../../assets/images/ava_2.png";
import ava_3 from "../../assets/images/ava_3.png";
import ava_4 from "../../assets/images/ava_4.png";

function RequestItem({ avatar, name, time, state }) {
  return (
    <div className='request__item grid grid-cols-[48px_1fr_1fr] gap-x-2 mb-2'>
      <div className='request__item__avatar w-12 h-12 rounded-full overflow-hidden'>
        <img src={avatar} alt='avatar' />
      </div>
      <div className='request__item__info'>
        <h5 className='req_name'>{name}</h5>
        <div className='request__item_other-info flex gap-x-2 items-center'>
          <span className='req_time text-sm text-gray-100 font-light'>{time}</span>
          <span className='req_state text-xs font-light text-green-400'>{state}</span>
        </div>
      </div>
      <div className='request__item__actions flex items-center justify-center gap-x-1'>
        <button className='accept grid place-content-center bg-green-500/50 w-full h-2/4 rounded-md cursor-pointer'>
          <i class='bx bxs-plug text-green-300'></i>
        </button>
        <button className='reject grid place-content-center bg-red-500/50 w-full h-2/4 rounded-md cursor-pointer'>
          <i className='bx bx-x text-2xl text-red-300'></i>
        </button>
      </div>
    </div>
  );
}
function RoomMemberItem({ avatar, name }) {
  return (
    <div className='room_controls__members_item grid grid-cols-[48px_1fr_1fr] items-center gap-x-2 mb-2'>
      <div className='room_controls__members_item__avatar w-12 h-12 rounded-full overflow-hidden'>
        <img src={avatar} alt='avatar' />
      </div>
      <div className='room_controls__members_item__info'>
        <h5 className='req_name'>{name}</h5>
      </div>
      <div className='room_controls__members_item__actions flex justify-center gap-x-1'>
        <div className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
          <i class='bx bxs-microphone-alt text-xl'></i>
          <span className='text-xs font-light'>mute</span>
        </div>
        <div className='kick flex flex-col items-center justify-between w-full cursor-pointer bg-red-500/30 text-red-500 rounded-md py-1'>
          <i className='iconoir-flash-off text-xl'></i>
          <span className='text-xs font-light'>kill</span>
        </div>
      </div>
    </div>
  );
}
export default function Controls() {
  return (
    <div className='controls-content__wrap'>
      <div className='room_requests px-2'>
        <h4 className='text-xs text-gray-100/50 font-light mb-2'>requests</h4>
        <div className='requests__list'>
          <RequestItem avatar={ava_1} name={"alex Ming"} time={"12:02"} state={"online"} />
          <RequestItem avatar={ava_4} name={"kuril melt"} time={"12:03"} state={"online"} />
        </div>
      </div>
      <div className='room_controls px-2'>
        <h4 className='text-xs text-gray-100/50 font-light mt-1 mb-2'>room manage</h4>
        <div className='room_controls__members_list'>
          <RoomMemberItem avatar={ava_1} name={"alex Ming"} />
          <RoomMemberItem avatar={ava_2} name={"John luisa"} />
          <RoomMemberItem avatar={ava_3} name={"Neil Bret"} />
          <RoomMemberItem avatar={ava_4} name={"Kuril melt"} />
        </div>
      </div>
    </div>
  );
}
