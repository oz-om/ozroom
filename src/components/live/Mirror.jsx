import { useEffect, useRef } from "react";

export function Mirror({ isFullScreen, stream }) {
  let currentVideo = useRef();

  useEffect(() => {
    if (stream) {
      currentVideo.current.srcObject = stream;
      currentVideo.current.play();
    }
  }, [stream]);

  function toggleFullScreen(e) {
    const mirrors = Array.from(document.querySelectorAll(".mirror"));

    const fullScreenMirror = mirrors.filter((mirror) => {
      return mirror.classList.contains("mirror_full_screen");
    });

    fullScreenMirror[0].classList.remove("mirror_full_screen");
    fullScreenMirror[0].classList.add("mirror_small_square");
    let targetMirror = e.target.parentElement.parentElement;

    targetMirror.classList.add("mirror_full_screen");
    targetMirror.classList.remove("mirror_small_square");
  }

  return (
    <div className={"mirror w-full overflow-hidden " + (isFullScreen ? "mirror_full_screen" : "mirror_small_square")}>
      <div className='switch-key z-[1] right-2 top-2 cursor-pointer absolute'>
        <i onClick={toggleFullScreen} className='bx bx-fullscreen'></i>
      </div>
      <div className='mirror-video absolute left-0 top-0 w-full h-full'>
        <video autoPlay muted loop ref={currentVideo} className='bg-blue-400/50 w-full h-full  object-cover'>
          <source type='video/mp4' />
        </video>
      </div>
    </div>
  );
}
