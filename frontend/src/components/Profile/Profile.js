import React from "react";
import { Award, TrendingUp, Leaf } from "lucide-react";
import "./Profile.css";

const Profile = ({ user }) => {
  const achievements = [
    { title: "First Analysis", desc: "Analyzed your first item", icon: "🎯", earned: true },
    { title: "Week Warrior", desc: "7-day sorting streak", icon: "🔥", earned: true },
    { title: "Eco Expert", desc: "Reached 1000 points", icon: "⭐", earned: true },
    { title: "Master Sorter", desc: "Analyzed 100 items", icon: "🏆", earned: false },
    { title: "Green Guardian", desc: "Saved 100kg CO₂", icon: "🌱", earned: false },
    { title: "Recycling Hero", desc: "Perfect week streak", icon: "♻️", earned: false },
  ];

  const weeklyActivity = [12, 8, 15, 20, 18, 25, 22];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Track your eco-journey and achievements</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <h3>{user.name}</h3>
          <p className="user-level">{user.level}</p>

          <div className="profile-stats">
            <div><span>Total Points</span><strong>{user.points}</strong></div>
            <div><span>Current Streak</span><strong>{user.streak} days</strong></div>
            <div><span>Items Analyzed</span><strong>{user.itemsAnalyzed}</strong></div>
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
                  <div style={{ height: `${(h / 25) * 100}%` }}></div>
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
                <div className="impact-value green">45.2 kg</div>
                <p>CO₂ Saved</p>
                <small>This month</small>
              </div>
              <div>
                <div className="impact-value blue">127</div>
                <p>Items Diverted</p>
                <small>From landfills</small>
              </div>
            </div>
            <div className="impact-note">
              🌍 Your actions this month equal planting <strong>2.3 trees</strong>!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
