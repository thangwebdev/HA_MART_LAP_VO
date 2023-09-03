import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function RestrictedRoute({ children }) {
  const dataLogin = useSelector((state) => state.auth.login);
  const navigate = useNavigate();
  useEffect(() => {
    if (dataLogin?.user) navigate("/");
  }, [dataLogin?.user, navigate]);
  return <>{children}</>;
}

export default RestrictedRoute;
