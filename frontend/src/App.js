import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import "./app.css";
import axios from "axios";
import * as timeago from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';
// import { DoubleClickZoomHandler } from 'mapbox-gl';

function App() {

  // const [initialViewState, setInitialViewState] = useState({
  //   longitude: 77.7523,
  //   latitude: 20.9320,
  //   zoom: 14
  // });
  // const [showPopup, setShowPopup] = React.useState(true);
  const myStorage = window.localStorage;
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {

    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id,lat,lng) => {
    setCurrentPlaceId(id);
  }

  const handelAddClick = (e) => {
    // console.log(e);
    let { lng, lat } = e.lngLat;
    setNewPlace({
      lng,
      lat
    })
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
      username:currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    }

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }

  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div className='App'>
      <Map
        initialViewState={{
          longitude: 77.7523,
          latitude: 20.9320,
          zoom: 14,
          
        }}
        // {...initialViewState}
        
        style={{ width: "100vw", height: "100vh"  }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick = {handelAddClick}
        // transitionDuration = "200"
      >

        {pins.map((p) => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
              <RoomIcon
                style={{ color: p.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }}
                onClick={() => handleMarkerClick(p._id,p.lat,p.long)}
              />
            </Marker>
            {/* {p._id === currentPlaceId && ( */}
            {p._id === currentPlaceId && (
              <Popup 
              longitude={p.long} 
              latitude={p.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={()=>setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill(<StarIcon className='star' />)}
                  </div>
                  <label>Info</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{timeago.format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
            {/* )} */}
          </>
        ))}
        {newPlace && (

          <Popup
          latitude={newPlace.lat}
          longitude={newPlace.lng}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={()=>setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a title' onChange={(e)=>setTitle(e.target.value)}/>
                <label>Review</label>
                <textarea placeholder='Say us something about this place.' onChange={(e)=>setDesc(e.target.value)}/>
                <label>Rating</label>
                <select onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type='submit'>Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className='button logout' onClick={handleLogout}>Log out</button>
        ) : (
          <div className='buttons'>
            <button className='button login' onClick={()=>setShowLogin(true)}>Login</button>
            <button className='button register' onClick={()=>setShowRegister(true)}>Register</button>
          </div>

        )}
        {showRegister && (<Register setShowRegister={setShowRegister}/>)}
        {showLogin && (<Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>)}
      </Map>
    </div>
  );
}

export default App;
