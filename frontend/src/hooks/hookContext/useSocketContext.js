import { useContext } from "react";
import { SocketContext } from "../../context/socketContext";

const useSocketContext = () => {
  const value = useContext(SocketContext);
  if (!value) {
    throw new Error("Socket context must be used inside SocketProvider");
  }
  return value;
};
export default useSocketContext;
