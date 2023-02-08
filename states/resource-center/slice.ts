import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  activePage: "resourceCenterForm";
  formData: RCFormInitial;
}

interface RCFormInitial {
  id: string;
  sessionId: any;
  pdfUrl: pdfUrl[];
  videoUrl: videoUrl[];
  sessionLocation: string;
}

interface pdfUrl {
  name: string;
  url: string;
}

interface videoUrl {
  name: string;
  url: string;
}

const initialState: InitialState = {
  activePage: "resourceCenterForm",
  formData: {
    id: "",
    sessionId: "",
    pdfUrl: [],
    videoUrl: [],
    sessionLocation: "",
  },
};

const resourceCenterSlice = createSlice({
  name: "resourceCenterForm",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
});

export const actions = {
  ...resourceCenterSlice.actions,
};

export const { reducer } = resourceCenterSlice;
