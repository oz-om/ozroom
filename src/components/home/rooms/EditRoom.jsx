import { Link, useLocation } from "react-router-dom";
import { useAppState } from "../../../context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { randomKey, copyKey, uploadGetNewUrl } from "../../global";
let apiKey = process.env.VITE_API_KEY;

export default function EditRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { myRooms, dispatch } = useAppState();

  const roomId = location.search.split("=")[1];
  const room = myRooms.find((room) => room.id === +roomId);

  const [updateRoom, setUpdateRoom] = useState({ ...room });

  useEffect(() => {
    if (!roomId) {
      navigate("/rooms");
    }
  }, [roomId]);

  function imagePreview(e) {
    let img = document.querySelector("#cover img");
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      img.src = reader.result;
      uploadGetNewUrl(img).then((newURL) => {
        setUpdateRoom((prev) => ({ ...prev, avatar: newURL }));
      });
    };
  }
  function handelInputs(e) {
    setUpdateRoom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function toggle(e) {
    // toggle between public and private
    let current = e.target.previousSibling; // get the input element
    let choices = e.target.parentElement.parentElement.children; // get the parent of the input element
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
    let limits = { two: 2, three: 3, four: 4, five: 5, six: 6 };
    toggle(e);
    setUpdateRoom((prev) => ({ ...prev, max: limits[e.target.getAttribute("for")] }));
  }
  function updateRoomState(e) {
    let stat = {
      private: true,
      public: false,
    };
    if (stat[e.target.getAttribute("for")] && !updateRoom.key) {
      let private_key = randomKey();
      setUpdateRoom((prev) => ({ ...prev, private_key }));
    }
    setUpdateRoom((prev) => ({ ...prev, isPrivate: stat[e.target.getAttribute("for")] }));
    toggle(e);
  }
  async function updateRoomInfo(e) {
    let req = await fetch(`${apiKey}/update_room`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRoom),
      credentials: "include",
    });
    let res = await req.json();
    if (res.updateRoom) {
      dispatch({ type: "updateRoom", payload: updateRoom.id });
      navigate("/rooms");
    } else {
      console.log(res);
    }
  }

  return (
    <div id='edit-container' className='max-h-[88vh] overflow-y-auto pb-5'>
      <div id='navigate'>
        <Link to='/rooms' className='flex items-center gap-x-2'>
          <i className='bx bx-arrow-back'></i>
          <span>back</span>
        </Link>
      </div>
      <section id='room-details' className='flex flex-col gap-4 max-w-3xl mx-auto sm:flex-row'>
        <div id='general' className='rounded-md bg-violet-500/20 py-7 px-3 grow'>
          <div id='cover' className='relative w-52 h-52 mx-auto'>
            <img src={updateRoom.avatar} alt='cover' className='w-full h-full rounded-full border object-cover' />
            <label htmlFor='upPhoto' className='w-full h-full cursor-pointer rounded-full mx-auto border flex justify-center items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
              <i className='bx bxs-camera-plus text-2xl'></i>
            </label>
            <input type='file' id='upPhoto' className='hidden' onChange={imagePreview} />
          </div>
          <div id='room-name' className='flex justify-center flex-col py-10 px-10'>
            <label htmlFor='name' className='text-sm text-gray-100/80 font-light mr-1'>
              room name:
            </label>
            <input type='text' name='name' placeholder='group name' value={updateRoom.name} onInput={handelInputs} className='input w-full' />
          </div>
          <div id='insertState'>
            <h4 className="'text-sm text-gray-100/80 font-light mr-1'">status:</h4>
            <div id='room-state' className='flex gap-x-2'>
              <div className='basis-1/2'>
                <input type='radio' id='public' className='peer hidden' defaultChecked={+updateRoom.isPrivate ? false : true} />
                <label htmlFor='public' onClick={updateRoomState} className='checkbox'>
                  public
                </label>
              </div>
              <div className='basis-1/2'>
                <input type='radio' id='private' className='peer hidden' defaultChecked={+updateRoom.isPrivate ? true : false} />
                <label htmlFor='private' onClick={updateRoomState} className='checkbox'>
                  private
                </label>
              </div>
            </div>
          </div>
          {+updateRoom.isPrivate ? (
            <div id='Key' className='flex flex-wrap items-center gap-x-3 my-5'>
              <h4 className='whitespace-nowrap text-sm text-gray-100/80 font-light mr-1'>private Key:</h4>
              <input type='text' id='privatekey' readOnly value={updateRoom.private_key} className='w-36 bg-transparent px-3 py-1 rounded-md bg-indigo-700' />
              <button onClick={copyKey} className='bg-violet-500 block p-1 text-sm font-light w-16 rounded-xl cursor-pointer hover:bg-violet-600'>
                copy
              </button>
            </div>
          ) : (
            ""
          )}
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
        </div>
        <div className='grow grid grid-rows-[auto_1fr]'>
          <div id='topic' className='bg-violet-700/20 py-7 px-3 rounded-md'>
            <h4 className="'text-sm text-gray-100/80 font-light mr-1'">topic:</h4>
            <input type='text' name='topic' placeholder='topic' value={updateRoom.topic} onInput={handelInputs} className='resize-none input no-scrollbar w-full' />
          </div>
          <div id='desc' className='bg-violet-900/20 py-7 px-3 rounded-md'>
            <h4 className="'text-sm text-gray-100/80 font-light mr-1'">description:</h4>
            <textarea name='description' value={updateRoom.description} placeholder='description...' onInput={handelInputs} className='resize-none input no-scrollbar w-full h-[95%]'></textarea>
          </div>
        </div>
      </section>
      <div id='update-button' className='mt-5'>
        <button onClick={updateRoomInfo} className='bg-violet-500 block py-3 text-sm font-light w-52 mx-auto rounded-xl cursor-pointer hover:bg-violet-600'>
          update
        </button>
      </div>
    </div>
  );
}
