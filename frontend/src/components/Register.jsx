import "./register.css";
import RoomIcon from '@mui/icons-material/Room';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function Register({setShowRegister}) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef();

    const handelSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setError(true);
        }

    }

    return (
        <div className="registerContainer">
            <div className="logo">
                <RoomIcon/>
                DarkRaider's Pin
            </div>
            <form onSubmit={handelSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="registerButton">Register</button>

                {success && (
                    <span className="success"> Successful. You can login now</span>
                )}
                {error && (
                    <span className="failure"> Something went wrong!</span>
                )}
            </form>
            <CloseIcon className="registerClose" onClick={()=>setShowRegister(false)}/>
        </div>
    );
}
