import React from 'react';
import { 
  Target, TrendingUp, Star, Recycle, Camera, BookOpen, 
  MessageCircle, ChevronRight 
} from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ icon, title, value, subtitle, bgColor }) => (
  <div className={`stat-card ${bgColor}`}>
    <div className="stat-card-content">
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description, onClick, gradient }) => (
  <div 
    onClick={onClick}
    className="action-card"
  >
    <div className={`action-icon ${gradient}`}>
      {icon}
    </div>
    <h3 className="action-title">{title}</h3>
    <p className="action-description">{description}</p>
    <button className="action-button">
      <span>Get Started</span>
      <ChevronRight size={16} />
    </button>
  </div>
);

const Dashboard = ({ user, onNavigate }) => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Welcome back, {user.name}!</h2>
          <p className="dashboard-subtitle">Ready to make a difference today? 🌍</p>
        </div>
        <div className="level-box">
          <div className="level-text">{user.level}</div>
          <div className="level-subtext">Current Level</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stat-grid">
        <StatCard 
          icon={<Target className="icon-blue" size={24} />}
          title="Items Analyzed"
          value={user.itemsAnalyzed}
          subtitle="This month"
          bgColor="bg-blue"
        />
        <StatCard 
          icon={<TrendingUp className="icon-green" size={24} />}
          title="Current Streak"
          value={`${user.streak} days`}
          subtitle="Keep it up!"
          bgColor="bg-green"
        />
        <StatCard 
          icon={<Star className="icon-yellow" size={24} />}
          title="Total Points"
          value={user.points}
          subtitle="Eco Points earned"
          bgColor="bg-yellow"
        />
        <StatCard 
          icon={<Recycle className="icon-purple" size={24} />}
          title="CO₂ Saved"
          value="45 kg"
          subtitle="This month"
          bgColor="bg-purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="action-grid">
        <ActionCard 
          icon={<Camera size={32} />}
          title="Analyze New Item"
          description="Upload or snap a photo to identify and sort your waste"
          onClick={() => onNavigate('camera')}
          gradient="gradient-green-blue"
        />
        <ActionCard 
          icon={<BookOpen size={32} />}
          title="Learn Recycling"
          description="Discover tips and facts about sustainable waste management"
          onClick={() => onNavigate('education')}
          gradient="gradient-blue-purple"
        />
        <ActionCard 
          icon={<MessageCircle size={32} />}
          title="Ask AI Assistant"
          description="Get instant answers about waste sorting and recycling"
          onClick={() => onNavigate('chat')}
          gradient="gradient-purple-pink"
        />
      </div>

      {/* Recent Activity */}
      <div className="activity-box">
        <h3 className="activity-title">Recent Activity</h3>
        <div className="activity-list">
          {[
            { item: 'Plastic bottle', action: 'Correctly sorted', points: '+10', time: '2 hours ago' },
            { item: 'Food container', action: 'Analyzed & recycled', points: '+15', time: '1 day ago' },
            { item: 'Paper cup', action: 'Composted properly', points: '+5', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-left">
                <div className="activity-dot"></div>
                <div>
                  <p className="activity-item-title">{activity.item}</p>
                  <p className="activity-item-action">{activity.action}</p>
                </div>
              </div>
              <div className="activity-right">
                <p className="activity-points">{activity.points}</p>
                <p className="activity-time">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
