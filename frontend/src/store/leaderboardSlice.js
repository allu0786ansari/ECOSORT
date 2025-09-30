import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch leaderboard
export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async () => {
    const res = await axios.get("http://localhost:8000/api/v1/leaderboard");
    return res.data.entries.map(entry => ({
      username: entry.username,      // ✅ use username, not user_id
      score: entry.score,
      itemsAnalyzed: entry.items_analyzed,
      rank: entry.rank,
      streak: entry.streak || 0      // optional if API provides streak
    }));
  }
);

// ✅ Fetch user stats
export const fetchUserStats = createAsyncThunk(
  "leaderboard/fetchUserStats",
  async ({ userId, token }) => {
    const res = await axios.get(
      `http://localhost:8000/api/v1/user/${userId}/stats`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    leaderboard: [],
    stats: null,
    points: 0,
    analyses: [],
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ Update user score locally
    setUserScore(state, action) {
      const { username, points, itemsAnalyzed } = action.payload;
      state.leaderboard = state.leaderboard.map(row =>
        row.username === username
          ? { ...row, score: points, itemsAnalyzed }
          : row
      );
    },
    addPoints(state, action) {
      state.points += action.payload;
    },
    addAnalysis(state, action) {
      state.analyses.push(action.payload);
    },
    resetState(state) {
      state.points = 0;
      state.analyses = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setUserScore, addPoints, addAnalysis, resetState } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
