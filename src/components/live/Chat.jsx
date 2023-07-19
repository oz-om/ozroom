import ava_1 from "../../assets/images/ava_1.png";
import ava_2 from "../../assets/images/ava_2.png";
import ava_3 from "../../assets/images/ava_3.png";
import ava_4 from "../../assets/images/ava_4.png";
import { textAreaAutoResize } from "../global/index";
import Localbase from "localbase";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "../../context";

export default function Chat({ toggleChat }) {
  const { current: db } = useRef(new Localbase("ozroom"));
  const messageAria = useRef();
  const { socket, user } = useAppState();
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState("group");
  const [messagesStatus, setMessagesStatus] = useState(false);
  const [specialChat, setSpecialChat] = useState([]);
  db.config.debug = false;

  useEffect(() => {
    db.collection(`${activeChat}_messages`)?.delete();
    return () => {
      db.collection(`${activeChat}_messages`)?.delete();
    };
  }, []);

  useEffect(() => {
    socket.on("receive_msg", (msg) => {
      if (msg.to == "group") {
        db.collection(`${msg.to}_messages`).add(msg);
      } else {
        db.collection(`${msg.to.id}_messages`).add(msg);
      }
      setMessagesStatus((prev) => !prev);
    });
    return () => {
      socket.off("receive_msg");
    };
  }, []);

  function handleChat() {
    setActiveChat("group");
  }

  useEffect(() => {
    if (activeChat == "group") {
      db.collection("group_messages")
        .get()
        .then((messages) => {
          setMessages(messages);
        });
    } else {
      db.collection(`${activeChat.id}_messages`)
        .get()
        .then((messages) => {
          setMessages(messages);
        });
    }
  }, [activeChat, messagesStatus]);

  function sendMessage() {
    const { id, avatar, username } = user;
    if (messageAria.current.value.trim().length !== 0) {
      const myMessage = {
        to: activeChat,
        id,
        avatar,
        username,
        msg: messageAria.current.value,
        time: new Date().getTime(),
        room: id,
        socketId: socket.id,
      };
      if (activeChat == "group") {
        db.collection("group_messages").add(myMessage);
      } else {
        db.collection(`${activeChat.id}_messages`).add(myMessage);
      }
      socket.emit("sendMessage", myMessage);
      setMessagesStatus((prev) => !prev);
      messageAria.current.value = "";
    }
  }

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
              const { id, username, avatar, socketId } = chat;
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
              const { id, socketId, avatar, username, msg, time } = message;
              return <Message key={time} id={id} avatar={avatar} name={username} message={msg} time={time} setSpecialChat={setSpecialChat} socketId={socketId} />;
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

function Message({ id, socketId, avatar, name, message, time, setSpecialChat }) {
  let date = new Date(time);
  const msg_timestamp = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const optList = useRef();
  const { user } = useAppState();
  function switchOptions() {
    optList.current.classList.toggle("hidden");
  }
  function setupSpecialChat() {
    setSpecialChat((prev) => {
      let exist = prev.find((chat) => chat.id == id);
      if (!exist) {
        return [
          ...prev,
          {
            id,
            socketId,
            username: name,
            avatar,
          },
        ];
      }
      return prev;
    });
  }
  return (
    <div className={"chat-content__messages__item gap-x-2 flex " + (user.id == id && "flex-row-reverse ")}>
      <div className='chat-content__messages__item__avatar h-7 overflow-hidden rounded-full basis-7'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-content__messages__item__info max-w-[80%] rounded-md p-2 pb-0 pr-1 mb-2 bg-violet-500/50 w-fit relative'>
        <h4 className='text-xs font-bold'>{name}</h4>
        <p className='text-sm text-yellow-50 font-mono font-light'>{message}</p>
        <div className='chat-content__time flex justify-end'>
          <p className='text-xs text-gray-100/50 font-light right-0'>{msg_timestamp}</p>
        </div>
        <div className='options absolute right-0 top-0'>
          <i onClick={switchOptions} className='bx bx-chevron-down cursor-pointer'></i>
          <ul ref={optList} className='absolute top-3 w-28 mt-1 bg-violet-900/60 backdrop-blur-md rounded right-0  text-xs overflow-hidden hidden'>
            {user.id !== id && (
              <li onClick={setupSpecialChat} className='px-2 py-1 cursor-pointer '>
                special chat
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Member({ id, avatar, name, socketId, active, chatHandler, toggleChat }) {
  function handleChat(element) {
    chatHandler({
      id,
      socketId,
      name,
    });
    toggleChat(element);
  }
  return (
    <li onClick={handleChat} className={"chat-nav__item py-2 relative flex justify-start items-center gap-x-1 pr-1 hover:bg-violet-500/50 "}>
      <div className='chat-nav__item__avatar w-12 h-12 overflow-hidden rounded-full'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-nav__item__info hidden md:block'>
        <h4>{name}</h4>
      </div>
    </li>
  );
}
