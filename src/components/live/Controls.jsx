import { useEffect, useState } from "react";
import { useAppState } from "../../context";

export default function Controls() {
  const { dispatch, socket, requests, Peers, members } = useAppState();
  useEffect(() => {
    socket.on("receiveCallRequest", (request) => {
      dispatch({ type: "pushRequest", payload: request.senderRequest });
    });
  }, []);

  return (
    <div className='controls-content__wrap'>
      <div className='room_requests px-2'>
        <h4 className='text-xs text-gray-100/50 font-light mb-2'>requests</h4>
        <div className='requests__list'>
          {requests.map((request) => {
            let { id, avatar, senderPeerId, senderSocketId, username, time, state } = request;
            return <RequestItem key={id} id={id} PeerId={senderPeerId} socketId={senderSocketId} avatar={avatar} name={username} time={time} state={state} />;
          })}
        </div>
      </div>
      <div className='room_controls px-2'>
        <h4 className='text-xs text-gray-100/50 font-light mt-1 mb-2'>room manage</h4>
        <div className='room_controls__members_list'>
          {members.map((member) => {
            const { id, avatar, username, remoteStream } = member;
            return <RoomMemberItem key={id} id={id} avatar={avatar} name={username} stream={remoteStream} />;
          })}
        </div>
      </div>
    </div>
  );
}

function RequestItem({ id, PeerId, socketId, avatar, name, time, state }) {
  const { dispatch, socket, Peer, Peers, user, myStream, members } = useAppState();

  async function handleAccept() {
    const { id, username, avatar } = user;
    let call = await Peer.call(PeerId, myStream, {
      metadata: {
        callerInfo: {
          id,
          username,
          avatar,
          callerSocketId: socket.id,
          callerPeerId: Peers[0].PeerId,
          admin: true,
        },
      },
    });
    call
      .once("stream", (remoteStream) => {
        handleRequestDispatch(remoteStream);
      })
      .off();
  }
  function handleRequestDispatch(remoteStream) {
    dispatch({
      type: "handelRequest",
      payload: {
        type: "approve",
        member: {
          id,
          username: name,
          avatar,
          socketId,
          PeerId,
          remoteStream,
          admin: false,
        },
      },
    });
  }
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
        <button onClick={handleAccept} className='accept grid place-content-center bg-green-500/50 w-full h-2/4 rounded-md cursor-pointer'>
          <i className='bx bxs-plug text-green-300'></i>
        </button>
        <button className='reject grid place-content-center bg-red-500/50 w-full h-2/4 rounded-md cursor-pointer overflow-hidden'>
          <i className='bx bx-x text-2xl text-red-300'></i>
        </button>
      </div>
    </div>
  );
}

function RoomMemberItem({ id, avatar, name, stream }) {
  const { dispatch, socket, user, members, controlledMembersFaces, controlledMembersAudios } = useAppState();
  const [tracksDetails, setTracksDetails] = useState({
    video: true,
    audio: true,
  });

  function handelMemberTracks(trackType, emitTrack, dispatchType) {
    stream[trackType]()[0].enabled = !stream[trackType]()[0].enabled;
    members.forEach((member) => {
      socket.emit(`admin_control_${emitTrack}_tracks`, { member: member.socketId, targetUser: id, controlledByAdmin: !stream[trackType]()[0].enabled });
    });
    dispatch({
      type: dispatchType,
      payload: {
        id,
        controlledByMe: !stream[trackType]()[0].enabled,
      },
    });
  }
  function controlVideo() {
    handelMemberTracks("getVideoTracks", "video", "setControlledMemberFaces");
  }

  function controlAudio() {
    handelMemberTracks("getAudioTracks", "audio", "setControlledMemberAudios");
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
      <div className='room_controls__members_item__actions flex justify-center gap-x-1'>
        <div onClick={controlAudio} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
          <i className={"bx text-xl " + (tracksDetails.audio ? "bxs-microphone" : "bxs-microphone-off")}></i>
          <span className='text-xs font-light'>mute</span>
        </div>
        <div onClick={controlVideo} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
          <i className={"bx text-xl " + (tracksDetails.video ? "bxs-video" : "bxs-video-off")}></i>
          <span className='text-xs font-light'>face</span>
        </div>
        <div className='kick flex flex-col items-center justify-between w-full cursor-pointer bg-red-500/30 text-red-500 rounded-md py-1'>
          <i className='iconoir-flash-off text-xl'></i>
          <span className='text-xs font-light'>kill</span>
        </div>
      </div>
    </div>
  );
}
