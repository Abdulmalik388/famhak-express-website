import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        setNotifications(state, action) {
            state.notifications = action.payload
        },
        setUnreadCount(state, action) {
            state.unreadCount = action.payload
        },
    },
})

export const { setNotifications, setUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer