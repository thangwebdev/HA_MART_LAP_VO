import { useEffect } from 'react';
import { axiosPrivate } from '~/utils/httpRequest';
import useRefreshToken from './useRefreshToken';
import useToken from './useToken';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { accessToken } = useToken();
  const requestInterceptor = axiosPrivate.interceptors.request.use(
    function (config) {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  const responseInterceptor = axiosPrivate.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const prevRequest = error.config;
      if (error?.response?.status === 401 && !prevRequest.sent) {
        prevRequest.sent = true;
        const newAcceccToken = await refresh();
        prevRequest.headers['Authorization'] = `Bearer ${newAcceccToken}`;
        return axiosPrivate(prevRequest);
      } else {
        return error;
      }
    }
  );
  useEffect(() => {
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  return axiosPrivate;
};
export default useAxiosPrivate;
