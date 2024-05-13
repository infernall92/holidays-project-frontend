import { createSlice } from "@reduxjs/toolkit";

const initialHolidayState = {
    setStartDate: null,
    setEndDate: null
}

const holidaySlice = createSlice({
    name: 'holiday',
    initialState: initialHolidayState,
    reducers: {
        setStartDate(state,action) {
            state.startDate = action.payload
        },
        setEndDate(state,action) {
            state.endDate = action.payload
        }
    }
})

export const holidayActions = holidaySlice.actions;

export default holidaySlice.reducer;