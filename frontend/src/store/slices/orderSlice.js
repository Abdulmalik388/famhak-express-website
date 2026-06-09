import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderAPI } from '../../services/api'

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getMyOrders()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchAvailableOrders = createAsyncThunk(
    'orders/fetchAvailableOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await orderAPI.getAvailableOrders()
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderAPI.createOrder(orderData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await orderAPI.updateOrderStatus(id, { status })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        availableOrders: [],
        currentOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCurrentOrder(state, action) {
            state.currentOrder = action.payload
        },
        clearOrderError(state) {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => { state.loading = true })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchAvailableOrders.pending, (state) => { state.loading = true })
            .addCase(fetchAvailableOrders.fulfilled, (state, action) => {
                state.loading = false
                state.availableOrders = action.payload
            })
            .addCase(fetchAvailableOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createOrder.pending, (state) => { state.loading = true })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false
                state.orders.unshift(action.payload.order)
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updated = action.payload.order
                state.orders = state.orders.map(o => o.id === updated.id ? updated : o)
                state.availableOrders = state.availableOrders.filter(o => o.id !== updated.id)
            })
    },
})

export const { setCurrentOrder, clearOrderError } = orderSlice.actions
export default orderSlice.reducer