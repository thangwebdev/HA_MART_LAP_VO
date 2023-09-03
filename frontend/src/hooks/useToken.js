import { useSelector } from 'react-redux';

const useToken = () => {
  const { login } = useSelector((state) => state.auth);
  if (!login?.user) {
    return { accessToken: '', refreshToken: '' };
  }
  const { accessToken, refreshToken } = login.user;
  return { accessToken, refreshToken };
};
export default useToken;
