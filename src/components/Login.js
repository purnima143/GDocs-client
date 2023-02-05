import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/icon240.png"
import axios from "axios"
import Home from './Home';
const baseURL = `${process.env.REACT_APP_DB_URL}`;

function Login() {
    let navigate = useNavigate();
    const [profile, setProfile] = useState([]);
    const clientId = '511409920344-vo1djfu0s7brq3f00atui6q2d67mogk6.apps.googleusercontent.com';
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        localStorage.setItem('email', res.profileObj?.email)
        localStorage.setItem('username', res.profileObj?.name)
        localStorage.setItem('pic', res.profileObj?.imageUrl)

        axios.post(baseURL, { 'email': res.profileObj?.email })
            .then(response => { console.log(response) })
            .then(error => { console.log(error) })
        setProfile(res.profileObj);
    };

    const onFailure = (err) => {
        console.log('failed', err);
    };

    const logOut = () => {
        localStorage.clear('email')
        localStorage.clear('username')

        setProfile({});
    };
    const routeChange = () => {
        let path = `/home`;
        navigate(path);
    }
    // useEffect(() => {
    //     if (Object.keys(profile).length !== 0) {

    //         console.log("hyyyyyyyyyyyyyyyyyyyyyyyy", profile)
    //         localStorage.setItem('email', profile?.email)
    //         localStorage.setItem('username', profile?.name)
    //     }
    // }, [profile])

    const logOutbutton = <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} className="logoutbutton" />
    return (
        <div>

            {Object.keys(profile).length !== 0 ? (
                <Home logOutbutton={logOutbutton} profile={profile} />
            ) : (
                <div className='loginpage'>
                    <div className='content-box'>
                        <img src={Logo} alt="logo" />
                        <h3 style={{ paddingBottom: "10px" }}>Welcome to GDocs</h3>
                        <GoogleLogin
                            clientId={clientId}
                            className="loginbutton"
                            buttonText="Sign in"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
export default Login;
