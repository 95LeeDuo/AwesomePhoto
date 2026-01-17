import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import frameReducer from "@/store/slices/frameSlice";
import userReducer from "@/store/slices/userSlice";
import uploadImagesSlice from "@/store/slices/uploadImagesSlice.ts";

const rootReducer = combineReducers({
  frame: frameReducer,
  user: userReducer,
  uploadImages: uploadImagesSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["frame", "user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
