import { Mirror } from "./Mirror";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../context";
import { useEffect, useState } from "react";
let apiKey = process.env.VITE_API_KEY;

export default function Meeting({ roomID, ownerID }) {
  const navigate = useNavigate();
  let { user, dispatch, myStream, socket, members, Peers, controlledMembersFaces, controlledMembersAudios } = useAppState();

  // tracks controls state
  const [streamDetails, setStreamDetails] = useState({
    video: true,
    audio: true,
  });

  useEffect(() => {
    socket.on("requestIntegrationCalls", (sender) => {
      socket.emit("makeIntegrationCalls", { receiverId: sender, Peers });
    });
    return () => {
      socket.off("requestIntegrationCalls");
    };
  }, [Peers]);

  function handleSelfControlled({ id, selfControlled }, dispatchType) {
    dispatch({
      type: dispatchType,
      payload: {
        id,
        selfControlled,
      },
    });
  }
  useEffect(() => {
    const handleSelfVideoControlled = (targetUser) => {
      handleSelfControlled(targetUser, "setControlledMemberFaces");
    };
    const handleSelfAudioControlled = (targetUser) => {
      handleSelfControlled(targetUser, "setControlledMemberAudios");
    };

    socket.on("controlled_his_video_track", handleSelfVideoControlled);
    socket.on("controlled_his_audio_track", handleSelfAudioControlled);
    return () => {
      socket.off("controlled_his_video_track", handleSelfVideoControlled);
      socket.off("controlled_his_audio_track", handleSelfAudioControlled);
    };
  }, [members, controlledMembersFaces, controlledMembersAudios]);

  function meetingKill() {
    closeStream()
      .then((result) => {
        if (!result?.killRoom) {
          console.log(result);
          return;
        }
        navigate("/rooms");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function closeStream() {
    await myStream.getTracks().forEach(function (track) {
      track.stop();
    });
    let req = await fetch(`${apiKey}/kill_room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomID }),
      credentials: "include",
    });
    return await req.json();
  }

  function handelTracksControls(tracksType, track, dispatchType) {
    myStream[tracksType]()[0].enabled = !myStream[tracksType]()[0].enabled;
    let trackState = myStream[tracksType]()[0].enabled;
    setStreamDetails((prev) => ({ ...prev, [track]: trackState }));
    dispatch({
      type: dispatchType,
      payload: {
        id: user.id,
        selfControlled: !trackState,
      },
    });
    members.forEach((member) => {
      socket.emit(`controlled_his_${track}_track`, { member: member.socketId, targetUser: user.id, selfControlled: !trackState });
    });
  }
  function myVideoControl() {
    handelTracksControls("getVideoTracks", "video", "setControlledMemberFaces");
  }
  function myAudioControl() {
    handelTracksControls("getAudioTracks", "audio", "setControlledMemberAudios");
  }

  return (
    <div className='meeting-container relative h-full'>
      <div className='meeting relative bg-red-50/10s  w-full  flex items-end justify-center gap-x-2 h-screen '>
        <Mirror isFullScreen={true} muted={true} stream={myStream} ownerStreamName={user.username} ownerStreamId={user.id} />
        {members.map(({ remoteStream, username, id }) => {
          return <Mirror key={id} isFullScreen={false} muted={false} stream={remoteStream} ownerStreamName={username} ownerStreamId={id} />;
        })}
      </div>
      <div className='mirror-controls justify-center items-center gap-x-4 mt-1 absolute top-9'>
        <div onClick={myVideoControl} className='mirror-controls__item cursor-pointer text-blue-500 bg-blue-500/20 rounded-md px-2 '>
          <i className={"bx text-3xl " + (streamDetails.video ? "bx-video " : "bx-video-off")}></i>
        </div>
        <div onClick={myAudioControl} className='mirror-controls__item cursor-pointer text-green-800 bg-green-500/20 rounded-md px-2'>
          <i className={"bx text-3xl " + (streamDetails.audio ? "bx-microphone" : "bx-microphone-off")}></i>
        </div>
        <div onClick={meetingKill} className='mirror-controls__item cursor-pointer text-red-500 bg-red-500/20 rounded-md px-2'>
          <i className='bx bxs-phone-off text-3xl '></i>
        </div>
      </div>
    </div>
  );
}
