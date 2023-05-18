const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
import { Server } from "socket.io";

import harperSaveMessage from './harper-save-message';
import harperGetMessages from './harper-get-messages'; // Add this


app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

const CHAT_BOT = "ChatBot"; // Add this
let chatRoom = ""; // E.g. javascript, node,...
let allUsers: any[] = []; // All users in current chat room
let rooms: any[] = []; // All users in current chat room
// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", (socket: any) => {
  console.log(`User connected ${socket.id}`);
  socket.emit("chat_rooms", rooms)
  io.emit("chat_rooms", rooms)
  // We can write our socket event listeners in here...
});

server.listen(7200, () => "Server is running on port 3000");


// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  // Add a user to a room
  socket.on("join_room", (data: any) => {
    let __createdtime__ = Date.now(); // Current timestamp
    if (allUsers.find(({ username }: any) => username === data.username))
      return true;
    const { username, room , user} = data; // Data sent from client when join_room event emitted
    if (room && rooms.find(({room:r}: any) => r === room)) { } else {
      rooms.push({ username, room, user , __createdtime__})
    }
    
    socket.join(room); // Join the user to a socket room
    allUsers.push({ id: socket.id, username, room });
    // Add this
    
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      user:{username},
      __createdtime__,
    });
    // Add this
    // Save the new user to the room
    
    const chatRoomUsers = allUsers.filter((user: any) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    //io.emit("chatroom_users", allUsers);
    io.emit("chat_rooms", rooms)
    // Add this
    // Send welcome msg to user that just joined chat only
    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from the chat');
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      const chatRoomUsers = allUsers.filter((user: any) => user.room === chatRoom);
      socket.to(chatRoom).emit('chatroom_users', chatRoomUsers);
      socket.to(chatRoom).emit('receive_message', {
        message: `${user.username} has disconnected from the chat.`,
        username: CHAT_BOT,
      });
    }
  });

  socket.on('leave_room', (data: any) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    const chatRoomUsers = allUsers.filter((user: any) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    //rooms=rooms.filter(({room:r}) => r!==room)
    io.emit("chat_rooms", rooms)
    socket.emit("chat_rooms", rooms)
    console.log(`${username} has left the chat`);
  });
  socket.on('send_message', (data) => {

    console.log('SEND MESSAGE----------------------------------------------------------------------------------')
    console.log(data)
    console.log('----------------------------------------------------------------------------------')
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data); // Send to all users in room, including sender
  });
});

function leaveRoom(userID: any, chatRoomUsers: any) {
  return chatRoomUsers.filter((user: any) => user.id != userID);
}
