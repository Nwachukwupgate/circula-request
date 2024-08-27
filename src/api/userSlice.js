import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    token: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        GetUserToken: (state, {payload}) => {
            state.token = payload
        },
    }
});

export const { GetUserToken } = userSlice.actions;
export default userSlice.reducer