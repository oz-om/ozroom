import { Mirror } from "./Mirror";
import video_1 from "../../assets/videos/video_1.mp4";
import video_2 from "../../assets/videos/video_2.mp4";
import video_3 from "../../assets/videos/video_3.mp4";
import video_4 from "../../assets/videos/video_4.mp4";
import video_5 from "../../assets/videos/video_5.mp4";
import { useNavigate } from "react-router-dom";
let streams = [video_2, video_3, video_4, video_5];
export default function Meeting() {
  const navigate = useNavigate();
  function meetingKill() {
    navigate("/explore");
  }
  return (
    <div className='meeting-container relative h-full'>
      <div className='meeting relative bg-red-50/10s  w-full  flex items-end justify-center gap-x-2 h-[93vh] '>
        <Mirror stream={video_1} isFullScreen={true} />
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
