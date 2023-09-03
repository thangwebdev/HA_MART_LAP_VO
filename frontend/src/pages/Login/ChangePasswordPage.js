import React, { useEffect } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Logo from "../../components/svgs/Logo";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SwitchDarkmode from "../../components/switch/SwitchDarkmode";
import { useGlobalTheme } from "../../context/themeContext";
import InputForm from "../../components/input/InputForm";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import useSnackbarContext from "../../hooks/hookContext/useSnackbarContext";
import { axiosPublic } from '~/utils/httpRequest';

const schema = yup.object({
  new_password: yup.string().required("Please enter new password"),
  repeat_password: yup
    .string()
    .required("Please enter repeat password")
    .equals([yup.ref("new_password")], "Repeat password is not match"),
});

function ChangePasswordPage() {
  const [darkMode] = useGlobalTheme();
  const {
    message: [, setMessageChange],
    type: [, setTypeSnackbar],
  } = useSnackbarContext();
  const { isFetching } = useSelector((state) => state.auth.login);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  // onSubmit
  const onSubmit = (values) => {
    return new Promise((resovle, reject) => {
      setTimeout(async () => {
        try {
          values.email = location?.state?.email;
          const resp = await axiosPublic.put(`/auth/update-password`, values);
          if (resp && resp.status === 200) {
            resovle();
            setTypeSnackbar("success");
            setMessageChange("Change password success");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
        } catch (error) {
          reject();
          setMessageChange(error?.response?.data?.message);
        }
      }, 500);
    });
  };

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          backgroundColor: darkMode
            ? "darkmode.darkBG"
            : "whitish.liteBackground",
          paddingTop: "40px",
          overflow: "hidden",
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }} maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Logo />
            <SwitchDarkmode />
          </Stack>
          <Box sx={{ padding: "50px 0 247px 0" }}>
            <Box
              sx={{
                width: "95%",
                maxWidth: "556px",
                backgroundColor: darkMode
                  ? "darkmode.darkSecondary"
                  : "whitish.pureWhite",
                margin: "0 auto",
                borderRadius: "10px",
                padding: "50px 60px",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: "20px", fontWeight: 550, textAlign: "center" }}
              >
                Change Password
              </Typography>
              <Typography
                sx={{
                  color: "neutral.text3",
                  textAlign: "center",
                  marginTop: "10px",
                  fontWeight: 400,
                }}
              >
                Already have an account?{" "}
                <Link style={{ textDecoration: "none" }} to="/login">
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                    }}
                    component="span"
                  >
                    Sign in
                  </Typography>
                </Link>
              </Typography>
              <Box
                onSubmit={handleSubmit(onSubmit)}
                component="form"
                sx={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <InputForm
                  label="New password"
                  id="new_password"
                  name="new_password"
                  type="password"
                  isRequired
                  register={register}
                  errorMessage={errors?.new_password?.message}
                />
                <InputForm
                  label="Repeat password"
                  id="repeat_password"
                  type="password"
                  name="repeat_password"
                  isRequired
                  register={register}
                  errorMessage={errors?.repeat_password?.message}
                />
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
                  loading={isFetching}
                >
                  Confirm
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "75%",
            transform: "translate(-55%, 0)",
            zIndex: 1,
            width: "2800px",
            height: "2800px",
            backgroundColor: darkMode ? "darkmode.softDark" : "secondary.fif",
            borderRadius: "50%",
          }}
        ></Box>
      </Box>
    </>
  );
}

export default ChangePasswordPage;
