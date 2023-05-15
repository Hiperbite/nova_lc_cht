// client/src/App.js

import './App.css';
import { useState } from 'react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';

//const socket = io.connect('http://localhost:4000');

const socket = io.connect('https://4000-hiperbite-novalccht-xxaa00vr6u5.ws-eu97.gitpod.io');
function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          {/* Add this */}
          <Route
            path='/chat'
            element={<Chat username={username} room={room} socket={socket} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;