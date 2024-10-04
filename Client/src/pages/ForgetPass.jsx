import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import check from '../assets/check.png'
import cross from '../assets/cross.png'

export const ForgetPass = () => {
    const routeParams = useParams();
  const token = routeParams.token;
  const [status, setStatus] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const changePass = async(e)=>{
    e.preventDefault()
    try {
        console.log(token)
        if (password != confirmPassword) {
          alert("password and confirmed password doesnt match");
          return
        }
        const response = await api.post(`/auth/save-new-password/${token}`, { password });
        setStatus(response.status);
        console.log("success",response)
      } catch (error) {
        console.log("error",error)
        setStatus(error.response.status);
      }

  }
  if(status == 400){
    return(
        <div  className="w-full h-[100vh] flex items-center justify-center flex-col  ">
        <img src={cross} width={100}/>
          <h1  className="text-2xl font-medium my-2">Token is invalid or expired</h1>
          {/* <Link to={'/login'}><button className="bg-blue-400 px-3 py-2 rounded-lg font-bold ">Login Here</button></Link> */}
        </div>
    )
  }else if(status == 200){
    return(<div  className="w-full h-[100vh] flex items-center justify-center flex-col  ">
        <img src={check} width={100}/>
          <h1  className="text-2xl font-medium my-2">Password Updated Successfully!</h1>
          <Link to={'/login'}><button className="bg-blue-400 px-3 py-2 rounded-lg font-bold ">Login Here</button></Link>
        </div>)
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Yor Password
            </h1>
            <form className="max-w-sm mx-auto" onSubmit={changePass}>
              
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="repeat-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Repeat password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="repeat-password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  required
                />
              </div>

              <button
              type="submit"
                // onClick={changePass}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
