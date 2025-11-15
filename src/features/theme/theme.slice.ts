import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface themeState {
  theme: "dark" | "light";
}

const initialState: themeState = {
  theme: "light",
};

const themeReducer = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
  },
});

export default themeReducer.reducer;
export const { setTheme } = themeReducer.actions;
