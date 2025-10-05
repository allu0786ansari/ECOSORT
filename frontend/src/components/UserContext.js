import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    points: 0,
    token: null,
    itemsAnalyzed: 0,
    streak: 0,
    level: "Eco-Explorer",
    co2Saved: 0,
    treesPlanted: 0,
    perfectWeekStreak: false,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  });

  // Set username
  const setUsername = (name) => {
    setUser((prev) => ({
      ...prev,
      name,
    }));
  };

  // Update points only
  const updatePoints = (pointsToAdd) => {
    setUser((prev) => ({
      ...prev,
      points: (prev.points || 0) + pointsToAdd,
    }));
  };

  // Update multiple stats after analysis
  const addAnalysisStats = ({ points = 0, co2 = 0, trees = 0 }) => {
    setUser((prev) => {
      const today = new Date().getDay(); // 0 = Sun, 1 = Mon ...
      const newWeeklyActivity = [...prev.weeklyActivity];
      newWeeklyActivity[today === 0 ? 6 : today - 1] += 1;

      const newPoints = (prev.points || 0) + points;

      // Determine level based on points
      let newLevel = prev.level;
      if (newPoints >= 1000) newLevel = "Eco Expert";
      else if (newPoints >= 500) newLevel = "Eco Warrior";
      else if (newPoints >= 100) newLevel = "Eco Explorer";

      return {
        ...prev,
        points: newPoints,
        itemsAnalyzed: (prev.itemsAnalyzed || 0) + 1,
        streak: (prev.streak || 0) + 1,
        co2Saved: (prev.co2Saved || 0) + co2,
        treesPlanted: (prev.treesPlanted || 0) + trees,
        weeklyActivity: newWeeklyActivity,
        level: newLevel,
        perfectWeekStreak: newWeeklyActivity.every((v) => v > 0),
      };
    });
  };

  // Reset user on logout
  const logout = () => {
    setUser({
      name: null,
      points: 0,
      token: null,
      itemsAnalyzed: 0,
      streak: 0,
      level: "Eco-Explorer",
      co2Saved: 0,
      treesPlanted: 0,
      perfectWeekStreak: false,
      weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    });
    localStorage.removeItem("user");
  };

  // Persist user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUsername, updatePoints, addAnalysisStats, logout }}>
      {children}
    </UserContext.Provider>
  );
};
