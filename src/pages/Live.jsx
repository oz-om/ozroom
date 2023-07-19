import React, { memo, useEffect, useRef, useState } from "react";
import Meeting from "../components/live/Meeting";
import Chat from "../components/live/Chat";
import Controls from "../components/live/Controls";
import { useAppState } from "../context";

const Live = memo(() => {
  let { current: params } = useRef(new URL(document.location).searchParams);
  const [receiverRequest, setReceiveRequest] = useState(false);
  const { requests } = useAppState();

  function toggleChat() {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.classList.toggle("h-full");
    chatContainer.classList.toggle("w-full");

    const chatContent = document.querySelector(".chat-content-wrap");
    chatContent.classList.toggle("hidden");
    chatContent.classList.toggle("flex");
  }

  function toggleRoomMange() {
    const controlsContainer = document.querySelector(".controls-container");
    controlsContainer.classList.toggle("w-96");

    const controlsContent = document.querySelector(".controls-content__container");
    controlsContent.classList.toggle("hidden");

    setReceiveRequest(false);
  }
  useEffect(() => {
    if (requests.length != 0) {
      setReceiveRequest(true);
    } else {
      setReceiveRequest(false);
    }
  }, [requests.length]);

  return (
    <section className='live-wrapper h-screen bg-black/50'>
      <div className='wrapper relative '>
        <Meeting roomID={params.get("room")} />

        <div className='chat-container absolute top-0 left-0 z-[1] backdrop-blur-[70px] bg-violet-950 bg-opacity-50 max-w-3xl'>
          <div onClick={toggleChat} className='chat-icon-wrap cursor-pointer flex items-center px-2'>
            <span className='text-blue-400'>C</span>
            <span>hat</span>
            <i className='bx bxs-conversation text-xl cursor-pointer'></i>
          </div>
          <div className='chat-content-wrap hidden h-[calc(100%_-_28px)]'>
            <Chat toggleChat={toggleChat} />
          </div>
        </div>

        <div className='controls-container absolute top-0 right-0 rounded-sm z-[1] backdrop-blur-[70px] bg-violet-950 bg-opacity-50'>
          <div onClick={toggleRoomMange} className='controls-icon-wrap p-1 ml-auto flex justify-between'>
            <i className='bx bx-transfer-alt'></i>
            <i className='bx bxs-bell relative'>
              {receiverRequest && (
                <div className='requestsCount absolute bg-red-500 right-0 top-0 text-[10px] w-3 h-3 grid place-content-center rounded-full p-1 pt-1 pb-[6px]'>
                  <span>{requests.length}</span>
                </div>
              )}
            </i>
          </div>
          <div className='controls-content__container hidden'>
            <Controls />
          </div>
        </div>
      </div>
    </section>
  );
});

export default Live;
