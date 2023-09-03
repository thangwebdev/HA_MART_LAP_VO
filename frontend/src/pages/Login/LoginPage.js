import React, { useRef } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import Logo from '../../components/svgs/Logo';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import TypeIt from 'typeit-react';
import { useGlobalTheme } from '~/context/themeContext';
import InputForm from '~/components/input/InputForm';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '~/redux/actions/auth.action';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';

const schema = yup.object({
  email: yup
    .string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  mat_khau: yup.string().required('Vui lòng nhập mật khẩu'),
});

function LoginPage() {
  const [darkMode] = useGlobalTheme();
  const dataLogin = useSelector((state) => state.auth.login);
  const modalEmailForgetPasswordRef = useRef();
  const alertSnackbar = useSnackbarContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle open modal email forget password
  const handleOpenModalEmailForgetPassword = async () => {
    modalEmailForgetPasswordRef.current.open();
  };

  // onSubmit
  const onSubmit = (values) => {
    return new Promise((resovle) => {
      setTimeout(() => {
        loginUser(dispatch, navigate, values, alertSnackbar);
        resovle();
      }, 500);
    });
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          backgroundColor: darkMode
            ? 'darkmode.darkBG'
            : 'whitish.liteBackground',
          paddingTop: '40px',
          overflow: 'hidden',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }} maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Logo />
          </Stack>
          <Box sx={{ padding: '50px 0 247px 0' }}>
            <Box
              sx={{
                width: '95%',
                maxWidth: '556px',
                backgroundColor: darkMode
                  ? 'darkmode.darkSecondary'
                  : 'whitish.pureWhite',
                margin: '0 auto',
                borderRadius: '10px',
                padding: '50px 60px',
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: '20px', fontWeight: 550, textAlign: 'center' }}
              >
                <TypeIt
                  style={{ color: darkMode ? '#fff' : '#171725' }}
                  options={{ loop: true }}
                >
                  Chào mừng trở lại!
                </TypeIt>
              </Typography>
              <Typography
                sx={{
                  color: 'primary.main',
                  textAlign: 'center',
                  marginTop: '10px',
                  fontWeight: 400,
                }}
              >
                Cửa hàng HA Mart
              </Typography>

              <Box
                onSubmit={handleSubmit(onSubmit)}
                component="form"
                sx={{
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <InputForm
                  label="Email"
                  id="email"
                  name="email"
                  type="text"
                  isRequired
                  placeholder="email@gmail.com"
                  register={register}
                  errorMessage={errors?.email?.message}
                />
                <InputForm
                  label="Mật khẩu"
                  id="password"
                  type="password"
                  name="mat_khau"
                  isRequired
                  placeholder="Nhập mật khẩu"
                  register={register}
                  errorMessage={errors?.mat_khau?.message}
                />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'primary.main',
                    margin: '10px 0',
                    textAlign: 'right',
                    cursor: 'pointer',
                    width: 'fit-content',
                    marginLeft: 'auto',
                  }}
                  onClick={handleOpenModalEmailForgetPassword}
                >
                  Quên mật khẩu
                </Typography>
                <LoadingButton
                  type="submit"
                  sx={{
                    textTransform: 'none',
                    color: 'whitish.pureWhite',
                    fontSize: '16px',
                    fontWeight: 600,
                    height: '52px',
                  }}
                  variant="contained"
                  loading={dataLogin.isFetching}
                >
                  Đăng nhập
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: '46%',
            left: '75%',
            transform: 'translate(-55%, 0)',
            zIndex: 1,
            width: '2800px',
            height: '2800px',
            backgroundColor: darkMode ? 'darkmode.softDark' : 'secondary.fif',
            borderRadius: '50%',
          }}
        ></Box>
      </Box>
    </>
  );
}

export default LoginPage;
