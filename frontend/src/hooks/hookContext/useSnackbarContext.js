import { useContext } from "react";
import { SnackbarContext } from "../../context/snackbarContext.js";

export default function useSnackbarContext() {
  const snackbarValue = useContext(SnackbarContext);
  if (!snackbarValue) {
    throw new Error("Snackbar context must be used inside snackbar provider");
  }
  return snackbarValue;
}
