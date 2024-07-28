import React, { useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as timeago from "timeago.js";
import PopupForm from './PopupForm';
import DeletePin from './DeletePin';
import "./popupCard.css";

const PopupCard = ({ currentUser, pin }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    return (
        <>
            {isEdit ? <PopupForm pin={pin} setIsEdit={setIsEdit} isEdit={isEdit}/> : (
                <div className='card'>
                    <label>Place
                        {(pin && pin.username === currentUser) && (
                            <div className="">
                                <span><EditIcon style={{ height: '17px', cursor: 'pointer' }} onClick={() => setIsEdit(true)} /></span>
                                <span><DeleteIcon style={{ height: '17px', cursor: 'pointer' }} onClick={() => setIsDelete(true)} /></span>
                            </div>
                        )}
                    </label>
                    <h4 className='place'>{pin.title}</h4>
                    <label>Review</label>
                    <p className='desc'>{pin.desc}</p>
                    <label>Rating</label>
                    <div className='stars'>
                        {Array(pin.rating).fill(<StarIcon className='star' />)}
                    </div>
                    <label>Info</label>
                    <span className='username'>{pin.createdAt !== pin.updatedAt ? "Edited " : "Created "} by <b>{pin.username}</b></span>
                    <span className='date'>{timeago.format(pin.createdAt !== pin.updatedAt ? pin.updatedAt : pin.createdAt)}</span>
                </div>
            )}
            {isDelete && (
                <DeletePin pin={pin} setIsDelete={setIsDelete} />            
            )}
        </>
    )
}

export default PopupCard