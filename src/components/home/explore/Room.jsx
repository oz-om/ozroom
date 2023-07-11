import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../../context";

let apiKey = process.env.VITE_API_KEY;

export const Room = ({ roomID, roomName, roomAvatar, isPrivate, count, max, ownerID }) => {
  const { dispatch, user, Peers, socket, Peer, members, call } = useAppState();
  const navigate = useNavigate();
  const { id, username, avatar } = user;
  async function handleJoin() {
    isRoomOnline().then((res) => {
      if (!res.isOnline) {
        return console.log(res.err);
      }
      socket.emit("callRequest", {
        senderRequest: {
          id,
          username,
          avatar,
          time: "12:30",
          state: "online",
          senderPeerId: Peers[0].PeerId,
          senderSocketId: socket.id,
        },
        receiverRequest: ownerID,
      });
    });
  }

  async function isRoomOnline() {
    let req = await fetch(`${apiKey}/is_room_online`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: roomID }),
      credentials: "include",
    });
    return await req.json();
  }

  useEffect(() => {
    if (call) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((myStream) => {
          dispatch({ type: "setMyStream", payload: myStream });
          navigate("/meeting");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [call]);

  return (
    <div id='room' className='grid grid-cols-[auto_1fr_1fr] gap-x-2 items-center justify-around p-1 rounded-lg max-h-28'>
      <div className='w-16 h-16 overflow-hidden my-1'>
        <img src={roomAvatar} alt='room cover' className='rounded-full object-cover h-full' />
      </div>
      <div className='md:grid grid-cols-[1fr_auto]'>
        <h4 className='line-clamp-2 py-2'>{roomName}</h4>
        <p className={"font-normal text-md relative w-16 greenPill md:grid md:items-center " + (isPrivate ? "after:bg-red-500" : "after:bg-green-500")}>{isPrivate ? "private" : "public"}</p>
      </div>
      <div id='room-details' className='grid items-center md:grid-cols-3'>
        <div id='count' className='col-span-1 text-center md:col-auto'>
          <span className='text-xs text-gray-100/50 font-light md:hidden'>members</span>
          <p className='text-xl text-cyan-400'>{count}</p>
        </div>
        <div id='max' className='col-span-1 text-center md:col-auto'>
          <span className='text-xs text-gray-100/50 font-light md:hidden'>max</span>
          <p className='text-xl text-orange-400'>{max}</p>
        </div>
        <div id='join' onClick={handleJoin} className='col-span-2 py-1 md:col-auto'>
          <button className='bg-violet-500 block p-2 w-6/12 mx-auto rounded-xl cursor-pointer hover:bg-violet-400'>join</button>
        </div>
      </div>
    </div>
  );
};
