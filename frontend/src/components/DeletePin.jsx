import React from 'react'
import PinServices from '../utils/pinServices';
import './deletePin.css';

const DeletePin = ({ pin, setIsDelete }) => {
    const token = localStorage.getItem("token");

    const deletePin = async (pin) => {
        const pinId = pin._id;
        const res = PinServices.deletePin(pinId, token);
        if (res.success === true) {
            // toast
        }
        else {
            // toast
        }
        setIsDelete(false);
        window.location.reload();
    }

    return (
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
                    <button style={{ width: '150px' }} type="action" className='submitButton' onClick={() => deletePin(pin)}>Delete Pin</button>
                </div>
            </div>
        </div>
    )
}

export default DeletePin