import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    login: {
      user: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    // login
    loginStart(state) {
      state.login.isFetching = true;
    },
    loginFail(state) {
      state.login.isFetching = false;
      state.login.error = true;
      state.login.user = null;
    },
    loginSuccess(state, action) {
      state.login.isFetching = false;
      state.login.error = false;
      state.login.user = action.payload;
    },
    // logout
    logoutSuccess(state) {
      state.login.user = null;
    },
    // update user
    updateToken(state, action) {
      state.login.user = { ...state.login.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginFail,
  loginSuccess,
  logoutSuccess,
  updateToken,
} = authSlice.actions;
export default authSlice.reducer;
