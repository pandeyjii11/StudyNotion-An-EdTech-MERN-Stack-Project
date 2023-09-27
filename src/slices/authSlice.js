import { createSlice } from "@reduxjs/toolkit";

const initalState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null ,
    signUpData: null ,
    loading: false
}

const authSlie = createSlice({
    name: "auth",
    initialState: initalState,
    reducers: {
        setToken(state, value) {
            state.token = value.payload;
        },
        setSignupData(state, value) {
            state.signUpData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        }
    },
});

export const {setToken, setSignupData, setLoading} = authSlie.actions;

export default authSlie.reducer;