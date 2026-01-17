import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUploadImages } from "@/types";

interface uploadImagesState {
  uploadImages: IUploadImages[];
}

const initialState: uploadImagesState = {
  uploadImages: [],
};

const uploadImagesSlice = createSlice({
  name: "uploadImages",
  initialState,
  reducers: {
    setUploadImages: (state, action: PayloadAction<IUploadImages[]>) => {
      state.uploadImages = action.payload;
    },
    resetUploadImages: (state) => {
      state.uploadImages = [];
    },
  },
});

export const { setUploadImages, resetUploadImages } = uploadImagesSlice.actions;
export default uploadImagesSlice.reducer;
