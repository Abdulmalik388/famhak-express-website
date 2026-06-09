import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: orderReducer,
        notifications: notificationReducer,
    },
})