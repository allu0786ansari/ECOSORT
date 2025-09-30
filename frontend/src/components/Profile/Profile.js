import React, { useState, useEffect } from "react";
import { Award, TrendingUp, Leaf } from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Optional: listen for localStorage updates from other tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!user) {
    return (
      <div className="profile-container">
        <h2>Not Logged In</h2>
        <p>Please log in to view your profile and achievements.</p>
      </div>
    );
  }

  const achievements = [
    { title: "First Analysis", desc: "Analyzed your first item", icon: "🎯", earned: user.itemsAnalyzed >= 1 },
    { title: "Week Warrior", desc: "7-day sorting streak", icon: "🔥", earned: user.streak >= 7 },
    { title: "Eco Expert", desc: "Reached 1000 points", icon: "⭐", earned: user.points >= 1000 },
    { title: "Master Sorter", desc: "Analyzed 100 items", icon: "🏆", earned: user.itemsAnalyzed >= 100 },
    { title: "Green Guardian", desc: "Saved 100kg CO₂", icon: "🌱", earned: user.co2Saved >= 100 },
    { title: "Recycling Hero", desc: "Perfect week streak", icon: "♻️", earned: user.perfectWeekStreak },
  ];

  const weeklyActivity = user.weeklyActivity || [0, 0, 0, 0, 0, 0, 0]; // array of daily analysis counts
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{user.username}'s Profile</h2>
        <p>Track your eco-journey and achievements</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar">
            {user.username
              ? user.username.split(" ").map((n) => n[0]).join("")
              : "EU"}
          </div>
          <h3>{user.username}</h3>
          <p className="user-level">{user.level || "Eco-Warrior"}</p>

          <div className="profile-stats">
            <div>
              <span>Total Points</span>
              <strong>{user.points || 0}</strong>
            </div>
            <div>
              <span>Current Streak</span>
              <strong>{user.streak || 0} days</strong>
            </div>
            <div>
              <span>Items Analyzed</span>
              <strong>{user.itemsAnalyzed || 0}</strong>
            </div>
          </div>

          <button className="edit-btn">Edit Profile</button>
        </div>

        {/* Right Section */}
        <div className="profile-details">
          {/* Achievements */}
          <div className="achievements">
            <h3><Award size={20} /> Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`achievement ${a.earned ? "earned" : "locked"}`}
                >
                  <div className="icon">{a.icon}</div>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="weekly-activity">
            <h3><TrendingUp size={20} /> Weekly Activity</h3>
            <div className="activity-bars">
              {weeklyActivity.map((h, i) => (
                <div key={i} className="bar">
                  <div style={{ height: `${(h / Math.max(...weeklyActivity, 1)) * 100}%` }}></div>
                  <span>{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="impact">
            <h3><Leaf size={20} /> Your Environmental Impact</h3>
            <div className="impact-grid">
              <div>
                <div className="impact-value green">{user.co2Saved || 0} kg</div>
                <p>CO₂ Saved</p>
                <small>This month</small>
              </div>
              <div>
                <div className="impact-value blue">{user.itemsDiverted || 0}</div>
                <p>Items Diverted</p>
                <small>From landfills</small>
              </div>
            </div>
            <div className="impact-note">
              🌍 Your actions this month equal planting <strong>{user.treesPlanted || 0} trees</strong>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
