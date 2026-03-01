import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children, role }) => {
    const { user, loading, isLoggingOut, resetLoggingOut } = useContext(AuthContext);
    const location = useLocation();

    console.log('PrivateRoute Check:', { user, requiredRole: role, userRole: user?.role });

    // Once we've navigated away (location changed) after logout, reset the flag
    useEffect(() => {
        if (isLoggingOut) {
            resetLoggingOut();
        }
    }, [location.pathname]);

    if (loading) {
        return <div>Checking authentication...</div>;
    }

    // During logout, render nothing so navigate('/') wins the race
    if (isLoggingOut) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
        console.log('Role mismatch:', { userRole: user.role, requiredRole: role });
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;