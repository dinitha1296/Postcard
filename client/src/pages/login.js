import React, { useState } from 'react';
import { Link } from 'react-router-dom'

import Logo from '../componenets/logo';
import './login.css';

const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(props.error || '');

    const err = (error) => {
        setError(error)
    }
    
    const submitForm = (e) => {
        e.preventDefault();
        if (username && password) {
            props.onLogin(username, password, err);
        } else {
            err('Please provide required fields.')
        }
    }

    return(
        <div className="loginPage">
            <div className="loginDiv">
                {error ? <div className="error">{error}</div> : <p/>}
                <form className="loginForm" onSubmit={e => submitForm(e)}>
                    <Logo className="logo"/>
                    <div className="loginfield">
                        <input 
                            type="text" 
                            className="loginTextfield" 
                            placeholder="Username" 
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="regfield">
                        <input 
                            type="password" 
                            className="loginTextfield regPassword" 
                            placeholder="Password" 
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <input type="submit" className="loginSubmit" value="Log In" />
                </form>
                <hr />
                <div className="signInDiv">
                    <p>New to Postcard? <Link to={'/register'}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
} 

export default Login;