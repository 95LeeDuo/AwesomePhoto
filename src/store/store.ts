import { configureStore } from "@reduxjs/toolkit";
import frameReducer from "@/store/slices/frameSlice";
import userReducer from "@/store/slices/userSlice";

export const store = configureStore({
  reducer: {
    frame: frameReducer,
    user: userReducer,
  },
});

// 타입 export (useSelector, useDispatch에서 사용)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;