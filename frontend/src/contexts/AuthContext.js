import React, { createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const user = null;
    const isAuthenticated = false;
    const login = () => console.log("Login");
    const logout = () => console.log("Logout");

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
