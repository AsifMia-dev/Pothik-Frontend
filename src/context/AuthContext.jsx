import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedUser = sessionStorage.getItem("authUser");

        if(storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    },[]);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem("authUser", JSON.stringify(userData));
    }

    const logout = () =>{
        setUser(null);
        sessionStorage.removeItem("authUser");
        sessionStorage.removeItem("token");
    }
    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value = {{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
