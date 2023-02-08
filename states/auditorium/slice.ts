import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  activePage: "auditorium" | "auditorium_form";
}

const initialState: InitialState = {
  activePage: "auditorium",
};

const auditoriumSlice = createSlice({
  name: "auditorium",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    toggleActivePage: (state) => {
      switch (state.activePage) {
        case "auditorium":
          state.activePage = "auditorium_form";
          break;
        case "auditorium_form":
          state.activePage = "auditorium";
          break;
      }
    },
  },
});

export const actions = {
  ...auditoriumSlice.actions,
};

export const { reducer } = auditoriumSlice;
