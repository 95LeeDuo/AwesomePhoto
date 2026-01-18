import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PhotoImage {
  id: string;
  previewURL: string;
  name: string;
}

interface PhotoState {
  selectedPhotos: PhotoImage[];
  frameSlots: (PhotoImage | null)[]; // 프레임 슬롯에 배치된 이미지들 (최대 4개)
}

const initialState: PhotoState = {
  selectedPhotos: [],
  frameSlots: [null, null, null, null], // 4개 슬롯
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhotos: (state, action: PayloadAction<PhotoImage[]>) => {
      state.selectedPhotos = action.payload;
    },
    addPhotoToSlot: (
      state,
      action: PayloadAction<{ photo: PhotoImage; slotIndex: number }>,
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
    clearPhotos: (state) => {
      state.selectedPhotos = [];
      state.frameSlots = [null, null, null, null];
    },
    setNextPhotoToSlot: (state, action: PayloadAction<number>) => {
      const slotIndex = action.payload;
      if (slotIndex < 0 || slotIndex >= state.frameSlots.length) return;

      // 현재 슬롯에 이미지가 있으면 다음 슬롯으로
      if (state.frameSlots[slotIndex]) {
        // 다음 빈 슬롯 찾기
        const nextEmptySlot = state.frameSlots.findIndex((slot) => !slot);
        if (nextEmptySlot !== -1) {
          state.frameSlots[nextEmptySlot] = state.frameSlots[slotIndex];
        }
      }

      // 사용되지 않은 첫 번째 이미지 찾기
      const usedPhotoIds = new Set(
        state.frameSlots
          .filter((slot) => slot !== null)
          .map((slot) => slot!.id),
      );
      const nextPhoto = state.selectedPhotos.find(
        (photo) => !usedPhotoIds.has(photo.id),
      );

      if (nextPhoto) {
        state.frameSlots[slotIndex] = nextPhoto;
      }
    },
  },
});

export const {
  setPhotos,
  addPhotoToSlot,
  removePhotoFromSlot,
  clearPhotos,
  setNextPhotoToSlot,
} = photoSlice.actions;
export default photoSlice.reducer;
