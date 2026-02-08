import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  title: string;
  sellingPrice: number;
  stock: number;
  coverImage: string;
}

interface CartData extends CartItem {
  quantity: number;
}

interface CartState {
  cartItems: CartData[];
}
const initialState: CartState = {
  cartItems: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.cartItems.find(i => i.id === action.payload.id);

      if (item) {
        if (item.quantity < item.stock) {
          item.quantity += 1;
        }
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item && item.quantity < item.stock) item.quantity++;
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity--;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload);
    },

    clearCart: state => {
      state.cartItems = [];
    }
  }
});

export const { addToCart, increaseQty, decreaseQty, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;