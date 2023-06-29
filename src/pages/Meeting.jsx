import { memo, useRef } from "react";
import Meeting from "../components/meeting/Meeting";
import Chat from "../components/meeting/Chat";
import Controls from "../components/meeting/Controls";

const MeetingUi = memo(() => {
  let { current: params } = useRef(new URL(document.location).searchParams);
  function toggleChat() {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.classList.toggle("h-full");
    chatContainer.classList.toggle("w-full");

    const chatContent = document.querySelector(".chat-content-wrap");
    chatContent.classList.toggle("hidden");
    chatContent.classList.toggle("grid");
  }

  function toggleRoomMange() {
    const controlsContainer = document.querySelector(".controls-container");
    controlsContainer.classList.toggle("w-72");

    const controlsContent = document.querySelector(".controls-content__container");
    controlsContent.classList.toggle("hidden");
  }

  return (
    <section className='live-wrapper h-screen bg-black/50'>
      <div className='wrapper relative '>
        <Meeting roomID={params.get("room")} ownerID={params.get("in")} />

        <div className='chat-container absolute top-0 left-0 z-[1] backdrop-blur-[70px] bg-violet-950 bg-opacity-50 max-w-3xl'>
          <div onClick={toggleChat} className='chat-icon-wrap cursor-pointer flex items-center px-2'>
            <span className='text-blue-400'>C</span>
            <span>hat</span>
            <i className='bx bxs-conversation text-xl cursor-pointer'></i>
          </div>
          <div className='chat-content-wrap hidden grid-cols-[20%_1fr] h-[calc(100%_-_28px)]'>
            <Chat toggleChat={toggleChat} />
          </div>
        </div>

        <div className='controls-container absolute top-0 right-0 rounded-sm z-[1] backdrop-blur-[70px] bg-violet-950 bg-opacity-50'>
          <div onClick={toggleRoomMange} className='controls-icon-wrap grid place-content-center w-6 ml-auto p-1'>
            <i className='bx bx-transfer-alt'></i>
          </div>
          <div className='controls-content__container hidden'>
            <Controls />
          </div>
        </div>
      </div>
    </section>
  );
});
export default MeetingUi;
