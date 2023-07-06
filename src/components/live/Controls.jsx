import { useEffect, useState } from "react";
import { useAppState } from "../../context";

export default function Controls() {
  const { dispatch, socket, requests, Peers, members } = useAppState();
  useEffect(() => {
    socket.on("receiveRequestPeer", (requestInfo) => {
      dispatch({ type: "pushRequest", payload: requestInfo.senderRequest });
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
  const { dispatch, socket, Peers, user } = useAppState();

  function handleAccept() {
    socket.emit("approveRequest", { senderRequest: id, socketId, roomPeers: Peers, accepter: user.id });
    // dispatch({ type: "removeRequest", payload: { id, type: "approve", member: { id, PeerId, avatar, username: name, remoteStream: null } } });
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
  const { socket, user, members } = useAppState();
  function controlAudio() {
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    members.forEach((member) => {
      socket.emit("admin_control_audio_tracks", { member: member.socketId, targetUser: id, controlledByAdmin: !stream.getAudioTracks()[0].enabled });
    });
  }
  function controlVideo() {
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
    members.forEach((member) => {
      socket.emit("admin_control_video_tracks", { member: member.socketId, targetUser: id, controlledByAdmin: !stream.getVideoTracks()[0].enabled });
    });
  }
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
          <i className='bx bxs-microphone-alt text-xl'></i>
          <span className='text-xs font-light'>mute</span>
        </div>
        <div onClick={controlVideo} className='mute flex flex-col items-center justify-between w-full cursor-pointer bg-sky-500/30 text-sky-300 rounded-md py-1'>
          <i className='bx bxs-video text-xl'></i>
          <span className='text-xs font-light'>face-on</span>
        </div>
        <div className='kick flex flex-col items-center justify-between w-full cursor-pointer bg-red-500/30 text-red-500 rounded-md py-1'>
          <i className='iconoir-flash-off text-xl'></i>
          <span className='text-xs font-light'>kill</span>
        </div>
      </div>
    </div>
  );
}
