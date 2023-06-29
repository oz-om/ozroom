let apiKey = process.env.VITE_API_KEY;
export async function fetchRooms() {
  let req = await fetch(`${apiKey}/get_rooms`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let res = await req.json();
  if (!res.getRooms) {
    return ["error"];
  }
  return res.rooms;
}

export async function fetchMyRooms() {
  let req = await fetch(`${apiKey}/get_my_rooms`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let res = await req.json();
  if (!res.getMyRooms) {
    return ["error"];
  }
  return res.myRooms;
}

function unUpdateRooms(rooms, updatedRoom) {
  return rooms.filter((room) => room.id != updatedRoom);
}

function handelRequests(state, requestInfo) {
  if (requestInfo.type == "approve") {
    return {
      requests: state.requests.filter((request) => request.id != requestInfo.id),
      members: [...state.members, requestInfo.member],
      PeersId: [...state.PeersId, requestInfo.member.PeerId],
    };
  }
  return {
    requests: state.requests.filter((request) => request.id != requestInfo.id),
  };
}

export default function reducer(state, { type, payload }) {
  switch (type) {
    case "login":
      return { ...state, loggedIn: true, user: payload };
    case "logout":
      return { ...state, loggedIn: false, user: {}, myRooms: [], rooms: [] };
    case "addNewRoom":
      return { ...state, myRooms: [...state.myRooms, payload] };
    case "fetchRooms":
      return { ...state, rooms: payload };

    case "fetchMyRooms":
      return { ...state, myRooms: payload };
    case "updateRoom":
      let myRooms = [payload, ...unUpdateRooms(state.myRooms, payload)];
      return { ...state, myRooms };
    case "deleteRoom":
      let updateRoom = [...unUpdateRooms(state.myRooms, payload)];
      return { ...state, myRooms: updateRoom };
    case "changeRole":
      return { ...state, role: payload };
    case "setRemotePsid":
      return { ...state, remotePeersId: payload };
    case "pushRequest":
      return { ...state, requests: [...state.requests, payload] };
    case "setPeersId":
      return { ...state, PeersId: [...state.PeersId, payload] };
    case "removeRequest":
      let updateRequests = handelRequests({ requests: state.requests, members: state.members, PeersId: state.PeersId }, payload);
      return { ...state, ...updateRequests };
    case "setCall":
      return { ...state, call: payload };
    case "pushStreams":
      return { ...state, streams: [...state.streams, ...payload] };
    default:
      return state;
  }
}
