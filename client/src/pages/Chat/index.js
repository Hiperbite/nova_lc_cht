// client/src/pages/chat/index.js

// src/pages/chat/index.js
import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users"; // Add this
import SendMessage from "./send-message";
import MessagesReceived from "./messages";

const Chati = ({ username, room, socket }) => {
  return (
    <div className={styles.chatContainer}>
      {/* Add this */}
      <RoomAndUsersColumn socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
      </div>
    </div>
  );
};

const Start = ({ username, room, socket }) => {
  return (
    <div class="container py-5 px-4">
      <header class="text-center">
        <h1 class="display-4 text-white">Bootstrap Chat</h1>
        <p class="text-white lead mb-0">
          An elegant chat widget compatible with Bootstrap 4
        </p>
        <p class="text-white lead mb-4">
          Snippet by
          <a href="https://bootstrapious.com" class="text-white">
            <u>Bootstrapious</u>
          </a>
        </p>
      </header>

      <div class="row rounded-lg overflow-hidden shadow">
        <div class="col-5 px-0">
          <div class="bg-white">
            <RoomAndUsersColumn
              socket={socket}
              username={username}
              room={room}
            />
          </div>
        </div>

        <div class="col-7 px-0">
            <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
          
        </div>
      </div>
    </div>
  );
};

export default Start;
