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
      requests: state.requests.filter((request) => request.id != requestInfo.member.id),
      members: [...state.members, requestInfo.member],
    };
  }
  return {
    requests: state.requests.filter((request) => request.id != requestInfo.member.id),
  };
}

function handelControlledMembersTracks(controlledMembers, controlled) {
  let unUpdatedControlled = controlledMembers.filter((control) => control.id !== controlled.id);
  return [...unUpdatedControlled, controlled];
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

    case "pushRequest":
      return { ...state, requests: [...state.requests, payload] };
    case "setMyPeerId":
      return { ...state, myPeerId: payload };
    case "setPeers":
      return { ...state, Peers: [...state.Peers, payload] };
    case "handelRequest":
      let updateRequests = handelRequests({ requests: state.requests, members: state.members }, payload);
      return { ...state, ...updateRequests };

    case "setCall":
      return { ...state, call: payload };
    case "setMyStream":
      return { ...state, myStream: payload };
    case "setMember":
      return { ...state, members: [...state.members, payload] };
    case "removeMember":
      let updatedPeers = state.members.filter((peer) => peer.id != payload);
      let updatedMembers = state.members.filter((member) => member.id != payload);
      let updatedControlledFaces = state.controlledMembersFaces.filter((controlled) => controlled.id != payload);
      let updatedControlledAudios = state.controlledMembersAudios.filter((controlled) => controlled.id != payload);
      return { ...state, members: updatedMembers, Peers: updatedPeers, controlledMembersFaces: updatedControlledFaces, controlledMembersAudios: updatedControlledAudios };
    case "setControlledMemberFaces":
      let updateControlledFace = handelControlledMembersTracks(state.controlledMembersFaces, payload);
      return { ...state, controlledMembersFaces: updateControlledFace };
    case "setControlledMemberAudios":
      let updateControlledAudio = handelControlledMembersTracks(state.controlledMembersAudios, payload);
      return { ...state, controlledMembersAudios: updateControlledAudio };
    case "killRoom":
      return { ...state, myStream: null, members: [], requests: [], Peers: [], call: null, controlledMembersFaces: [], controlledMembersAudios: [] };
    default:
      return state;
  }
}
