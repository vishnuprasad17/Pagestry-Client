import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  selectedAddressId: string | null;
}

const initialState: CheckoutState = {
  selectedAddressId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },
    clearCheckoutAddress: (state) => {
      state.selectedAddressId = null;
    },
  },
});

export const { setCheckoutAddress, clearCheckoutAddress } = checkoutSlice.actions;
export default checkoutSlice.reducer;