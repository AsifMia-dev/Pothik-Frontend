import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = (props) => {
  const {children, role} = props;
  const {user} = useContext(AuthContext);

    if(!user){
        return <Navigate to ="/login" replace/>;
    }
    if(role && user.role !== role){
        return <Navigate to ="/login" replace/>;
    }

    return children;
}

export default PrivateRoute
