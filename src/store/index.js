import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login';
import holidayReducer from './holiday';
import requestReducer from './request';

const store = configureStore({
    reducer: { login: loginReducer, holiday: holidayReducer, request: requestReducer }
})


export default store;