import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './register.css';
import Logo from '../componenets/logo';

const Register = (props)  => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [error, setError] = useState(props.error || '');


    const err = (error) => {
        setError(error);
    }

    const submitForm = (e) => {
        e.preventDefault();
        if (firstName && username && password) {
            if (passwordConf !== password) {
                err('Passwords should match in \'Password\' and \'Re-Enter Password fields\'')
            } else {
                const userData = { username, password, firstName, lastName }
                props.onRegister(userData, err);
            }
        } else {
            err('Please provide required fields.')
        }
    }

    const onNameEnter = (e, val, changeVal) => {
        e.preventDefault()
        if (e.nativeEvent.inputType === "insertText") {
            const inp = e.nativeEvent.data && e.nativeEvent.data.charCodeAt(0);
            if (val === "") {
                if ((inp > 64 && inp < 91)) changeVal(val + String.fromCharCode(inp));
                else if (inp > 96 && inp < 123) changeVal(val + String.fromCharCode(inp - 32));
            } else {
                if ((inp > 64 && inp < 91)) changeVal(val + String.fromCharCode(inp + 32));
                else if (inp > 96 && inp < 123) changeVal(val + String.fromCharCode(inp));
            }
        } else {
            changeVal(e.target.value);
        }
    }

    const onUsernameEnter = (e) => {
        e.preventDefault()
        if (e.nativeEvent.inputType === "insertText") {
            const inp = e.nativeEvent.data && e.nativeEvent.data.charCodeAt(0);
            if ((inp > 64 && inp < 91)) setUsername(username + String.fromCharCode(inp + 32));
            else if (inp > 96 && inp < 123) setUsername(username + String.fromCharCode(inp));
            else if (inp > 47 && inp < 58) setUsername(username + String.fromCharCode(inp));
        } else {
            setUsername(e.target.value);
        }
    }

    return(
        <div className="regPage">
            <div>
                <div className="regDiv">
                    {error ? <div className="error">{error}</div> : <p/>}
                    <Logo className="logo"/>
                    <form className="regForm" onSubmit={e => submitForm(e)}>
                        <div className="regfield regFieldNames">
                            <input 
                                type="text" 
                                value={firstName}
                                className="regTextfield regFirstName" 
                                placeholder="First Name"
                                onChange={e => onNameEnter(e, firstName, setFirstName)}
                            />
                            <input 
                                type="text" 
                                value={lastName}
                                className="regTextfield regLastName" 
                                placeholder="Last Name (optional)"
                                onChange={e => onNameEnter(e, lastName, setLastName)}
                            />
                        </div>
                        <div className="regfield">
                            <input 
                                type="text" 
                                value={username}
                                className="regTextfield" 
                                placeholder="Username"
                                onChange={e => onUsernameEnter(e)}    
                            />
                        </div>
                        <div className="regfield">
                            <input 
                                type="password"
                                value={password} 
                                className="regTextfield regPassword" 
                                placeholder="Password" 
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="regfield">
                            <input 
                                type="password" 
                                value={passwordConf}
                                className="regTextfield regPasswordRe" 
                                placeholder="Re-Enter Password" 
                                onChange={e => setPasswordConf(e.target.value)}
                            />
                        </div>
                        <input type="submit" className="regSubmit" value="Sign In" />
                    </form>
                    <hr />
                    <div className="regLoginDiv">
                        <p>Already have an account ? <Link to={'/login'}>Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default Register;