import React, { createContext } from 'react';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useAxiosPrivate from '~/hooks/useAxiosPrivate';
export const ApisContext = createContext();

function ApisProvider({ children }) {
  const alertSnackbar = useSnackbarContext();
  const axiosPrivate = useAxiosPrivate();

  // async get list
  const asyncGetList = async (ma_danh_muc, condition = {}, version = 'v1') => {
    try {
      const resp = await axiosPrivate.post(
        `/${version}/danhmuc/${ma_danh_muc}/search`,
        condition
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.response?.data?.message || 'Server error');
    }
  };
  // async get list deleted
  const asyncGetListDeleted = async (
    ma_danh_muc,
    condition = {},
    version = 'v1'
  ) => {
    try {
      const resp = await axiosPrivate.post(
        `/${version}/danhmuc/${ma_danh_muc}/search/deleted`,
        condition
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.response?.data?.message || 'Server error');
    }
  };
  // async post data
  const asyncPostData = async (
    ma_danh_muc,
    data,
    method = 'post',
    version = 'v1'
  ) => {
    try {
      const resp = await axiosPrivate[method](
        `/${version}/danhmuc/${ma_danh_muc}`,
        data
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };
  // async delete
  const asyncDelete = async (ma_danh_muc, data, version = 'v1') => {
    try {
      const resp = await axiosPrivate.delete(
        `/${version}/danhmuc/${ma_danh_muc}`,
        { data }
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };
  // async destroy
  const asyncDestroy = async (ma_danh_muc, data, version = 'v1') => {
    try {
      const resp = await axiosPrivate.delete(
        `/${version}/danhmuc/${ma_danh_muc}/destroy`,
        { data }
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };
  // async restore
  const asyncRestore = async (ma_danh_muc, data, version = 'v1') => {
    try {
      const resp = await axiosPrivate.post(
        `/${version}/danhmuc/${ma_danh_muc}/restore`,
        data
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response?.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };
  const asyncReport = async ({ version = 'v1', endpoint = '', data = {} }) => {
    try {
      const resp = await axiosPrivate.post(
        `/${version}/baocao/${endpoint}`,
        data
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp.response.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };
  const uploadFile = async (formData, enpoint, folder, version = 'v1') => {
    try {
      const resp = await axiosPrivate.post(
        `/${version}${enpoint}?folder=${folder}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp?.response?.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server errors');
    }
  };
  const callApi = async ({
    method = 'post',
    endpoint,
    data = {},
    version = 'v1',
  }) => {
    try {
      const resp = await axiosPrivate[method](`/${version}${endpoint}`, data);
      if (resp && resp.status === 200) {
        return resp.data;
      } else {
        alertSnackbar('error', resp?.response?.data?.message || 'Server error');
        return resp?.response?.data;
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Server error');
    }
  };

  return (
    <ApisContext.Provider
      value={{
        asyncGetList,
        asyncGetListDeleted,
        asyncPostData,
        asyncDelete,
        asyncDestroy,
        asyncRestore,
        asyncReport,
        uploadFile,
        callApi,
      }}
    >
      {children}
    </ApisContext.Provider>
  );
}

export default ApisProvider;
