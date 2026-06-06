import { configureStore } from "@reduxjs/toolkit"
// Or from '@reduxjs/toolkit/query/react'
import { apiSlice } from './apiSlice';
import userReducer from './userSlice'
import subscriptionReducer from './subscriptionSlice'

const Store = configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [apiSlice.reducerPath]: apiSlice.reducer,
       user:  userReducer,
       subscription: subscriptionReducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
})

export  default Store