import React from 'react';
import { 
  Users, 
  Baby, 
  Calendar, 
  Brain, 
  Activity, 
  Server, 
  Database, 
  TrendingUp, 
  UserPlus, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText,
  MessageSquare,
  Hospital,
  Shield,
  BarChart3,
  Stethoscope,
  Heart,
  Bell,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  ChevronRight,
  Home,
  Menu,
  X
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  // Sample data for demonstration
  const overviewStats = {
    totalUsers: 2847,
    activePregnancies: 456,
    pendingAppointments: 127,
    aiPredictions: 89
  };

  const weeklyStats = {
    newRegistrations: 34,
    completedAppointments: 156,
    aiPredictionsGenerated: 23,
    engagementRate: 78
  };

  const recentActivities = [
    { id: 1, type: 'registration', user: 'Priya Perera', time: '2 minutes ago', icon: UserPlus },
    { id: 2, type: 'appointment', user: 'Dr. Silva with Nimali Fernando', time: '15 minutes ago', icon: Calendar },
    { id: 3, type: 'prediction', user: 'AI: High-risk diabetes for Kamala Dias', time: '32 minutes ago', icon: Brain },
    { id: 4, type: 'vaccination', user: 'BCG vaccination completed - Baby Sahan', time: '1 hour ago', icon: Shield },
    { id: 5, type: 'content', user: 'New nutrition article published', time: '2 hours ago', icon: FileText }
  ];

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
          {change && (
            <p className={`stat-card-change ${change > 0 ? 'positive' : 'negative'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`stat-card-icon ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="dashboard-main">
      {/* Overview Cards */}
      <div className="overview-grid">
        <StatCard
          title="Total Users"
          value={overviewStats.totalUsers.toLocaleString()}
          icon={Users}
          color="blue"
          change={12}
        />
        <StatCard
          title="Active Pregnancies"
          value={overviewStats.activePregnancies}
          icon={Heart}
          color="pink"
          change={8}
        />
        <StatCard
          title="Pending Appointments"
          value={overviewStats.pendingAppointments}
          icon={Calendar}
          color="orange"
          change={-3}
        />
        <StatCard
          title="AI Predictions Today"
          value={overviewStats.aiPredictions}
          icon={Brain}
          color="purple"
          change={15}
        />
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-title">New Registrations</p>
              <p className="quick-stat-value green">{weeklyStats.newRegistrations}</p>
              <p className="quick-stat-period">This week</p>
            </div>
            <UserPlus className="quick-stat-icon green" />
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-title">Completed Appointments</p>
              <p className="quick-stat-value blue">{weeklyStats.completedAppointments}</p>
              <p className="quick-stat-period">This week</p>
            </div>
            <CheckCircle className="quick-stat-icon blue" />
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-title">AI Predictions</p>
              <p className="quick-stat-value purple">{weeklyStats.aiPredictionsGenerated}</p>
              <p className="quick-stat-period">This week</p>
            </div>
            <Brain className="quick-stat-icon purple" />
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-content">
            <div className="quick-stat-info">
              <p className="quick-stat-title">Engagement Rate</p>
              <p className="quick-stat-value indigo">{weeklyStats.engagementRate}%</p>
              <p className="quick-stat-period">This week</p>
            </div>
            <TrendingUp className="quick-stat-icon indigo" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Recent Activity Feed */}
        <div className="activity-card">
          <div className="activity-header">
            <div className="activity-header-content">
              <h3 className="activity-title">Recent Activity</h3>
              <button className="activity-view-all">View All</button>
            </div>
          </div>
          <div className="activity-content">
            <div className="activity-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon-container">
                    <activity.icon className="activity-icon" />
                  </div>
                  <div className="activity-details">
                    <p className="activity-user">{activity.user}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                  <ChevronRight className="activity-chevron" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="health-card">
          <div className="health-header">
            <h3 className="health-title">System Health</h3>
          </div>
          <div className="health-content">
            <div className="health-list">
              <div className="health-item">
                <div className="health-item-left">
                  <Server className="health-icon green" />
                  <span className="health-name">Server Status</span>
                </div>
                <div className="health-item-right">
                  <div className="health-status-dot green"></div>
                  <span className="health-status-text green">Healthy</span>
                </div>
              </div>
              <div className="health-item">
                <div className="health-item-left">
                  <Database className="health-icon green" />
                  <span className="health-name">Database</span>
                </div>
                <div className="health-item-right">
                  <div className="health-status-dot green"></div>
                  <span className="health-status-text green">Online</span>
                </div>
              </div>
              <div className="health-item">
                <div className="health-item-left">
                  <Brain className="health-icon yellow" />
                  <span className="health-name">AI Models</span>
                </div>
                <div className="health-item-right">
                  <div className="health-status-dot yellow"></div>
                  <span className="health-status-text yellow">Processing</span>
                </div>
              </div>
              <div className="health-item">
                <div className="health-item-left">
                  <Shield className="health-icon green" />
                  <span className="health-name">Security</span>
                </div>
                <div className="health-item-right">
                  <div className="health-status-dot green"></div>
                  <span className="health-status-text green">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions-grid">
        <button className="quick-action-btn">
          <div className="quick-action-content">
            <UserPlus className="quick-action-icon blue" />
            <div className="quick-action-text">
              <p className="quick-action-title">Add New User</p>
              <p className="quick-action-description">Register mother or provider</p>
            </div>
          </div>
        </button>
        <button className="quick-action-btn">
          <div className="quick-action-content">
            <Calendar className="quick-action-icon green" />
            <div className="quick-action-text">
              <p className="quick-action-title">Schedule Appointment</p>
              <p className="quick-action-description">Book new appointment</p>
            </div>
          </div>
        </button>
        <button className="quick-action-btn">
          <div className="quick-action-content">
            <MessageSquare className="quick-action-icon purple" />
            <div className="quick-action-text">
              <p className="quick-action-title">Send Announcement</p>
              <p className="quick-action-description">Broadcast to users</p>
            </div>
          </div>
        </button>
        <button className="quick-action-btn">
          <div className="quick-action-content">
            <BarChart3 className="quick-action-icon orange" />
            <div className="quick-action-text">
              <p className="quick-action-title">Generate Report</p>
              <p className="quick-action-description">Export analytics</p>
            </div>
          </div>
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
