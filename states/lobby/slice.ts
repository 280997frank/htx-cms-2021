import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  activePage: "lobby" | "hotspot";
}

const initialState: InitialState = {
  activePage: "lobby",
};

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    toggleActivePage: (state) => {
      switch (state.activePage) {
        case "lobby":
          state.activePage = "hotspot";
          break;
        case "hotspot":
          state.activePage = "lobby";
          break;
      }
    },
  },
});

export const actions = {
  ...lobbySlice.actions,
};

export const { reducer } = lobbySlice;
