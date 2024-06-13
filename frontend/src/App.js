import React, { useEffect, useState } from 'react';
import Map, { GeolocateControl, Marker, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "./app.css";
import axios from "axios";
import * as timeago from "timeago.js";
import Register from './components/Register';
import Login from './components/Login';

function App() {

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Local Storage
  const myStorage = window.localStorage;

  // For authentication and authorization stuff
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [token, setToken] = useState(myStorage.getItem("token"));

  // For Pins
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 77.7523,
    latitude: 20.9320,
    zoom: 12,
  })

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("https://messdekho.onrender.com/api/pins");
        // const res = await axios.get("http://localhost:5000/api/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lng) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.lng,
    }

    try {
      const res = await axios.post("https://messdekho.onrender.com/api/pins", newPin, { headers: { Authorization: `Bearer ${token}`}});
      // const res = await axios.post("http://localhost:5000/api/pins", newPin, { headers: { Authorization: `Bearer ${token}` } });
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }

  }

  const handleEditPin = async (e, pin) => {
    e.preventDefault();

    // Logic for edit pin for sending data to backend
    const editedPin = {
      ...pin,
      title: title === null ? pin.title : title,
      desc: desc === null ? pin.desc : desc,
      rating: rating === 0 ? pin.rating : rating,
    }

    const editPin = await axios.put("https://messdekho.onrender.com/api/pins/editpin", editedPin, { headers: { Authorization: `Bearer ${token}` } });
    // const editPin = await axios.put("http://localhost:5000/api/pins/editpin", editedPin, { headers: { Authorization: `Bearer ${token}` } });
    pin.title = editPin.data.title;
    pin.desc = editPin.data.desc;
    pin.rating = editPin.data.rating;

    // console.log(editPin);

    setIsEdit(false);
    setTitle(null);
    setDesc(null);
    setRating(0);
  }

  const deletePin = async (pin) => {
    const pinId= pin._id;
    const deletedPin = await axios.delete(`https://messdekho.onrender.com/api/pins/deletepin/${pinId}`, { headers: { Authorization: `Bearer ${token}` } });
    // const deletedPin = await axios.delete(`http://localhost:5000/api/pins/deletepin/${pinId}`, { headers: { Authorization: `Bearer ${token}` } });
    setIsDelete(false);
    window.location.reload();
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    myStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
  }

  let touches = 0;
  const handleTouch = (e) => {
    touches++;
    if (touches === 2) {
      touches = 0;
      handelAddClick(e);
    }
  }

  return (
    <div className='App'>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        // {...initialViewState}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handelAddClick}
        onTouchStart={handleTouch}
      // transitionDuration = "200"
      >
        <GeolocateControl position='bottom-right' trackUserLocation='true' showAccuracyCircle={false} fitBoundsOptions={{ zoom: 15 }}></GeolocateControl>
        {pins.map((p) => (
          <>


            <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
              <RoomIcon
                style={{ color: p.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => { setCurrentPlaceId(null); setIsEdit(false); }}
              >
                {p.username === currentUser ?

                  <>

                    {isEdit === false ?

                      <div className='card'>
                        <label>Place
                          <span><EditIcon style={{ height: '17px', cursor: 'pointer' }} onClick={() => setIsEdit(true)} /></span>
                          <span><DeleteIcon style={{ height: '17px', cursor: 'pointer' }} onClick={() => setIsDelete(true)} /></span>
                        </label>
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
                      :

                      <div>
                        <form onSubmit={(e) => handleEditPin(e, p)}>
                          <label>Title</label>
                          <input defaultValue={p.title} onChange={(e) => setTitle(e.target.value)} />
                          <label>Review</label>
                          <textarea defaultValue={p.desc} onChange={(e) => setDesc(e.target.value)} />
                          <label>Rating</label>
                          <select defaultValue={p.rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          <button className='submitButton' type='submit'>Edit Pin</button>
                          <button className='submitButton' onClick={() => {
                            setIsEdit(false);
                            setTitle(null);
                            setRating(0);
                            setDesc(null);
                          }}>Cancle</button>
                        </form>
                      </div>


                    }


                  </>
                  :
                  <>
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
                  </>
                }
              </Popup>

            )}
            {isDelete && (
                  <div className="delete-container">
                    <div className='delete-container-second'>
                      <div className="delete-cross">
                        <span></span>
                        <span className="delete-cross-second" onClick={() => setIsDelete(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="delete-cross-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>

                        </span>
                      </div>
                      <div className="delete-caution flex flex-col">
                        <h2 style={{ color: 'black', margin: '5px' }}>Are you sure do you want to delete pin.</h2>
                        <button style={{ width: '150px' }} type="action" className='submitButton' onClick={() => deletePin(p)}>Delete Pin</button>
                      </div>
                    </div>
                  </div>
                )}

            {/* )} */}
          </>
        ))}
        {(newPlace && currentUser) && (

          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.lng}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder='Say us something about this place.' onChange={(e) => setDesc(e.target.value)} />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
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
            <button className='button login' onClick={() => { setShowLogin(true); setShowRegister(false) }}>Login</button>
            <button className='button register' onClick={() => { setShowRegister(true); setShowLogin(false) }}>Register</button>
          </div>

        )}
        {showRegister && (<Register setShowRegister={setShowRegister} />)}
        {showLogin && (<Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} setToken={setToken} myStorage={myStorage} />)}
      </Map>
    </div>
  );
}

export default App;
