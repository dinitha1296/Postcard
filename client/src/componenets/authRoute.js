import React from 'react';
import { Route, Redirect } from 'react-router';

import { AuthStatusEnum } from '../reducer/authReducer';

function AuthRoute(props) {
    
    const { authStatus , isPrivate } = props; 

    if (isPrivate && (authStatus === AuthStatusEnum.LOGOUT)) {
        return <Redirect to="/login" />
    }
    else if (!isPrivate && (authStatus === AuthStatusEnum.LOGIN)) {
        return <Redirect to='/' />
    }
    //if (isAuthRoute/*  && isAuthUser */) return <Redirect to='/' />

    return <Route {...props} />
}

export default AuthRoute;