import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { HomePage } from '../pages/Home'
import { PrivateRoute } from './PrivateRoute'
import { CountryDetailsPage } from '../pages/CountryDetailsPage'
import { FavoritesPage } from '../pages/FavoritePage'

const AllRoutes = () => {
  return (
    <>
    
          <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/countries/:currencyCode" element={<PrivateRoute><CountryDetailsPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          </Routes>
       
    </>
  )
}

export  {AllRoutes}