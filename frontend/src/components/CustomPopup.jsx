import React from 'react'
import { Popup } from 'react-map-gl';
import PopupForm from './PopupForm';
import PopupCard from './PopupCard';

const CustomPopup = ({ newPlace, setNewPlace, currentUser, pin, showDetails }) => {

    return (
        <Popup
            latitude={newPlace ? newPlace.lat : pin.lat}
            longitude={newPlace ? newPlace.lng : pin.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
        >
            { newPlace && (
                <PopupForm currentUser={currentUser} newPlace={newPlace} setNewPlace={setNewPlace} pin={pin}/>
            ) }
            { showDetails && (  
                <PopupCard currentUser={currentUser} pin={pin} />
            ) }
        </Popup>
    )
}

export default CustomPopup