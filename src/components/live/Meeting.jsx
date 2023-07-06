import { Mirror } from "./Mirror";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../context";
import { useEffect, useState } from "react";
let apiKey = process.env.VITE_API_KEY;

export default function Meeting({ roomID, ownerID }) {
  const navigate = useNavigate();
  let { user, dispatch, streams, socket, Peer, call, members } = useAppState();
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState([]);
  // controls state
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((myStream) => {
        setMyStream(myStream);
        socket.on("new_member_join", (sender) => {
          dispatch({ type: "removeRequest", payload: { type: "approve", member: sender } });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (myStream && call) {
      call.answer(myStream);
      call.on("stream", (remoteStream) => {
        setRemoteStream((prev) => {
          const isAlreadyExist = prev.find((stream) => stream.remoteStream.id == remoteStream.id);
          if (!isAlreadyExist && !prev) {
            return [{ remoteStream, callerPeerId: call.metadata.callerPeerId }];
          }
          if (!isAlreadyExist && prev) {
            return [...prev, { remoteStream, callerPeerId: call.metadata.callerPeerId }];
          }
          return prev;
        });
      });
    }
  }, [myStream, call]);

  useEffect(() => {
    if (remoteStream) {
      remoteStream.forEach((remote) => {
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          if (member.PeerId == remote.callerPeerId) {
            let updatedMember = {
              ...member,
              remoteStream: remote.remoteStream,
            };
            dispatch({ type: "updateMember", payload: updatedMember });
            break;
          }
        }
      });
    }
  }, [remoteStream]);

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
  function myVideoControl() {
    myStream.getVideoTracks()[0].enabled = !myStream.getVideoTracks()[0].enabled;
    let videoState = myStream.getVideoTracks()[0].enabled;
    setEnableVideo(videoState);
  }
  function myAudioControl() {
    myStream.getAudioTracks()[0].enabled = !myStream.getAudioTracks()[0].enabled;
    let audioState = myStream.getAudioTracks()[0].enabled;
    setEnableAudio(audioState);
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
          <i className={"bx text-3xl " + (enableVideo ? "bx-video " : "bx-video-off")}></i>
        </div>
        <div onClick={myAudioControl} className='mirror-controls__item cursor-pointer text-green-800 bg-green-500/20 rounded-md px-2'>
          <i className={"bx text-3xl " + (enableAudio ? "bx-microphone" : "bx-microphone-off")}></i>
        </div>
        <div onClick={meetingKill} className='mirror-controls__item cursor-pointer text-red-500 bg-red-500/20 rounded-md px-2'>
          <i className='bx bxs-phone-off text-3xl '></i>
        </div>
      </div>
    </div>
  );
}
