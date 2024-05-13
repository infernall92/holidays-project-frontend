import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pendingRequests: []
};

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        addPendingRequest(state, action) {
            const { id, userId, userName, startDate, endDate } = action.payload;
            state.pendingRequests.push({ id, userId, userName, startDate, endDate });
        },
        removePendingRequest(state,action) {
            state.pendingRequests = state.pendingRequests.filter(request => request.id !== action.payload)
        },
    },
})

export const requestActions = requestSlice.actions;

export default requestSlice.reducer;