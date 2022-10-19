import { createSlice } from "@reduxjs/toolkit";

// import appApi from "../services/appApi";


export const productSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    getHomeProducts: (_, action) => { return action.payload }
  }
})

export const { getHomeProducts } = productSlice.actions;

export default productSlice.reducer;