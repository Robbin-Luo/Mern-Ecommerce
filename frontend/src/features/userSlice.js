import { createSlice } from '@reduxjs/toolkit'
import appApi from '../services/appApi'



export const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    logout: () => null,
    updateUserCart: (_, { payload }) => payload,
    paymentSuccess: (_, { payload }) => payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(appApi.endpoints.signup.matchFulfilled, (_, { payload }) => payload);
    builder.addMatcher(appApi.endpoints.signin.matchFulfilled, (_, { payload }) => payload);
  }
})

export const { logout, addNotification, resetNotifications, updateUserCart, paymentSuccess } = userSlice.actions;
export default userSlice.reducer;