import { useEffect, useRef, useState } from "react";
import { useAppState } from "../../context";

export function Mirror({ isFullScreen, muted, stream, ownerStreamName, ownerStreamId }) {
  let currentVideo = useRef();
  const { controlledMembersFaces, controlledMembersAudios } = useAppState();
  const [streamDetails, setStreamDetails] = useState({
    video: true,
    audio: true,
  });

  useEffect(() => {
    currentVideo.current.srcObject = stream;
    currentVideo.current.muted = muted;
    currentVideo.current.play();
  }, [stream]);

  function handelStreamDetails(controlledMembers, track) {
    controlledMembers.forEach((controlled) => {
      if (controlled.id == ownerStreamId) {
        if (controlled.selfControlled || controlled.controlledByAdmin || controlled.controlledByMe) {
          setStreamDetails((prev) => ({ ...prev, [track]: false }));
        } else {
          setStreamDetails((prev) => ({ ...prev, [track]: true }));
        }
      }
    });
  }
  useEffect(() => {
    if (controlledMembersFaces.length) {
      handelStreamDetails(controlledMembersFaces, "video");
    }
    if (controlledMembersAudios.length) {
      handelStreamDetails(controlledMembersAudios, "audio");
    }
  }, [controlledMembersFaces, controlledMembersAudios]);

  function toggleFullScreen(e) {
    const mirrors = Array.from(document.querySelectorAll(".mirror"));

    const fullScreenMirror = mirrors.filter((mirror) => {
      return mirror.classList.contains("mirror_full_screen");
    });

    if (fullScreenMirror.length) {
      fullScreenMirror[0].classList.remove("mirror_full_screen");
      fullScreenMirror[0].classList.add("mirror_small_square");

      fullScreenMirror[0].querySelector(".mirror_name").classList.remove("text-center", "left-0", "right-0");
      fullScreenMirror[0].querySelector(".mirror_name").classList.add("bottom-0", "font-light", "text-xs");
      fullScreenMirror[0].querySelector(".mirror_details").classList.remove("top-8");
      fullScreenMirror[0].querySelector(".mirror_details").classList.add("bottom-0", "font-light", "text-xs");
    }

    let targetMirror = e.target.parentElement.parentElement;

    targetMirror.classList.add("mirror_full_screen");
    targetMirror.classList.remove("mirror_small_square");

    targetMirror.querySelector(".mirror_name").classList.add("text-center", "left-0", "right-0");
    targetMirror.querySelector(".mirror_name").classList.remove("bottom-0", "font-light", "text-xs");
    targetMirror.querySelector(".mirror_details").classList.add("top-8");
    targetMirror.querySelector(".mirror_details").classList.remove("bottom-0", "font-light", "text-xs");
  }

  return (
    <div id={ownerStreamId} className={"mirror w-full overflow-hidden " + (isFullScreen ? "mirror_full_screen" : "mirror_small_square")}>
      <div className='switch-key z-[1] right-2 top-2 cursor-pointer absolute'>
        <i onClick={toggleFullScreen} className='bx bx-fullscreen'></i>
      </div>
      <div className='mirror-video absolute left-0 top-0 w-full h-full'>
        <video autoPlay loop ref={currentVideo} className='bg-blue-400/50 w-full h-full  object-cover'>
          <source type='video/mp4' />
        </video>
      </div>
      <h4 className={"mirror_name absolute " + (isFullScreen ? "text-center left-0 right-0" : "bottom-0 font-light text-xs")}>{ownerStreamName}</h4>
      <div className={"mirror_details absolute right-0 " + (isFullScreen ? "top-8" : "bottom-0 font-light text-xs")}>
        <div className='video_stream'>
          <i className={"bx " + (streamDetails.video ? "bxs-show" : "bxs-hide")}></i>
        </div>
        <div className='audio_stream'>
          <i className={"bx " + (streamDetails.audio ? "bxs-microphone" : "bxs-microphone-off")}></i>
        </div>
      </div>
    </div>
  );
}
