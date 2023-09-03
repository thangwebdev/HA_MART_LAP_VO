import { useNavigate } from 'react-router-dom';
import useToken from './useToken';
import { useDispatch } from 'react-redux';
import { axiosPublic } from '~/utils/httpRequest';
import { logoutSuccess, updateToken } from '~/redux/reducrers/auth.reducer';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refreshToken } = useToken();
  const refresh = async () => {
    try {
      const resp = await axiosPublic.post('/v1/xacThuc/lamMoi', {
        refreshToken: refreshToken,
      });
      if (resp && resp.status === 200) {
        dispatch(updateToken(resp.data));
        return resp.data.accessToken;
      }
    } catch (error) {
      dispatch(logoutSuccess());
      navigate('/login');
      return null;
    }
  };
  return refresh;
};
export default useRefreshToken;
