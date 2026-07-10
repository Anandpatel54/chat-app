import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types';

interface UserState {
  searchResults: IUser[];
  searchLoading: boolean;
  selectedUser: IUser | null;
}

const initialState: UserState = {
  searchResults: [],
  searchLoading: false,
  selectedUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<IUser[]>) => {
      state.searchResults = action.payload;
      state.searchLoading = false;
    },
    setSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.searchLoading = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<IUser | null>) => {
      state.selectedUser = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchLoading = false;
    },
  },
});

export const {
  setSearchResults,
  setSearchLoading,
  setSelectedUser,
  clearSearchResults,
} = userSlice.actions;

export default userSlice.reducer;
