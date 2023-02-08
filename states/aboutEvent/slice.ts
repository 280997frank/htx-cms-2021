import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  activePage: "about-event";
}

const initialState: InitialState = {
  activePage: "about-event",
};

const aboutEventSlice = createSlice({
  name: "about-event",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    toggleActivePage: (state) => {
      switch (state.activePage) {
        case "about-event":
          state.activePage = "about-event";
          break;
      }
    },
  },
});

export const actions = {
  ...aboutEventSlice.actions,
};

export const { reducer } = aboutEventSlice;
