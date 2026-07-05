import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWallet } from "../../api/walletApi";

export const fetchWallet = createAsyncThunk("wallet/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await getWallet();
    return res.data.data.wallet;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch wallet");
  }
});

const walletSlice = createSlice({
  name: "wallet",
  initialState: { wallet: null, loading: false, error: null },
  reducers: {
    updateBalance: (state, action) => {
      if (state.wallet) state.wallet.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (s) => { s.loading = true; })
      .addCase(fetchWallet.fulfilled, (s, a) => { s.loading = false; s.wallet = a.payload; })
      .addCase(fetchWallet.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
