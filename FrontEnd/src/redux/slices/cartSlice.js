import { createSlice } from '@reduxjs/toolkit';

// initial state of the cart  

const initialState = {  
    cartItems: [],
    total: 0,
};

// create a slice for the cart

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload.id
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cartItems.push({...action.payload, quantity: 1});
            }
            state.total += action.payload.price * action.payload.quantity;
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload.id
            );
            state.total -= action.payload.price * action.payload.quantity;
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.total = 0;
        },
    },
});

//export the actions

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
