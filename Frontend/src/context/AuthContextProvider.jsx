import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);

  const setTokens = (data) => {
    localStorage.setItem('tokens', JSON.stringify(data.token));
    setAuthTokens(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    setAuthTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setTokens, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

