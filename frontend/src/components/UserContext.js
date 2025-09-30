import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    points: 0,
    token: null, // optional, if you handle auth
  });

  // Set username
  const setUsername = (name) => {
    setUser((prev) => ({
      ...prev,
      name,
    }));
  };

  // Update points
  const updatePoints = (pointsToAdd) => {
    setUser((prev) => ({
      ...prev,
      points: (prev.points || 0) + pointsToAdd,
    }));
  };

  // Optional: Persist user in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUsername, updatePoints }}>
      {children}
    </UserContext.Provider>
  );
};
