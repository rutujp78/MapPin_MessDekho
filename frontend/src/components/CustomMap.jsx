import React, { useState, useEffect } from 'react'
import Map, { GeolocateControl, Marker } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import axios from "axios";
import CustomPopup from './CustomPopup';

const CustomMap = ({ currentUser }) => {
    const [pins, setPins] = useState([]);
    const [newPlace, setNewPlace] = useState(null);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: 77.7523,
        latitude: 20.9320,
        zoom: 12,
    });

    const handleMarkerClick = (id, lat, lng) => {
        setCurrentPlaceId(id);
    }

    // double tap for mobile logic
    const [lastTouch, setLastTouch] = useState(0);
    const handleTouch = (e) => {
        const currentTime = new Date().getTime();
        const timeSinceLastTouch = currentTime - lastTouch;
        if (timeSinceLastTouch < 400 && timeSinceLastTouch > 0) {
            handelAddClick(e);
        }
        setLastTouch(currentTime);
    }

    const handelAddClick = (e) => {
        let { lng, lat } = e.lngLat;
        setNewPlace({
            lng,
            lat
        });
    };

    useEffect(() => {
        const getPins = async () => {
            try {
                // const res = await axios.get("https://messdekho.onrender.com/api/pins");
                const res = await axios.get("http://localhost:5000/api/pins");
                setPins(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getPins();
    }, []);

    return (
        <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            // {...initialViewState}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            onDblClick={handelAddClick}
            onTouchStart={handleTouch}
            doubleClickZoom={false}
        // transitionDuration = "200"
        >
            <GeolocateControl position='bottom-right' trackUserLocation='true' showAccuracyCircle={false} fitBoundsOptions={{ zoom: 15 }}></GeolocateControl>
            {pins.map((p, i) => (
                <>
                    <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
                        <RoomIcon
                            style={{ color: p.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }}
                            onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                        />
                    </Marker>
                    {p._id === currentPlaceId && (
                        <CustomPopup key={i} newPlace={newPlace} setNewPlace={setNewPlace} currentUser={currentUser} pin={p} setPins={setPins} showDetails={true} />
                    )}
                    {/* )} */}
                </>
            ))}
            {(newPlace && currentUser) && (
                <CustomPopup newPlace={newPlace} setNewPlace={setNewPlace} currentUser={currentUser} pin={null} setPins={setPins} showDetails={false} />
            )}
        </Map>
    )
}

export default CustomMap