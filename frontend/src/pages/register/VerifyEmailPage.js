import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../components/svgs/Logo";
import SwitchDarkmode from "../../components/switch/SwitchDarkmode";
import { useGlobalTheme } from "../../context/themeContext";
import { AiFillStepBackward } from "react-icons/ai";
import { axiosPublic } from '~/utils/httpRequest';
import LoadingButton from "@mui/lab/LoadingButton";
import useSnackbarContext from "../../hooks/hookContext/useSnackbarContext";

function VerifyEmailPage({ isForgotPassword }) {
  const navigate = useNavigate();

  const [darkMode] = useGlobalTheme();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const {
    message: [, setMessageOTP],
    type: [, setTypeSnackbar],
  } = useSnackbarContext();

  const valueLocation = useLocation();
  const timeoutRef = useRef();

  const visibleButton = useMemo(() => {
    return otp.every((value) => !!value);
  }, [otp]);

  // handle send OTP
  const handleSendOTP = async () => {
    setIsLoading(true);
    try {
      const url = isForgotPassword
        ? "/auth/verifycode-forgetpassword"
        : "/auth/register";
      const data = { ...valueLocation.state };
      data.verify_code = otp.join("");
      const resp = await axiosPublic.post(url, data);
      if (resp && resp.status === 200) {
        setIsLoading(false);
        if (isForgotPassword) {
          navigate("/change-password", { state: { email: data.email } });
        } else {
          setTypeSnackbar("success");
          setMessageOTP("Register successfully");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      }
    } catch (error) {
      setIsLoading(false);
      setTypeSnackbar("error");
      setMessageOTP(error?.response?.data?.message);
    }
  };

  // handle change otp
  const handleChangeOtp = (e, position) => {
    // validate value is number
    const checkNAN = isNaN(e.target.value);
    if (checkNAN) {
      return;
    } else {
      const value = e.target.value;
      // if the position of input is lastest, Not focust for next input
      if (position !== 3 && value) {
        const numberFocus = e.target.name.slice(-1);
        const nextInput = document.querySelector(
          `input[name$='${Number(numberFocus) + 1}']`
        );
        if (nextInput) {
          nextInput.focus();
        }
      }
      // change value of OTP
      setOtp((prev) => {
        const otpClone = [...prev];
        if (otpClone[position]) {
          otpClone[position] = value.slice(-1);
        } else {
          otpClone[position] = value;
        }
        return otpClone;
      });
    }
  };

  // handle resend OTP
  const handleResendOTP = () => {};

  useEffect(() => {
    if (!valueLocation?.state) {
      navigate("/register");
    }
    return () => {
      const deleteVerifyCode = async () => {
        if (valueLocation?.state?.email) {
          try {
            await axiosPublic.delete(`/auth/delete-verifycode`, {
              data: { email: valueLocation.state.email },
            });
          } catch (error) {
            console.log(error);
          }
        }
      };
      deleteVerifyCode();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (countDown >= 1) {
        setCountDown(countDown - 1);
      } else {
        navigate("/register");
      }
    }, 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDown]);

  return (
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
              maxWidth: "455px",
              backgroundColor: darkMode
                ? "darkmode.darkSecondary"
                : "whitish.pureWhite",
              margin: "0 auto",
              borderRadius: "10px",
              padding: "35px 50px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "25px",
                fontWeight: 700,
                color: darkMode ? "whitish.pureWhite" : "neutral.text1",
                marginBottom: "20px",
              }}
            >
              {isForgotPassword ? "Verify Code" : "Email Verification"}
            </Typography>
            <Stack sx={{ width: "100%", height: "44px", marginBottom: "20px" }}>
              <Typography
                sx={{
                  color: darkMode ? "neutral.text3" : "neutral.text4",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Please Enter the OTP you receive to
              </Typography>
              <Typography
                sx={{
                  color: darkMode ? "whitish.pureWhite" : "neutral.text2",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                {valueLocation?.state?.email || "hellouihut@gmail.com"}
              </Typography>
            </Stack>
            <Box
              sx={{
                margin: "0 auto",
                width: "60px",
                height: "60px",
                backgroundColor: "secondary.second",
                marginBottom: "20px",
                borderRadius: "50%",
                color: "whitish.pureWhite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 600,
              }}
            >
              {countDown}
            </Box>
            <Stack
              sx={{
                width: "100%",
                height: "92px",
                padding: "10px 0",
                marginBottom: "20px",
              }}
              direction="row"
              spacing="20px"
              justifyContent="center"
            >
              <TextField
                autoFocus={Object.values(otp).every((o) => !o)}
                name="value1"
                value={otp[0]}
                onChange={(e) => handleChangeOtp(e, 0)}
                variant="outlined"
                sx={{
                  width: "50px",
                  height: "100%",
                  "& .MuiOutlinedInput-input": {
                    color: darkMode ? "whitish.pureWhite" : "",
                  },
                  "& .MuiInputBase-root": {
                    borderColor: darkMode ? "neutral.text2" : "",
                  },
                  "& fieldset": {
                    borderColor: darkMode ? "neutral.text2" : "",
                  },
                }}
              />
              <TextField
                name="value2"
                value={otp[1]}
                onChange={(e) => handleChangeOtp(e, 1)}
                variant="outlined"
                sx={{
                  width: "50px",
                  height: "100%",
                  "& .MuiOutlinedInput-input": {
                    color: darkMode ? "whitish.pureWhite" : "",
                  },
                  "& fieldset": {
                    borderColor: darkMode ? "neutral.text2" : "",
                  },
                }}
              />
              <TextField
                name="value3"
                value={otp[2]}
                onChange={(e) => handleChangeOtp(e, 2)}
                variant="outlined"
                sx={{
                  width: "50px",
                  height: "100%",
                  "& .MuiOutlinedInput-input": {
                    color: darkMode ? "whitish.pureWhite" : "",
                  },
                  "& fieldset": {
                    borderColor: darkMode ? "neutral.text2" : "",
                  },
                }}
              />
              <TextField
                name="value4"
                value={otp[3]}
                onChange={(e) => handleChangeOtp(e, 3)}
                variant="outlined"
                sx={{
                  width: "50px",
                  height: "100%",
                  "& .MuiOutlinedInput-input": {
                    color: darkMode ? "whitish.pureWhite" : "",
                  },
                  "& fieldset": {
                    borderColor: darkMode ? "neutral.text2" : "",
                  },
                }}
              />
            </Stack>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "secondary.second",
                cursor: "pointer",
                marginBottom: "30px",
              }}
              onClick={handleResendOTP}
            >
              Resend OTP
            </Typography>
            <LoadingButton
              disabled={!visibleButton}
              loading={isLoading}
              sx={{
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                height: "52px",
                color: "whitish.pureWhite",
                borderRadius: "10px",
                marginBottom: "20px",
                "&.Mui-disabled": {
                  color: darkMode ? "neutral.text4" : "",
                },
              }}
              fullWidth
              variant="contained"
              onClick={handleSendOTP}
            >
              Confirm
            </LoadingButton>
            <Link
              style={{
                width: "fit-content",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              to="/login"
            >
              <AiFillStepBackward color="#A2A2A8" />
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "secondary.second",
                }}
              >
                Back to login
              </Typography>
            </Link>
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
  );
}

export default VerifyEmailPage;
