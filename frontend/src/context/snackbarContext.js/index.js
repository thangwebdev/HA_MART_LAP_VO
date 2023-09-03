import { createContext, useState } from "react";
import SnackBarBase from "../../components/snackbar/SnackBarBase";

const SnackbarContext = createContext();

function SnackbarProvider({ children }) {
  const [messageSnackbar, setMessageSnackbar] = useState("");
  const [typeSnackbar, setTypeSnackbar] = useState("error"); // success, warning, info, error

  const alertSnackbar = (type = 'error', message = 'Error') => {
    setTypeSnackbar(type)
    setMessageSnackbar(message)
  }

  return (
    <SnackbarContext.Provider
      value={alertSnackbar}
    >
      <SnackBarBase
        open={!!messageSnackbar}
        handleClose={() => setMessageSnackbar("")}
        type={typeSnackbar}
        message={messageSnackbar}
      />
      {children}
    </SnackbarContext.Provider>
  );
}

export { SnackbarProvider, SnackbarContext };
