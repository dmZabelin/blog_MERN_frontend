import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("AUTH/fetchAuth", async (params) => {
  const { data } = await axios.post("/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk("AUTH/fetchAuthMe", async () => {
  const { data } = await axios.get("/me");
  return data;
});

export const fetchSignup = createAsyncThunk(
  "AUTH/fetchSignup",
  async (params) => {
    const { data } = await axios.post("/signup", params);
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "AUTH",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuth.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchSignup.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchSignup.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchSignup.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
