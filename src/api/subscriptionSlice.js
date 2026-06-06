import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBlocked: false,
  code: null,
  message: null,
  companyId: null,
  isCompanyAdmin: false,
  company: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionBlocked: (state, { payload }) => {
      state.isBlocked = true;
      state.code = payload.code;
      state.message = payload.message;
      state.companyId = payload.companyId ?? null;
      state.isCompanyAdmin = !!payload.isCompanyAdmin;
      state.company = payload.company ?? null;
    },
    clearSubscriptionBlocked: () => initialState,
  },
});

export const { setSubscriptionBlocked, clearSubscriptionBlocked } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
