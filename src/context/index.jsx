import { createContext, useContext, useEffect, useReducer, useState } from "react";
import reducer from "./reducer";
import { io } from "socket.io-client";
import initPeer from "peerjs";

const context = createContext();
let apiKey = process.env.VITE_API_KEY;
const socket = io(apiKey);

export const StateProvider = ({ children }) => {
  const Peer = new initPeer();
  const appState = {
    loggedIn: false,
    user: {},
    rooms: [],
    myRooms: [],
    //
    requests: [],
    members: [],
    Peers: [],
    call: null, //call that we receive
    myStream: null,
    calls: [], // calls that we make
    controlledMembersFaces: [],
    controlledMembersAudios: [],
  };
  const [state, dispatch] = useReducer(reducer, appState);
  useEffect(() => {
    socket.emit("initRoom", state.user.id);
    if (state.user.id) {
      Peer.on("open", (myPeerId) => {
        const { user } = state;
        dispatch({ type: "setPeers", payload: [{ id: user.id, username: user.username, avatar: user.avatar, PeerId: myPeerId, socketId: socket.id }] });
      });

      Peer.on("call", (call) => {
        console.log("receive call state");
        dispatch({
          type: "setCall",
          payload: call,
        });
      });

      socket.on("room_initialized", () => {
        console.log("initialized");
      });
    }
  }, [state.user.id]);

  // const methods = {};

  return <context.Provider value={{ ...state, dispatch, socket, Peer }}>{children}</context.Provider>;
};

export const useAppState = () => {
  const appState = useContext(context);

  return appState;
};
