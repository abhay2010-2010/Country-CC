import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextProvider';


function PrivateRoute() {
  const { authTokens } = useContext(AuthContext);

  if (!authTokens) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export  {PrivateRoute};