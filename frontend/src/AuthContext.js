import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, isAuthenticated: false });

  const login = (user) => {
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const changeUsername = (username) => {
    var tempUser = auth.user;
    tempUser.username = username;
    setAuth({ tempUser, isAuthenticated: true });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, changeUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
