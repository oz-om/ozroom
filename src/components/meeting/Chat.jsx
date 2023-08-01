import { useEffect, useRef, useState } from "react";
import ava_1 from "../../assets/images/ava_1.png";
import ava_2 from "../../assets/images/ava_2.png";
import ava_3 from "../../assets/images/ava_3.png";
import ava_4 from "../../assets/images/ava_4.png";
import { useAppState } from "../../context";
import { textAreaAutoResize } from "../global/index";
import localForage from "localforage";
import { useLocation } from "react-router-dom";

export default function Chat({ toggleChat }) {
  const messageAria = useRef();
  const { socket, user } = useAppState();
  const [activeChat, setActiveChat] = useState("group");
  const [messages, setMessages] = useState([]);
  const [messagesStatus, setMessagesStatus] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [specialChat, setSpecialChat] = useState([]);

  function handleChat() {
    setActiveChat("group");
  }
  function addNewMessageToDB(chat_name, msg) {
    let collection = localForage.createInstance({
      driver: localForage.INDEXEDDB,
      name: "ozroom",
      storeName: chat_name,
    });
    collection.setItem(Date.now(), msg);
  }
  function sendMessage() {
    const { id, avatar, username } = user;
    if (messageAria.current.value.trim().length !== 0) {
      const myMessage = {
        to: activeChat,
        id,
        username,
        avatar,
        msg: messageAria.current.value,
        time: new Date().getTime(),
        room: Number(params.get("room")),
        socketId: socket.id,
      };
      if (activeChat == "group") {
        addNewMessageToDB(`${activeChat}_messages`, myMessage);
      } else {
        addNewMessageToDB(`${activeChat.id}_messages`, myMessage);
      }
      socket.emit("sendMessage", myMessage);
      messageAria.current.value = "";
      setMessagesStatus((prev) => !prev);
    }
  }

  useEffect(() => {
    socket.on("receive_msg", (msg) => {
      if (msg.to == "group") {
        addNewMessageToDB(`group_messages`, msg);
      } else {
        addNewMessageToDB(`${msg.to.id}_messages`, msg);
        setSpecialChat([
          {
            id: msg.id,
            username: msg.username,
            avatar: msg.avatar,
            socketId: msg.socketId,
          },
        ]);
      }
      setMessagesStatus((prev) => !prev);
    });
    return () => {
      socket.off("receive_msg");
    };
  }, []);

  function getMessagesFromDB(chat) {
    setMessages([]);
    let allMessages = [];
    let collection = localForage.createInstance({
      driver: localForage.INDEXEDDB,
      name: "ozroom",
      storeName: chat,
    });
    const getRequest = collection.iterate((value) => {
      allMessages.push(value);
    });
    getRequest.then(() => {
      setMessages(allMessages);
    });
  }

  useEffect(() => {
    if (activeChat == "group") {
      getMessagesFromDB(`${activeChat}_messages`);
    } else {
      getMessagesFromDB(`${activeChat.id}_messages`);
    }
  }, [activeChat, messagesStatus]);

  function toggleACtiveChat(element) {
    let groupEle = document.querySelector(".group_itself");
    let specialChat = document.querySelectorAll("li.chat-nav__item");
    groupEle.classList.remove("activeChat");
    specialChat.forEach((chat) => {
      chat.classList.remove("activeChat");
    });
    element.currentTarget.classList.add("activeChat");
  }

  return (
    <>
      <i onClick={toggleChat} className='bx bx-chevrons-left text-xl cursor-pointer absolute right-0 top-0 '></i>
      <section className='chat-nav  pl-2 pt-2 backdrop-blur-[1px] rounded-xl '>
        <div onClick={handleChat} className='group_wrapper'>
          <h4 className='text-xs text-gray-100/50 font-light'>group</h4>
          <div onClick={toggleACtiveChat} className='group_itself relative activeChat'>
            <div className='group_details__avatar flex w-16 py-3'>
              <img src={ava_1} alt='member-prof-avatar' className='w-5 rounded-full relative ' />
              <img src={ava_2} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
              <img src={ava_3} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
              <img src={ava_4} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
            </div>
            {/* <div className='group_details__info hidden md:block'>
              <h4>el-Malvern</h4>
            </div> */}
          </div>
        </div>
        <div className='members'>
          <h4 className='text-xs text-gray-100/50 font-light'>special chat</h4>
          <ul>
            {specialChat.map((chat) => {
              const { id, socketId, username, avatar } = chat;
              return <Member key={id} id={id} avatar={avatar} name={username} socketId={socketId} active={false} chatHandler={setActiveChat} toggleChat={toggleACtiveChat} />;
            })}
          </ul>
        </div>
      </section>
      <section className='chat-container w-full rounded-md ml-1 overflow-hidden'>
        <div className='chat-head text-center py-3 bg-violet-900'>
          <h4 className='text-xs  font-light'>{activeChat == "group" ? "group" : activeChat.name} chat</h4>
        </div>
        <div className='chat-content relative border-l-2 border-l-violet-900 h-[calc(100%_-_40px)]'>
          <div className='chat-content__messages px-1 pt-2 h-[calc(100%_-_50px)] overflow-y-auto'>
            {messages.map((message) => {
              const { id, username, avatar, msg, socketId, time } = message;
              return <Message key={time} id={id} avatar={avatar} name={username} socketId={socketId} message={msg} time={time} />;
            })}
          </div>
          <div className='chat-content__input flex items-end absolute w-full bottom-0 bg-violet-900 py-2 gap-x-1 px-1'>
            <textarea ref={messageAria} type='text' onInput={textAreaAutoResize} placeholder='Type a message' className='w-full h-full max-h-32 bg-transparent outline-none resize-none border font-mono border-gray-100/50 rounded-md no-scrollbar py-1 px-2' rows={1} />
            <div className='chat-content__elements flex'>
              <i className='bx bx-paperclip text-2xl text-blue-500/50 cursor-pointer'></i>
              <i onClick={sendMessage} className='bx bx-send text-2xl text-green-500/50 cursor-pointer'></i>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Message({ id, avatar, name, socketId, message, time }) {
  let date = new Date(time);
  const msg_timestamp = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const { socket } = useAppState();
  return (
    <div className={"chat-content__messages__item flex gap-x-2 " + (socket.id == socketId && "flex-row-reverse")}>
      <div className='chat-content__messages__item__avatar h-7 overflow-hidden rounded-full basis-7'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-content__messages__item__info max-w-[80%] rounded-md p-2 pb-0 pr-1 mb-2 bg-violet-500/50 w-fit'>
        <h4 className='text-xs font-bold'>{name}</h4>
        <p className='text-sm text-yellow-50 font-mono font-light'>{message}</p>
        <div className='chat-content__time flex justify-end'>
          <p className='text-xs text-gray-100/50 font-light right-0'>{msg_timestamp}</p>
        </div>
      </div>
    </div>
  );
}

function Member({ id, avatar, name, socketId, active, chatHandler, toggleChat }) {
  const { user } = useAppState();
  function handleChat(element) {
    chatHandler({
      id: user.id,
      socketId,
      name,
    });
    toggleChat(element);
  }
  return (
    <li onClick={handleChat} className={"chat-nav__item py-2 relative flex justify-start items-center gap-x-1 pr-1 hover:bg-violet-500/50 " + (active && "bg-violet-900 after:content-[''] after:absolute after:-right-[5px] after:top-2/4 after:border-8 after:border-transparent after:border-r-violet-900")}>
      <div className='chat-nav__item__avatar w-12 h-12 overflow-hidden rounded-full'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-nav__item__info hidden md:block'>
        <h4>{name}</h4>
      </div>
    </li>
  );
}
