import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ModalBase from "../../components/modal/ModalBase";
import { useGlobalTheme } from "../../context/themeContext";
import InputForm from "../../components/input/InputForm";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import useSnackbarContext from "../../hooks/hookContext/useSnackbarContext";
import { axiosPublic } from '~/utils/httpRequest';

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  maxWidth: "556px",
  border: "none",
  outline: "none",
};

const schema = yup.object({
  email_forget: yup
    .string()
    .required("Please enter your email")
    .email("Email is not valid"),
});

function ModalEmailForgetPassword(props, ref) {
  const [darkMode] = useGlobalTheme();
  const [open, setOpen] = useState(false);
  const {
    message: [, setMessageSnackbar],
  } = useSnackbarContext();

  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }));

  // on submit
  const onSubmit = (values) => {
    return new Promise((resovle, reject) => {
      setTimeout(async () => {
        try {
          const resp = await axiosPublic.post(
            `/auth/send-verifycode-forgetpassword`,
            { email: values.email_forget }
          );
          if (resp && resp.status === 200) {
            navigate("/verify-code", { state: { email: values.email_forget } });
            resovle();
          }
        } catch (error) {
          setMessageSnackbar(error?.response?.data?.message);
          reject();
        }
      }, 500);
    });
  };

  return (
    <ModalBase open={open} handleClose={handleClose}>
      <Box sx={style}>
        {open && (
          <Stack
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            component="form"
            className="animate__animated animate__bounceIn"
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: darkMode
                ? "darkmode.darkSecondary"
                : "whitish.pureWhite",
              borderRadius: "10px",
              py: 4,
              px: 6,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: darkMode ? "whitish.pureWhite" : "neutral.text1",
                textAlign: "center",
              }}
            >
              Forgot Password
            </Typography>
            <Stack spacing={2}>
              <InputForm
                label="Email"
                name="email_forget"
                isRequired
                type="text"
                id="email-forget"
                register={register}
                errorMessage={errors?.email_forget?.message}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  color: darkMode ? "neutral.text3" : "neutral.text2",
                }}
              >
                Note: This email must be the email that you have registered for
                an account.
              </Typography>
              <LoadingButton
                type="submit"
                sx={{
                  textTransform: "none",
                  color: "whitish.pureWhite",
                  fontSize: "16px",
                  fontWeight: 600,
                  height: "52px",
                }}
                variant="contained"
                loading={isSubmitting}
              >
                Sign in
              </LoadingButton>
            </Stack>
          </Stack>
        )}
      </Box>
    </ModalBase>
  );
}

export default forwardRef(ModalEmailForgetPassword);
