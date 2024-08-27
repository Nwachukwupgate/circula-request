import { configureStore } from "@reduxjs/toolkit"
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './apiSlice';
import userReducer from './userSlice'

const Store = configureStore({
    reducer: {
      // Add the generated reducer as a specific top-level slice
      [apiSlice.reducerPath]: apiSlice.reducer,
       user:  userReducer
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
})

export  default Store