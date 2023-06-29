import { Mirror } from "./Mirror";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../context";
import { useEffect, useRef, useState } from "react";
let apiKey = process.env.VITE_API_KEY;

export default function Meeting({ roomID, ownerID }) {
  const navigate = useNavigate();
  const { user, dispatch, streams, socket, Peer, remotePeersId } = useAppState();
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
        Peer.on("call", (call) => {
          console.log("receive call");
          call.answer(myStream);
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [remotePeersId]);

  useEffect(() => {
    if (myStream && remotePeersId.length) {
      remotePeersId.forEach((remotePeerId) => {
        let call = Peer.call(remotePeerId, myStream);
        let callInter;
        if (!Peer.open) {
          callInter = setInterval(() => {
            console.log("initializing call... to: ", remotePeerId);
            call = Peer.call(remotePeerId, myStream);
            call.on("stream", (remoteStream) => {
              clearInterval(callInter);
              setRemoteStream(remoteStream);
            });
          }, 10000);
        } else {
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
          });
        }
      });
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteStream && pushStream) {
      dispatch({ type: "pushStreams", payload: [remoteStream] });
      setPushStream(false);
      setRemoteStream(null);
    } else {
      setPushStream(true);
    }
  }, [remoteStream, pushStream]);

  async function meetingKill() {
    await myStream.getTracks().forEach(function (track) {
      track.stop();
    });
    navigate("/rooms");
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
