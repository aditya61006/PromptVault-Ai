import { configureStore, createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('pv_token');
const hasLegacyDemoToken = storedToken === 'demo-token';

if (hasLegacyDemoToken) {
  localStorage.removeItem('pv_user');
  localStorage.removeItem('pv_token');
}

const initialUser = hasLegacyDemoToken ? null : JSON.parse(localStorage.getItem('pv_user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: initialUser, token: hasLegacyDemoToken ? null : storedToken },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('pv_user', JSON.stringify(action.payload.user));
      localStorage.setItem('pv_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('pv_user');
      localStorage.removeItem('pv_token');
    }
  }
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: localStorage.getItem('pv_theme') || 'dark' },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pv_theme', state.theme);
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export const { toggleTheme } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer
  }
});
