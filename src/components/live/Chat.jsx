import ava_1 from "../../assets/images/ava_1.png";
import ava_2 from "../../assets/images/ava_2.png";
import ava_3 from "../../assets/images/ava_3.png";
import ava_4 from "../../assets/images/ava_4.png";

function Member({ avatar, name, active }) {
  return (
    <li className={"chat-nav__item py-2 relative hover:bg-violet-500/50 " + (active && "bg-violet-900 after:content-[''] after:absolute after:-right-[5px] after:top-2/4 after:border-8 after:border-transparent after:border-r-violet-900")}>
      <div className='chat-nav__item__avatar w-12 h-12 overflow-hidden rounded-full'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-nav__item__info hidden md:block'>
        <h4>{name}</h4>
      </div>
    </li>
  );
}
function Message({ avatar, name, message, time }) {
  return (
    <div className='chat-content__messages__item grid grid-cols-[28px_1fr] gap-x-2'>
      <div className='chat-content__messages__item__avatar h-7 overflow-hidden rounded-full'>
        <img src={avatar} alt='prof-avatar' />
      </div>
      <div className='chat-content__messages__item__info rounded-md p-2 pb-0 pr-1 mb-2 bg-violet-500/50 w-fit'>
        <h4 className='text-xs font-bold'>{name}</h4>
        <p className='text-sm text-yellow-50 font-mono font-light'>{message}</p>
        <div className='chat-content__time flex justify-end'>
          <p className='text-xs text-gray-100/50 font-light right-0'>{time}</p>
        </div>
      </div>
    </div>
  );
}

export default function Chat({ toggleChat }) {
  return (
    <>
      <i onClick={toggleChat} className='bx bx-chevrons-left text-xl cursor-pointer absolute right-0 top-0 '></i>
      <section className='chat-nav  pl-2 pt-2 backdrop-blur-[1px] rounded-xl '>
        <div className='group'>
          <h4 className='text-xs text-gray-100/50 font-light'>group</h4>
          <div className='group_details'>
            <div className='group_details__avatar flex w-16 py-3'>
              <img src={ava_1} alt='member-prof-avatar' className='w-5 rounded-full relative ' />
              <img src={ava_2} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
              <img src={ava_3} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
              <img src={ava_4} alt='member-prof-avatar' className='w-5 rounded-full relative -ml-2' />
            </div>
            <div className='group_details__info hidden md:block'>
              <h4>el-Malvern</h4>
            </div>
          </div>
        </div>
        <div className='members'>
          <h4 className='text-xs text-gray-100/50 font-light'>members</h4>
          <ul>
            <Member avatar={ava_1} name={"el-Malvern"} active={true} />
            <Member avatar={ava_2} name={"Alex Nae"} active={false} />
            <Member avatar={ava_3} name={"Adam Louise"} active={false} />
            <Member avatar={ava_4} name={"Martin kiddo"} active={false} />
          </ul>
        </div>
      </section>
      <section className='chat-container rounded-md ml-1 overflow-hidden'>
        <div className='chat-head text-center py-3 bg-violet-900'>
          <h4 className='text-xs  font-light'>Group chat</h4>
        </div>
        <div className='chat-content relative border-l-2 border-l-violet-900 h-[calc(100%_-_40px)]'>
          <div className='chat-content__messages px-1 h-[calc(100%_-_50px)] overflow-y-auto'>
            <Message avatar={ava_1} name={"el-Malvern"} message={"Hello, how are you?"} time={"12:00"} />
            <Message avatar={ava_2} name={"Alex Nae"} message={"I'm fine, thanks!"} time={"12:01"} />
            <Message avatar={ava_3} name={"Adam Louise"} message={"Hello, how are you?. I'm fine, thanks!"} time={"12:02"} />
          </div>
          <div className='chat-content__input flex items-end absolute w-full bottom-0 bg-violet-900 py-2'>
            <textarea type='text' placeholder='Type a message' className='w-full h-full bg-transparent outline-none resize-none border font-mono border-gray-100/50 rounded-md no-scrollbar py-1 px-2' rows={1} />
            <div className='chat-content__elements flex'>
              <i className='bx bx-paperclip text-2xl text-blue-500/50'></i>
              <i className='bx bx-send text-2xl text-green-500/50'></i>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
