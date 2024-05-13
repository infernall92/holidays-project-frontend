import { createSlice } from "@reduxjs/toolkit";

const initialLoginState = {
    isLoggedIn: false,
    isAdmin: false,
    employees: [],
    admins: [],
    employeeId: null,
    employeeName: null,
    isAuthenticated: false,
}

const loginSlice = createSlice({
    name: 'login',
    initialState: initialLoginState,
    reducers: {
        login(state) {
            state.isLoggedIn = true
        },
        logout(state) {
            state.isLoggedIn = false
        },
        isAdmin(state) {
            state.isAdmin = true
        },
        isNotAdmin(state) {
            state.isAdmin = false
        },
        addEmployee(state,action) {
            state.employees.push(action.payload)
        },
        setEmployees(state, action) {
            state.employees = action.payload;
        },
        setAdmins(state,action) {
            state.admins = action.payload
        },
        setEmployeeId(state,action) {
            state.employeeId = action.payload;
        },
        setEmployeeName(state,action) {
            state.employeeName = action.payload
        },
        setIsAuthenticated(state) {
            state.isAuthenticated = true
        }

    }
})

export const loginActions = loginSlice.actions;

export default loginSlice.reducer;