import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("authUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem("authUser", JSON.stringify(userData));
    };

    const logout = () => {
        setIsLoggingOut(true);
        setUser(null);
        sessionStorage.removeItem("authUser");
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
    };

    const resetLoggingOut = () => {
        setIsLoggingOut(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isLoggingOut, resetLoggingOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;