import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUploadImages } from "@/types";

interface ImageState {
  uploadImages: IUploadImages[];
  frameSlots: (IUploadImages | null)[];
}

const initialState: ImageState = {
  uploadImages: [],
  frameSlots: [null, null, null, null],
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    // 기존 imageSlice 액션들
    setUploadImages: (state, action: PayloadAction<IUploadImages[]>) => {
      state.uploadImages = action.payload;
    },
    // photoSlice에서 가져온 frameSlots 관련 액션들
    addPhotoToSlot: (
      state,
      action: PayloadAction<{ photo: IUploadImages; slotIndex: number }>,
    ) => {
      const { photo, slotIndex } = action.payload;
      if (slotIndex >= 0 && slotIndex < state.frameSlots.length) {
        state.frameSlots[slotIndex] = photo;
      }
    },
    removePhotoFromSlot: (state, action: PayloadAction<number>) => {
      const slotIndex = action.payload;
      if (slotIndex >= 0 && slotIndex < state.frameSlots.length) {
        state.frameSlots[slotIndex] = null;
      }
    },
    clearFrameSlots: (state) => {
      state.frameSlots = [null, null, null, null];
    },
  },
});

export const {
  setUploadImages,
  addPhotoToSlot,
  removePhotoFromSlot,
  clearFrameSlots,
} = imageSlice.actions;
export default imageSlice.reducer;