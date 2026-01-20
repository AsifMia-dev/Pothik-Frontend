import React from 'react'
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = (props) => {
    const { children, role } = props;
    const { user } = useContext(AuthContext);

    // Debug: Log user and role info
    console.log('PrivateRoute Check:', { user, requiredRole: role, userRole: user?.role });

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If a role is required, check if user's role matches (case-insensitive)
    if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
        console.log('Role mismatch:', { userRole: user.role, requiredRole: role });
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute

