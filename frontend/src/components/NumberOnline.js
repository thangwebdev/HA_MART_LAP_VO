import React, { useEffect, useState } from "react";
import useSocketContext from "../hooks/hookContext/useSocketContext";

function NumberOnline() {
  const [socket] = useSocketContext();
  const [data, setData] = useState();
  useEffect(() => {
    if (socket) {
      socket.on("online", (data) => {
        setData(data);
      });
    }
  }, [socket]);
  return <div>NumberOnline is {data || "0"}</div>;
}

export default NumberOnline;
