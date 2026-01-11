import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUserInfo } from "@/types";

interface UserState {
  userInfo: IUserInfo | null;
}

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<IUserInfo>) => {
      state.userInfo = action.payload;
    },
    resetUserInfo: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, resetUserInfo } = userSlice.actions;
export default userSlice.reducer;
