import "./login.css";
import RoomIcon from '@mui/icons-material/Room';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import messDekho1 from "../assets/messDekho1.svg"

export default function Login({setShowLogin, myStorage, setCurrentUser}) {

    // const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef()
    // const emailRef = useRef()
    const passwordRef = useRef();

    const handelSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        }

        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setError(true);
        }

    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <RoomIcon/>
                DarkRaider's Pin
                {/* <img src={messDekho1} alt="" /> */}
            </div>
            <form onSubmit={handelSubmit}>
                <input type="text" placeholder="username" ref={nameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginButton">Login</button>

                {error && (
                    <span className="failure"> Something went wrong!</span>
                )}
            </form>
            <CloseIcon className="loginClose" onClick={()=>setShowLogin(false)}/>
        </div>
    );
}
