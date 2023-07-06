import { Mirror } from "./Mirror";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../context";
import { memo, useEffect, useRef, useState } from "react";
let apiKey = process.env.VITE_API_KEY;

function Meeting() {
  const navigate = useNavigate();
  const { user, dispatch, socket, Peer, Peers, call, members, myStream, calls, controlledMembersFaces, controlledMembersAudios } = useAppState();
  const [remoteStream, setRemoteStream] = useState([]);
  const [joinStream, setJoinStream] = useState([]);
  // controls state
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);

  // make calls situation
  useEffect(() => {
    if (myStream && calls.length) {
      calls.forEach((call) => {
        call?.on("stream", (remoteStream) => {
          setRemoteStream((prev) => [...prev, { remoteStream, streamerPeerId: call.peer }]);
        });
      });
    }
  }, [calls]);

  useEffect(() => {
    if (remoteStream.length) {
      remoteStream.forEach((remote) => {
        for (let n = 0; n < members.length; n++) {
          const member = members[n];
          if (remote.streamerPeerId == member.PeerId) {
            const memberWithStream = {
              ...member,
              remoteStream: remote.remoteStream,
            };
            dispatch({ type: "updateMember", payload: memberWithStream });
            break;
          }
        }
      });
    }
  }, [remoteStream]);

  // receive call situation
  useEffect(() => {
    socket.on("new_member_join", (sender) => {
      dispatch({ type: "memberJoin", payload: sender });
    });
    if (myStream && call) {
      call.answer(myStream);
      call.on("stream", (remoteStream) => {
        setJoinStream((prev) => {
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
    if (joinStream) {
      joinStream.forEach((remote) => {
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
  }, [joinStream]);

  useEffect(() => {
    const handleAdminControlTracks = (targetUser, controlledMembersTracks, getTracks, dispatchType) => {
      let controlledMember = controlledMembersTracks.find((controlled) => controlled.id == targetUser.id);
      if (targetUser.id != user.id) {
        if (!controlledMember) {
          members.forEach((member) => {
            if (member.id == targetUser.id) {
              member.remoteStream[getTracks]()[0].enabled = !targetUser.controlledByAdmin;
            }
          });
          dispatch({
            type: dispatchType,
            payload: {
              ...targetUser,
              controlledByMe: false,
            },
          });
        } else {
          members.forEach((member) => {
            if (member.id == targetUser.id && !controlledMember.controlledByMe) {
              member.remoteStream[getTracks]()[0].enabled = !targetUser.controlledByAdmin;
            }
          });
          dispatch({
            type: dispatchType,
            payload: {
              ...controlledMember,
              controlledByAdmin: targetUser.controlledByAdmin,
            },
          });
        }
      }
    };
    const handleAdminControlVideoTracks = (targetUser) => {
      handleAdminControlTracks(targetUser, controlledMembersFaces, "getVideoTracks", "setControlledMemberFaces");
    };
    const handleAdminControlAudioTracks = (targetUser) => {
      handleAdminControlTracks(targetUser, controlledMembersAudios, "getAudioTracks", "setControlledMemberAudios");
    };
    socket.on("admin_control_video_tracks", handleAdminControlVideoTracks);
    socket.on("admin_control_audio_tracks", handleAdminControlAudioTracks);
    return () => {
      socket.off("admin_control_video_tracks", handleAdminControlVideoTracks);
      socket.off("admin_control_audio_tracks", handleAdminControlAudioTracks);
    };
  }, [members, controlledMembersFaces, controlledMembersAudios]);

  // let controlledMember = controlledMembersFaces.find((controlled) => controlled.id == targetUser.id);
  // if (targetUser.id != user.id) {
  //   if (!controlledMember) {
  //     members.forEach((member) => {
  //       if (member.id == targetUser.id) {
  //         member.remoteStream.getVideoTracks()[0].enabled = !targetUser.controlledByAdmin;
  //       }
  //     });
  //     dispatch({
  //       type: "setControlledMemberFaces",
  //       payload: {
  //         ...targetUser,
  //         controlledByMe: false,
  //       },
  //     });
  //   } else {
  //     members.forEach((member) => {
  //       if (member.id == targetUser.id && !controlledMember.controlledByMe) {
  //         member.remoteStream.getVideoTracks()[0].enabled = !targetUser.controlledByAdmin;
  //       }
  //     });
  //     dispatch({
  //       type: "setControlledMemberFaces",
  //       payload: {
  //         ...controlledMember,
  //         controlledByAdmin: targetUser.controlledByAdmin,
  //       },
  //     });
  //   }
  // }

  async function meetingKill() {
    await myStream.getTracks().forEach(function (track) {
      track.stop();
    });
    navigate("/rooms");
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
          if (remoteStream) {
            if (remoteStream.id) {
              return <Mirror key={id} isFullScreen={false} muted={false} stream={remoteStream} ownerStreamName={username} ownerStreamId={id} />;
            }
          }
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

export default memo(Meeting);
