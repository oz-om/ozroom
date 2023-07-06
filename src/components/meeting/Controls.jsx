import { useAppState } from "../../context";

export default function Controls({ ownerID }) {
  const { members } = useAppState();
  return (
    <div className='controls-content__wrap'>
      <div className='room_controls px-2'>
        <h4 className='text-xs text-gray-100/50 font-light mt-1 mb-2'>room manage</h4>
        <div className='room_controls__members_list'>
          {members.map((member) => {
            const { id, username, avatar, remoteStream } = member;
            return <RoomMemberItem key={id} id={id} avatar={avatar} name={username} stream={remoteStream} isAdmin={String(id) == ownerID} />;
          })}
        </div>
      </div>
    </div>
  );
}

function RoomMemberItem({ id, avatar, name, stream, isAdmin }) {
  const { dispatch, controlledMembersFaces, controlledMembersAudios } = useAppState();
  function handleTracksControls(controlledMembers, tracks, dispatchType) {
    let controlledMember = controlledMembers.find((controlled) => controlled.id == id);
    if (!controlledMember) {
      stream[tracks]()[0].enabled = !stream[tracks]()[0].enabled;
      dispatch({
        type: dispatchType,
        payload: {
          id,
          controlledByMe: !stream[tracks]()[0].enabled,
          controlledByAdmin: false,
        },
      });
      return;
    }
    if (controlledMember && !controlledMember.controlledByAdmin) {
      stream[tracks]()[0].enabled = !stream[tracks]()[0].enabled;
      dispatch({
        type: dispatchType,
        payload: {
          ...controlledMember,
          controlledByMe: !stream[tracks]()[0].enabled,
        },
      });
    }
  }
  function handelMuteControl() {
    handleTracksControls(controlledMembersAudios, "getAudioTracks", "setControlledMemberAudios");
  }
  function handelFaceControl() {
    handleTracksControls(controlledMembersFaces, "getVideoTracks", "setControlledMemberFaces");
  }
  return (
    <div className='room_controls__members_item grid grid-cols-[48px_1fr_1fr] items-center gap-x-2 mb-2'>
      <div className='room_controls__members_item__avatar w-12 h-12 rounded-full overflow-hidden'>
        <img src={avatar} alt='avatar' />
      </div>
      <div className='room_controls__members_item__info'>
        <h5 className='req_name'>{name}</h5>
      </div>
      {!isAdmin && (
        <div className='room_controls__members_item__actions flex justify-center gap-x-1'>
          <div onClick={handelMuteControl} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
            <i className='bx bxs-microphone-alt text-xl'></i>
            <span className='text-xs font-light'>mute</span>
          </div>
          <div onClick={handelFaceControl} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
            <i className='bx bxs-video text-xl'></i>
            <span className='text-xs font-light'>face-on</span>
          </div>
          {/* <div className='kick flex flex-col items-center justify-between w-full cursor-pointer bg-red-500/30 text-red-500 rounded-md py-1'>
            <i className='iconoir-flash-off text-xl'></i>
            <span className='text-xs font-light'>kill</span>
          </div> */}
        </div>
      )}
    </div>
  );
}
