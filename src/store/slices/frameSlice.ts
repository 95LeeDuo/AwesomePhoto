import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 프레임 타입 정의
export type FrameType = "1x4-vertical" | "2x2-vertical" | "2x2-horizontal" | null;

interface FrameState {
  selectedFrame: FrameType;
}

const initialState: FrameState = {
  selectedFrame: null,
};

const frameSlice = createSlice({
  name: "frame",
  initialState,
  reducers: {
    setFrame: (state, action: PayloadAction<FrameType>) => {
      state.selectedFrame = action.payload;
    },
    clearFrame: (state) => {
      state.selectedFrame = null;
    },
  },
});

export const { setFrame, clearFrame } = frameSlice.actions;
export default frameSlice.reducer;

