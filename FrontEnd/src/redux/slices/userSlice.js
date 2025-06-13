import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const fetchUser = createAsyncThunk("user/login", async (credentials, thunksAPI) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
        return response.data;
    } catch (error) {
        return thunksAPI.rejectWithValue(error.response.data);
    }
});


export const logoutUser = createAsyncThunk("user/logout", async (thunksAPI) => {
    try {
        await axios.post("http://localhost:5000/api/auth/logout");
        return null;
    } catch (error) {
        return thunksAPI.rejectWithValue(error.response.data);  

    }
});



// Async Thunk for  fetching the user profile

export const fetchUserProfile = createAsyncThunk("user/profile", async (thunksAPI) => {
    try {
        const response = await axios.get("http://localhost:5000/api/auth/profile");
        return response.data;
    } catch (error) {
        return thunksAPI.rejectWithValue(error.response.data);
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearState: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { clearState, setUser } = userSlice.actions;
export default userSlice.reducer;