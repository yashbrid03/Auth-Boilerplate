import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import sad from "../assets/sad.webp";
import check from "../assets/check.png";
import { Link } from "react-router-dom";

export const Verify = () => {
  const routeParams = useParams();
  const token = routeParams.token;
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const verif = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus(200);
      } catch (error) {
        setStatus(error.response.status);
      }
    };
    verif();
  }, [token]);

  const resend = async () => {
    try {
      const email = prompt("Enter your email");
      const response = await api.post("auth/resend-verification", { email });
      setStatus(1);
    } catch (error) {
      setStatus(error.response.status);
    }
  };

  if (!status) {
    return <div>Loading</div>;
  } else if (status == 200) {
    return (
      <>
        <div className="w-full h-[100vh] flex items-center justify-center flex-col  ">
          <img src={check} width={100} />
          <h1 className="text-2xl font-medium my-2">
            User Verified Successfully!
          </h1>
          <Link to={"/login"}>
            <button className="bg-blue-400 px-3 py-2 rounded-lg font-bold ">
              Login Here
            </button>
          </Link>
        </div>
      </>
    );
  } else if (status == 400) {
    return (
      <>
        <div className="w-full h-[100vh] flex items-center justify-center flex-col  ">
          <img src={sad} width={100} />
          <h1 className="text-2xl font-medium my-2">
            Your token has been expired.
          </h1>
          <button
            className="bg-blue-400 px-3 py-2 rounded-lg font-bold "
            onClick={resend}
          >
            Resend Token?
          </button>
        </div>
      </>
    );
  } else if (status == 404) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center flex-col  ">
        <h1 className="text-2xl font-medium my-2">
          {" "}
          Provided Email has not been registered with us.
        </h1>
        <Link to={"/register"}>
          <button className="bg-blue-400 px-3 py-2 rounded-lg font-bold ">
            Register Here
          </button>
        </Link>
      </div>
    );
  } else if (status == 1) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center flex-col">
        <h1 className="text-2xl font-medium my-2">
          Verification mail has been sent. Please check your mail.
        </h1>
      </div>
    );
  }
  // status 403
  return (
    <div className="w-full h-[100vh] flex items-center justify-center flex-col">
      <h1 className="text-2xl font-medium my-2">User is already verified!</h1>
      <Link to={"/login"}>
        <button className="bg-blue-400 px-3 py-2 rounded-lg font-bold ">
          Login Here
        </button>
      </Link>
    </div>
  );
};
