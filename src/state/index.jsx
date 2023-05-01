import { createContext, useContext, useState } from "react";
import { rooms, myRooms } from "../assets/data";
import { wait } from "../components/global";

export const context = createContext();

const appState = {
  loggedIn: true,
  rooms: [],
  myRooms: [],
};

export const StateProvider = ({ children }) => {
  const [state, setState] = useState(appState);
  const login = () => {
    setState((prev) => ({ ...prev, loggedIn: true }));
  };
  const logout = () => {
    setState((prev) => ({ ...prev, loggedIn: false }));
  };
  const addNewRoom = (newRoom) => {
    setState((prev) => ({ ...prev, myRooms: [...prev.myRooms, newRoom] }));
  };
  const fetchRooms = async () => {
    wait(500).then(() => {
      setState((prev) => {
        return { ...prev, rooms, myRooms };
      });
    });
  };
  return <context.Provider value={{ ...state, login, logout, fetchRooms, addNewRoom }}>{children}</context.Provider>;
};

export const useAppState = () => {
  const { loggedIn, rooms, myRooms, login, logout, fetchRooms, addNewRoom } = useContext(context);

  return { loggedIn, rooms, myRooms, login, logout, fetchRooms, addNewRoom };
};
