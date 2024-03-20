// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};