import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const dataLogin = useSelector((state) => state.auth.login);
  const navigate = useNavigate();
  useEffect(() => {
    if (!dataLogin?.user) navigate("/login");
  }, [dataLogin?.user, navigate]);

  return <>{children}</>;
}
