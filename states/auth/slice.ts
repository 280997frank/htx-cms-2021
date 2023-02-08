import { removeAccessToken } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  profile: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: {
      name: string;
      type: string;
    }[];
  };
  loading: boolean;
  error: unknown;
}

const initialState: InitialState = {
  profile: {
    id: "",
    name: "",
    email: "",
    role: "",
    permissions: [
      {
        name: "",
        type: "",
      },
    ],
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clear: () => initialState,
    setUser: (state, action) => {
      state.profile = action.payload;
    },
    logout: () => {
      // document.cookie = 'mfs_token=; max-age=0; path=/;'
      /* cookies.remove(process.env.REACT_APP_COOKIE_NAME as string, {
        maxAge: 0,
        path: '/'
      }) */

      removeAccessToken();

      return initialState;
    },
  },
});

export const actions = {
  ...authSlice.actions,
};

export const reducer = authSlice.reducer;
