import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAndRefreshToken from "./CheckRegistration";
import CheckingAuth from "./CheckingAuth";

function AuthRedirect({ children, signin_up }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAndRefreshToken();

      if (isAuthenticated && signin_up) {
        navigate("/"); // Already logged in → redirect away from login/register
        return;
      }

      if (!isAuthenticated && !signin_up) {
        navigate("/signin"); // Not logged in → redirect from protected route
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    verify();
  }, [navigate, signin_up]);

  if (checking) {
    return <CheckingAuth />;
  }

  return authorized ? children : null;
}

export default AuthRedirect;
