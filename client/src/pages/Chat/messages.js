import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null); // Add this

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off("receive_message");
  }, [socket]);

  // Add this
  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  // Add this
  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef?.current?.scrollHeight;
  }, [messagesRecieved]);

  // Add this
  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div
      class="px-4 py-5 chat-box bg-white"
      ref={messagesColumnRef}
      style={{ minHeight: "50vh" }}
    >
      {messagesRecieved.map((msg, i) => (
        <div class="media w-50 ml-auto mb-3" key={i}>
          <div class="media-body">
            <div class="bg-primary rounded py-2 px-3 mb-2">
              {msg.username}
              <p class="text-small mb-0 text-white">{msg.message}</p>
            </div>
            <p class="small text-muted">
              {formatDateFromTimestamp(msg.__createdtime__)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
