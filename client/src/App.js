import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { /* Route, Redirect, */ Switch, /* Router */ } from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";

import './App.css';
import Application from './pages/application';
import Login from './pages/login';
import Register from './pages/register';
import AuthRoute from './componenets/authRoute';
import { login, logout, register} from './actions/authActions';

function App() {

  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.authStatus);

  return (
    <Router>
      <Switch>
        <AuthRoute exact path='/login' isPrivate={false} authStatus={authStatus}>
          <Login onLogin = { login(dispatch) } />
        </AuthRoute>
        <AuthRoute exact path='/register' isPrivate={false} authStatus={authStatus}>
          <Register onRegister = { register(dispatch) } />
        </AuthRoute>
        <AuthRoute path='/' isPrivate={true} authStatus={authStatus}>
          <Application onLogout = { logout(dispatch) } />
        </AuthRoute>
      </Switch>
    </Router>
  );
}

export default App;