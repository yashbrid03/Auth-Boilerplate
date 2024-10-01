import React from 'react';
import { Routes, Route, redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login.jsx';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import api from './utils/api.js';
import { setUser } from './redux/authSlice.js';


const App = () => {

 

  // useEffect

  return (
    <Routes>
        <Route path="/login" element={<Login/>} />
        <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/dashboard' element={<Dashboard/>}/>
          </Route>
        {/* Add more routes as needed */}
      
    </Routes>
  );
};

export default App;
