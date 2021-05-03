import { Redirect } from "react-router"
import React from 'react';
import { Route } from 'react-router-dom';

export const ProtectedRoute = ({ component: Component, ...rest }) => 
     <Route
        {...rest}
        render={props => localStorage.getItem("user_token") ?
            <Component {...props} /> :
            <Redirect
                to={{
                    pathname: "/login",
                    state: { from: props.location }
                }}
            />
        }
    />
