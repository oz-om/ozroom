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
      Peers: [...state.Peers, requestInfo.member],
    };
  }
  return {
    requests: state.requests.filter((request) => request.id != requestInfo.id),
  };
}

function updateMember(members, updatedMember) {
  let unUpdatedMembers = members.filter((member) => member.id !== updatedMember.id);
  return [...unUpdatedMembers, updatedMember];
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

    case "pushRequest": // answer side
      return { ...state, requests: [...state.requests, payload] };
    case "setPeers": // two sides [caller, answer]
      return { ...state, Peers: [...state.Peers, ...payload] };
    case "handelRequest": // answer side
      let updateRequests = handelRequests({ requests: state.requests, members: state.members, Peers: state.Peers }, payload);
      return { ...state, ...updateRequests };
    case "setCall": // two sides
      return { ...state, call: payload };
    case "setCalls": // caller side
      return { ...state, calls: [...state.calls, payload] };
    case "setMyStreamAndMembers": // caller side
      return { ...state, myStream: payload.myStream, members: [...state.members, ...payload.roomMembers] };
    case "updateMember": // caller side
      let updatedMembers = updateMember(state.members, payload);
      return { ...state, members: updatedMembers };
    case "memberJoin": // answer side
      return { ...state, members: [...state.members, payload] };
    case "setControlledMemberFaces":
      let updateControlledFace = handelControlledMembersTracks(state.controlledMembersFaces, payload);
      return { ...state, controlledMembersFaces: updateControlledFace };
    case "setControlledMemberAudios":
      let updateControlledAudio = handelControlledMembersTracks(state.controlledMembersAudios, payload);
      return { ...state, controlledMembersAudios: updateControlledAudio };

    default:
      return state;
  }
}
