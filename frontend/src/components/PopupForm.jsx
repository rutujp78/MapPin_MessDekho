import React, { useState } from 'react'
import PinServices from '../utils/pinServices';
import "./popupForm.css";

const PopupForm = ({ currentUser, newPlace, setNewPlace, pin, setIsEdit, isEdit }) => {
    const token = localStorage.getItem("token");

    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);

    const handleCreatePin = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title: title,
            desc: desc,
            rating: rating,
            lat: newPlace.lat,
            long: newPlace.lng,
        }

        const res = await PinServices.createPin(newPin, token);
        console.log(res);
        setNewPlace(null);
        window.location.reload();
    };

    const handleEditPin = async (e, pin) => {
        e.preventDefault();

        // Logic for edit pin for sending data to backend
        const editedPin = {
            ...pin,
            title: title === null ? pin.title : title,
            desc: desc === null ? pin.desc : desc,
            rating: rating === 0 ? pin.rating : rating,
        };

        const editPin = await PinServices.editPin(editedPin, token);
        const newEditedPin = editPin.editedPin;
        if (editPin.success === true) {
            pin.title = newEditedPin.title;
            pin.desc = newEditedPin.desc;
            pin.rating = newEditedPin.rating;

            setIsEdit(false);
            setTitle(null);
            setDesc(null);
            setRating(0);
        }
    };

    return (
        <>
            <div>
                <form onSubmit={isEdit ? (e) => handleEditPin(e, pin) : handleCreatePin}>
                    <label>Title</label>
                    <input placeholder='Enter a title'
                        defaultValue={isEdit ? pin.title : ""}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label>Review</label>
                    <textarea placeholder='Say us something about this place.' 
                        defaultValue={isEdit ? pin.desc : ""}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                    <label>Rating</label>
                    <select
                        defaultValue={isEdit ? pin.rating : 1}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button className='submitButton' type='submit'>{isEdit ? "Edit Pin" : "Add Pin"}</button>
                    {isEdit && (
                        <button className='submitButton' onClick={() => {
                            setIsEdit(false);
                            setTitle(null);
                            setRating(0);
                            setDesc(null);
                        }}>Cancle</button>
                    )}
                </form>
            </div>
        </>
    )
}

export default PopupForm;