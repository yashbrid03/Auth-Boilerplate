import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export const Verify = () => {
  const routeParams = useParams();
  const token = routeParams.token;
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const verif = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        setStatus(200);
      } catch (error) {
        setStatus(error.response.status);
      }
    };
    verif();
  }, [token]);

  if (!status) {
    return <div>Loading</div>;
  } else if (status == 200) {
    return (
      <>
        <div>
          User Verified Successfully! You can now login here buttontologin
        </div>
      </>
    );
  } else if (status == 400) {
    return (
      <>
        <div>Your token has been expired. resend Verification token button</div>
      </>
    );
  }
  return <div>User is already verified</div>;
};
