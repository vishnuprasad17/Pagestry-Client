import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminData } from "../../../types/auth";

interface AdminState {
  isLoggedIn: boolean;
  admin: AdminData | null;
}

const initialState: AdminState = {
  isLoggedIn: false,
  admin: null,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<AdminData>) => {
      state.isLoggedIn = true;
      state.admin = action.payload;
    },
    clearAdmin: (state) => {
      state.isLoggedIn = false;
      state.admin = null;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;