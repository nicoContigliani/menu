import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ok: false,
  data: null,
  error: null,
  message: null,
};

const chExcelDataSlice = createSlice({
  name: 'chExcelData',
  initialState,
  reducers: {
    setChExcelData(state, action) {
      const { ok, data, error, message } = action.payload;
      state.ok = ok;
      state.data = data;
      state.error = error;
      state.message = message;
    },
    clearChExcelData(state) {
      state.ok = false;
      state.data = null;
      state.error = null;
      state.message = null;
    },
  },
});

export const { setChExcelData, clearChExcelData } = chExcelDataSlice.actions;

export default chExcelDataSlice.reducer;
