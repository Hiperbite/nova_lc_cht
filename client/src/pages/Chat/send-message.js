// client/src/pages/chat/send-message.js

import styles from "./styles.module.css";
import React, { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("send_message", { username, room, message, __createdtime__ });
      setMessage("");
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <div className="bg-light">
        <div className="input-group">
          <input
            onKeyUp={handleKeyPress}
            type="text"
            placeholder="Type a message"
            aria-describedby="button-addon2"
            className="form-control rounded-0 border-0 py-4 bg-light"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <div className="input-group-append">
            <button
              id="button-addon2"
              type="button"
              className="btn btn-link"
              onClick={sendMessage}
            >
              {" "}
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendMessage;
