import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit("leave_room", { username, room, __createdtime__ });
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="row">
        <div className="col col-md-6">
          <div className="bg-gray px-4 py-2 bg-light">
            <p className="h5 mb-0 py-1">{room}</p>
          </div>
        </div>
        <div className="col col-md-6 text-right">
          <button className="btn btn-sm btn-outline " onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </div>

      <div className="messages-box">
        <div className="list-group rounded-0">
          {roomUsers.map((user) => (
            <a className={"list-group-item list-group-item-action " + (user.username === username ? "active" : "") +" text-white rounded-0"}>
              <div className="media">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg"
                  alt="user"
                  width="50"
                  className="rounded-circle"
                  key={user.id}
                />
                <div className="media-body ml-4">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <h6
                      className="mb-0"
                      style={{
                        fontWeight: `${
                          user.username === username ? "bold" : "normal"
                        }`,
                      }}
                    >
                      {user.username}
                    </h6>
                    <small className="small font-weight-bold">25 Dec</small>
                  </div>
                  <p className="font-italic mb-0 text-small">...</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomAndUsers;
