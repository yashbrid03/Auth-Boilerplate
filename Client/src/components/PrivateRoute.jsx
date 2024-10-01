import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth, setUser } from '../redux/authSlice';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);


useEffect(()=>{
    const getUser = async () => {
        try {
          const action = await dispatch(checkAuth())
          if (action.error) {
            // Handle the error
            console.log("Error:", action.error)
            dispatch(setUser(null))
          } else {
            // console.log("data is ", action.payload)
            dispatch(setUser(action.payload))
          }
        } catch (error) {
          // This will only catch errors in the dispatch itself, not in the thunk
          console.log("Unexpected error:", error)
          dispatch(setUser(null))
        } finally {
          setIsLoading(false);
        }
      }
      
      getUser()
    
}, [dispatch])



  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;