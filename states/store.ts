import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer as toastrReducer } from "react-redux-toastr";
import { reducer as lobbyReducer } from "@/states/lobby/slice";
import { reducer as aboutEventReducer } from "@/states/aboutEvent/slice";
import { reducer as auditoriumReducer } from "@/states/auditorium/slice";
import { reducer as authReducer } from "@/states/auth/slice";
import { reducer as resourceCenterReducer } from "@/states/resource-center/slice";

const rootReducer = combineReducers({
  lobby: lobbyReducer,
  auditorium: auditoriumReducer,
  auth: authReducer,
  aboutEvent: aboutEventReducer,
  resourceCenter: resourceCenterReducer,
  toastr: toastrReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
