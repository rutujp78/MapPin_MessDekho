import React, { useEffect, useState } from 'react';

import "./app.css";
import Register from './components/Register';
import Login from './components/Login';
import CustomMap from './components/CustomMap';
import axios from 'axios';

function App() {

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Local Storage
  const myStorage = window.localStorage;

  // For authentication and authorization stuff
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(myStorage.getItem("token"));

  const handleLogout = () => {
    myStorage.removeItem("user");
    myStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
  };

  useEffect(() => {
    async function fetchUser() {
      if(token) {
        const getUser = await axios.get("http://localhost:5000/api/users/getUser", { headers: { Authorization: `Bearer ${token}` } });

        if(getUser.data.success === true) {
          setCurrentUser(getUser.data.user.username);
        }
      }
    }

    fetchUser();
  }, []);

  return (
    <div className='App'>
      <CustomMap currentUser={currentUser}/>
      {currentUser ? (
        <button className='button logout' onClick={handleLogout}>Log out</button>
      ) : (
        <div className='buttons'>
          <button className='button login' onClick={() => { setShowLogin(true); setShowRegister(false) }}>Login</button>
          <button className='button register' onClick={() => { setShowRegister(true); setShowLogin(false) }}>Register</button>
        </div>
      )}
      {showRegister && (<Register setShowRegister={setShowRegister} />)}
      {showLogin && (<Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} setToken={setToken} />)}
    </div>
  );
}

export default App;