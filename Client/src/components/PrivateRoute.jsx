import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth, setUser } from "../redux/authSlice";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getUser = async () => {
      try {
        const action = await dispatch(checkAuth());
        if (action.error) {
          dispatch(setUser(null));
        } else {
          dispatch(setUser(action.payload));
        }
      } catch (error) {
        dispatch(setUser(null));
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
