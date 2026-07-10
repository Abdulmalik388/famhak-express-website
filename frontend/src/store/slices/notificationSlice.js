import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationAPI } from '../../services/api'

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationAPI.getAll()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationAPI.getUnreadCount()
            return response.data.unread_count
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const markNotificationRead = createAsyncThunk(
    'notifications/markRead',
    async (id, { rejectWithValue }) => {
        try {
            await notificationAPI.markRead(id)
            return id
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const markAllNotificationsRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            await notificationAPI.markAllRead()
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setUnreadCount(state, action) {
            state.unreadCount = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload
                state.unreadCount = action.payload.filter(n => !n.is_read).length
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const id = action.payload
                const notif = state.notifications.find(n => n.id === id)
                if (notif) {
                    notif.is_read = true
                    state.unreadCount = Math.max(0, state.unreadCount - 1)
                }
            })
            .addCase(markAllNotificationsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.is_read = true)
                state.unreadCount = 0
            })
    },
})

export const { setUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer