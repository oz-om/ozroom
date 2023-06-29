import { Mirror } from "./Mirror";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../context";
import { useEffect, useState } from "react";
let apiKey = process.env.VITE_API_KEY;

export default function Meeting({ roomID, ownerID }) {
  const navigate = useNavigate();
  let { user, dispatch, streams, socket, Peer, call } = useAppState();
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [pushStream, setPushStream] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((myStream) => {
        setMyStream(myStream);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (myStream && call) {
      call.answer(myStream);
      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        dispatch({ type: "setCall", payload: null });
      });
    }
  }, [myStream, call]);

  useEffect(() => {
    if (remoteStream && pushStream) {
      dispatch({ type: "pushStreams", payload: [remoteStream] });
      setPushStream(false);
      setRemoteStream(null);
    } else {
      setPushStream(true);
    }
  }, [remoteStream, pushStream]);

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

  return (
    <div className='meeting-container relative h-full'>
      <div className='meeting relative bg-red-50/10s  w-full  flex items-end justify-center gap-x-2 h-[93vh] '>
        <Mirror isFullScreen={true} stream={myStream} />
        {streams.map((stream, i) => {
          return <Mirror key={i} stream={stream} isFullScreen={false} />;
        })}
      </div>
      <div className='mirror-controls flex justify-center items-center gap-x-4 mt-1'>
        <div className='mirror-controls__item cursor-pointer text-green-500 bg-green-500/20 rounded-md px-2'>
          <i className='bx bx-microphone text-3xl'></i>
        </div>
        <div className='mirror-controls__item cursor-pointer text-blue-500 bg-blue-500/20 rounded-md px-2 '>
          <i className='bx bx-video text-3xl'></i>
        </div>
        <div onClick={meetingKill} className='mirror-controls__item cursor-pointer text-red-500 bg-red-500/20 rounded-md px-2'>
          <i className='bx bxs-phone-off text-3xl '></i>
        </div>
      </div>
    </div>
  );
}
