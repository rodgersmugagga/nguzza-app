import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getAuthHeaders = (getState) => {
  const token = getState()?.user?.currentUser?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await fetch('/api/wishlist', {
        headers: getAuthHeaders(getState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load wishlist');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue, getState }) => {
    try {
      const productId = product?._id || product?.id;
      if (!productId) throw new Error('Invalid product selected');

      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders(getState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add to wishlist');
      return product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(getState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to remove from wishlist');
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const payloadId = action.payload?._id || action.payload?.id;
        const exists = state.items.some((item) => (item._id || item.id) === payloadId);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => (item._id || item.id) !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
