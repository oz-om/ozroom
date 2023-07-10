import { useAppState } from "../../context";
import { useState, useEffect } from "React";
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
  const [tracksDetails, setTracksDetails] = useState({
    video: true,
    audio: true,
  });

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
    if (controlledMember && controlledMember.controlledByAdmin) {
      dispatch({
        type: dispatchType,
        payload: {
          ...controlledMember,
          controlledByMe: !controlledMember.controlledByMe,
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

  useEffect(() => {
    if (controlledMembersFaces.length) {
      controlledMembersFaces.forEach((controlled) => {
        if (controlled.id == id) {
          if (controlled.controlledByMe) {
            setTracksDetails((prev) => ({ ...prev, video: false }));
          } else {
            setTracksDetails((prev) => ({ ...prev, video: true }));
          }
        }
      });
    }
    if (controlledMembersAudios.length) {
      controlledMembersAudios.forEach((controlled) => {
        if (controlled.id == id) {
          if (controlled.controlledByMe) {
            setTracksDetails((prev) => ({ ...prev, audio: false }));
          } else {
            setTracksDetails((prev) => ({ ...prev, audio: true }));
          }
        }
      });
    }
  }, [controlledMembersFaces, controlledMembersAudios]);
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
            <i className={"bx text-xl " + (tracksDetails.audio ? "bxs-microphone" : "bxs-microphone-off")}></i>
            <span className='text-xs font-light'>mute</span>
          </div>
          <div onClick={handelFaceControl} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
            <i className={"bx text-xl " + (tracksDetails.video ? "bxs-video" : "bxs-video-off")}></i>
            <span className='text-xs font-light'>face</span>
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
