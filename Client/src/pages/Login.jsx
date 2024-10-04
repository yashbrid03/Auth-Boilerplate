import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, setUser, checkAuth } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();

      navigateTo("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
    }
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
    } catch (error) {}
  };

  const [isUserLoading, setIsUserLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const getUser = async () => {
      try {
        const action = await dispatch(checkAuth());
        if (action.error) {
          // Handle the error
          console.log("Error:", action.error);
          dispatch(setUser(null));
        } else {
          dispatch(setUser(action.payload));
        }
      } catch (error) {
        // This will only catch errors in the dispatch itself, not in the thunk
        console.log("Unexpected error:", error);
        dispatch(setUser(null));
      } finally {
        setIsUserLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  const resetPass = async() =>{
    if(email==""){
      alert("enter email in the field");
      return;
    }
      try{
        const response = await api.post('/auth/email-reset-pass',{email});
        alert("Check mail for password reset link")
      }catch(error){
        if(error.response.status == 400){
          alert("Provided email is not registered")
        }
      }
  }

  if (isUserLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  if (user) {
    return (
      <>
        <div className="w-full h-[100vh] flex items-center justify-center flex-col  ">
          
          <h1 className="text-2xl font-medium my-2">You have already signed In. Please log out if you wish to login with
          another account</h1>
          <button className="bg-red-400 px-3 py-2 rounded-lg font-bold " onClick={handleLogout}>logout</button>
        </div>
        
      </>
    );
  }

  return (
    <>
      <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@domain.com"
                    required
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div class="flex items-center justify-start">
                  <a
                    onClick={resetPass}
                    class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link to={"/register"}>
                  <a
                    href="#"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form> */}
      {/* <button onClick={handleLogout}>logout</button> */}
    </>
  );
};

export default Login;
