import { useState } from "react";
import { useAppState } from "../../../context";
import { copyKey, getCreateRoomBlock, randomKey, textAreaAutoResize, uploadGetNewUrl } from "../../global";
let apiKey = process.env.VITE_API_KEY;

export const NewRoom = () => {
  const [room, setRoom] = useState({
    name: "",
    avatar: "https://avatars.dicebear.com/api/bottts/ele.svg?background=%23425ACC",
    max: 2,
    isPrivate: false,
    private_key: null,
    topic: "",
    description: "",
  });
  const { dispatch } = useAppState();

  function imagePreview(e) {
    let img = document.querySelector("#cover img");
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
      uploadGetNewUrl(img).then((newURL) => {
        setRoom((prev) => ({ ...prev, avatar: newURL }));
      });
    };
  }

  function handelInputs(e) {
    setRoom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function toggle(e) {
    let current = e.target.previousSibling;
    let choices = e.target.parentElement.parentElement.children;
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].querySelector("input") != current) {
        choices[i].querySelector("input").classList.remove("peer");
        choices[i].querySelector("input").removeAttribute("checked");
      } else {
        choices[i].querySelector("input").classList.add("peer");
        choices[i].querySelector("input").setAttribute("checked", "checked");
      }
    }
  }
  function setMax(e) {
    let nums = { two: 2, three: 3, four: 4, five: 5, six: 6 };
    let current = e.target.previousSibling;
    toggle(e);
    setRoom((prev) => ({ ...prev, max: nums[current.id] }));
  }
  function setRomState(e) {
    let stat = {
      private: true,
      public: false,
    };
    let current = e.target.previousSibling;
    setRoom((prev) => ({ ...prev, isPrivate: stat[current.id] }));
    toggle(e);
    if (stat[current.id]) {
      let private_key = randomKey();
      setRoom((prev) => ({ ...prev, private_key }));
    }
  }

  async function createRoom() {
    if (room.name.trim().length && room.topic.trim().length && room.description.trim().length) {
      let req = await fetch(`${apiKey}/create_room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
        credentials: "include",
      });
      let res = await req.json();
      if (res.createRoom) {
        dispatch({ type: "addNewRoom", payload: { ...room, id: res.roomId } });
        close();
      }
    }
  }
  function close() {
    // reset room
    setRoom({
      name: "",
      avatar: "https://avatars.dicebear.com/api/bottts/ele.svg?background=%23425ACC",
      max: 2,
      isPrivate: false,
      private_key: null,
      topic: "",
      description: "",
    });
    // reset max member choices and state choices
    let statesChoices = document.querySelectorAll("#room-state input");
    let maxChoices = document.querySelectorAll("#maxChoices input");
    function reset(choices) {
      choices.forEach((choice) => {
        choice.classList.remove("peer");
        choice.removeAttribute("checked");
      });
      choices[0].setAttribute("checked", "checked");
      choices[0].classList.add("peer");
    }
    reset(maxChoices);
    reset(statesChoices);
    getCreateRoomBlock();
  }

  return (
    <div id='create-container' className='hidden absolute w-full h-full top-0 left-0 backdrop-blur-md justify-center overflow-y-auto pl-2 overflow-hidden bg-black/25'>
      <div id='close' onClick={close} className='absolute top-2 right-2 z-[1]'>
        <i className='bx bx-x-circle text-2xl text-teal-400 cursor-pointer'></i>
      </div>
      <div id='create' className='backdrop-blur-md bg-indigo-800/50 px-3 mt-2 rounded-md shadow shadow-sky-50/50 h-full max-w-sm min-w-[343.41px]'>
        <div id='cover' className='relative'>
          <img src={room.avatar} alt='cover' className='w-28 h-28 rounded-full mx-auto border object-cover' />
          <label htmlFor='upPhoto' className='w-28 h-28 cursor-pointer rounded-full mx-auto border flex justify-center items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
            <i className='bx bxs-camera-plus text-2xl'></i>
          </label>
          <input type='file' id='upPhoto' className='hidden' onChange={imagePreview} />
        </div>
        <div id='insertName' className=''>
          <h4>Group Name:</h4>
          <input type='text' id='gbName' name='name' value={room.name} placeholder='group name' onInput={handelInputs} className='input' />
        </div>
        <div id='insertMax' className=''>
          <h4>max members:</h4>
          <div id='maxChoices' className='grid grid-cols-3 gap-4'>
            <div>
              <input type='radio' name='two' id='two' className='hidden peer' defaultChecked />
              <label htmlFor='two' className='checkbox' onClick={setMax}>
                two
              </label>
            </div>
            <div>
              <input type='radio' name='three' id='three' className='hidden' />
              <label htmlFor='three' className='checkbox' onClick={setMax}>
                three
              </label>
            </div>
            <div>
              <input type='radio' name='four' id='four' className='hidden' />
              <label htmlFor='four' className='checkbox' onClick={setMax}>
                four
              </label>
            </div>
          </div>
        </div>
        <div id='insertState'>
          <h4>status:</h4>
          <div id='room-state' className='flex gap-x-2'>
            <div className='basis-1/2'>
              <input type='radio' id='public' className='peer hidden' defaultChecked />
              <label htmlFor='public' className='checkbox' onClick={setRomState}>
                public
              </label>
            </div>
            <div className='basis-1/2'>
              <input type='radio' id='private' className='peer hidden' />
              <label htmlFor='private' className='checkbox' onClick={setRomState}>
                private
              </label>
            </div>
          </div>
        </div>
        {room.isPrivate && (
          <div id='Key' className='flex items-center gap-x-3'>
            <h4 className='whitespace-nowrap'>private Key:</h4>
            <input type='text' id='privatekey' readOnly value={room.private_key} className='w-36 bg-transparent px-3 py-1 rounded-md bg-indigo-700' />
            <button onClick={copyKey} className='bg-violet-500 block p-1 text-sm font-light w-16 rounded-xl cursor-pointer'>
              copy
            </button>
          </div>
        )}
        <div id='topic'>
          <h4>topic:</h4>
          <input type='text' name='topic' value={room.topic} placeholder='topic' onInput={handelInputs} className='input' />
        </div>
        <div id='desc' className=''>
          <h4>description:</h4>
          <textarea
            name='description'
            value={room.description}
            placeholder='insert description'
            onInput={(e) => {
              textAreaAutoResize(e);
              handelInputs(e);
            }}
            className='resize-none input no-scrollbar w-10/12'
          ></textarea>
        </div>
        <button className='w-36 bg-pink-500/75 py-2 px-4 mx-auto my-4 rounded-md block' onClick={createRoom}>
          create room
        </button>
      </div>
    </div>
  );
};
