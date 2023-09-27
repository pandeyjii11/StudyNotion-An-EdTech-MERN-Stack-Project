import { createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initalState = {
    totalItems: localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0 ,
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [] ,
    total: localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initalState,
    reducers: {
        // add to cart
        addToCart(state, value) {
            const course = value.payload
            const index = state.cart.findIndex( (item) => item._id === course._id);

            if(index > 0)
            {
                toast.error("Already added to cart");
                return
            }

            // Update the state variable
            state.cart.push(course);
            state.total+=course.price;
            state.totalItems++;

            // Update the localStorage
            localStorage.setItem("cart", state.cart);
            localStorage.setItem("totalItems", state.totalItems);
            localStorage.setItem("total", state.total);

            toast.success("Added to Cart")
        },

        // remove from cart
        removeFromCart(state, value) {
            const courseId = value.payload;
            const index = state.cart.find( (item) => item._id === courseId);
            if(index>0) {
                state.totalItems--;
                state.total = state.cart[index].price;
                state.cart.splice(index, 1);

                // update the localStorage
                localStorage.setItem("cart", state.cart);
                localStorage.setItem("total", state.total);
                localStorage.setItem("totalItems", state.totalItems);

                toast.success("Removed from cart");
            }
        },

        // reset cart
        resetCart(state, value) {
            state.cart = [];
            state.total = 0;
            state.totalItems = 0;

            // update the localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        }
    },
});

export const {addToCart, removeFromCart, resetCart} = cartSlice.actions;

export default cartSlice.reducer;