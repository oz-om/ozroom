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
    streams: [],
    role: "caller",
    remotePeersId: [],
    requests: [],
    members: [],
    PeersId: [],
    call: null,
  };
  const [state, dispatch] = useReducer(reducer, appState);
  useEffect(() => {
    socket.emit("initRoom", state.user.id);
    if (state.user.id) {
      Peer.on("open", (myPeerId) => {
        dispatch({ type: "setPeersId", payload: myPeerId });
      });
      Peer.on("call", (call) => {
        console.log("receive call state");
        dispatch({ type: "setCall", payload: call });
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
