import React from 'react';
import { Trophy } from 'lucide-react';
import './Leaderboard.css'; // ✅ external css

const Leaderboard = ({ user }) => {
  const topUsers = [
    { rank: 1, name: 'Emma Thompson', points: 2340, badge: '🏆', level: 'Eco Master' },
    { rank: 2, name: 'David Chen', points: 2180, badge: '🥈', level: 'Green Guardian' },
    { rank: 3, name: 'Sarah Rodriguez', points: 1950, badge: '🥉', level: 'Eco Warrior' },
    { rank: 4, name: 'Mike Johnson', points: 1820, badge: '⭐', level: 'Eco Warrior' },
    { rank: 5, name: 'Lisa Park', points: 1750, badge: '⭐', level: 'Green Helper' },
    { rank: 6, name: 'James Wilson', points: 1680, badge: '⭐', level: 'Green Helper' },
    { rank: 7, name: 'Anna Martinez', points: 1590, badge: '⭐', level: 'Green Helper' },
    { rank: 8, name: 'Tom Brown', points: 1520, badge: '⭐', level: 'Eco Novice' },
    { rank: 9, name: 'Rachel Green', points: 1450, badge: '⭐', level: 'Eco Novice' },
    { rank: 10, name: 'Chris Taylor', points: 1380, badge: '⭐', level: 'Eco Novice' }
  ];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Community Leaderboard</h2>
        <p>See how you rank among eco-warriors worldwide!</p>
      </div>

      {/* User Rank */}
      <div className="user-rank-card">
        <div className="rank-card-content">
          <div>
            <h3>Your Rank</h3>
            <p className="subtitle">Keep up the great work!</p>
          </div>
          <div className="rank-number">
            <div className="big-rank">#12</div>
            <div className="subtitle">This Week</div>
          </div>
        </div>
      </div>

      {/* Top Users */}
      <div className="leaderboard-list">
        <div className="list-header">
          <h3>Top Eco-Warriors</h3>
        </div>
        <div className="players">
          {topUsers.map((player, index) => (
            <div
              key={index}
              className={`player-row ${player.name === user.name ? 'highlight' : ''}`}
            >
              <div className="player-info">
                <div
                  className={`rank-circle ${player.rank <= 3 ? 'top-rank' : 'normal-rank'}`}
                >
                  {player.rank}
                </div>
                <div className="badge">{player.badge}</div>
                <div>
                  <p className="player-name">{player.name}</p>
                  <p className="player-level">{player.level}</p>
                </div>
              </div>
              <div className="player-points">
                <p className="points">{player.points}</p>
                <p className="points-label">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenge */}
      <div className="weekly-challenge">
        <div className="challenge-header">
          <Trophy className="trophy-icon" size={24} />
          <h3>Weekly Challenge</h3>
        </div>
        <p className="challenge-desc">Sort 50 items correctly to earn bonus points!</p>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '68%' }}></div>
          </div>
          <span className="progress-text">34/50</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
