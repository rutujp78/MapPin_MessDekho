import "./login.css";
import RoomIcon from '@mui/icons-material/Room';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function Login({setShowLogin, setCurrentUser, setToken}) {

    const [error, setError] = useState(false);
    const nameRef = useRef()
    const passwordRef = useRef();

    const handelSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        }

        try {
            // const res = await axios.post("https://messdekho.onrender.com/api/users/login", user);
            const res = await axios.post("http://localhost:5000/api/users/login", user);

            localStorage.setItem("token", res.data.token);
            setCurrentUser(res.data.username);
            setToken(res.data.token);
            setShowLogin(false);
            setError(false);
        } catch (error) {
            setError(true);
            console.log("Error in login", error);
        }
    }

    return (
        <div className="loginContainer">
            <div className="loginLogo">
                <RoomIcon/>
                MessDekho
            </div>
            <form onSubmit={handelSubmit}>
                <input id="loginInputs" type="text" placeholder="username" ref={nameRef}/>
                <input id="loginInputs" type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginButton">Login</button>

                {error && (
                    <span className="failure"> Something went wrong!</span>
                )}
            </form>
            <CloseIcon className="loginClose" onClick={()=>setShowLogin(false)}/>
        </div>
    );
}
