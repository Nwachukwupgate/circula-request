import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token: null,
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        GetUserToken: (state, {payload}) => {
            state.token = payload
        },
        SaveUser: (state, {payload}) => {
            state.user = payload
        },
    }
});

export const { GetUserToken, SaveUser } = userSlice.actions;
export default userSlice.reducer