import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        fetchProductsStart: (state) => {
            state.loading = true;
        },
        fetchProductsSuccess: (state, action) => {
            state.products = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

    },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productSlice.actions;
export default productSlice.reducer;

