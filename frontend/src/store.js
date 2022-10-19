import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";
import appApi from "./services/appApi";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import thunk from 'redux-thunk';

const reducer = combineReducers({
  user: userReducer,
  products: productReducer,
  appApi: appApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [appApi.reducerPath, 'products'],
}

const persistedReducer = persistReducer(persistConfig, reducer)


const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, appApi.middleware]
});

export default store;