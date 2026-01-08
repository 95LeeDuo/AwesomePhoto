import { createSlice } from "@reduxjs/toolkit";

// 프레임 타입 정의
export type userType = "1x4" | "h2x2" | "v2x2" | null;

interface IuserState {}

const initialState: IuserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
