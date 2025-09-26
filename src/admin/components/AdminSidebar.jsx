import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import './AdminSidebar.css';

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const navigationSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: Home, path: '/admin/dashboard', active: location.pathname === '/admin' || location.pathname === '/admin/dashboard' },
        { name: 'Analytics', icon: BarChart3, path: '/admin/analytics',active: location.pathname === '/admin/analytics'  }
      ]},
        {
          title: 'User Management',
          items: [
            { name: 'All Users', icon: Users, path: '/admin/users', active: location.pathname === '/admin/users', badge: '456' },
            { name: 'Mothers', icon: Heart, path: '/admin/users/mothers', active: location.pathname === '/admin/users/mothers', badge: '350' },
            { name: 'Healthcare Providers', icon: Stethoscope, path: '/admin/users/providers', active: location.pathname === '/admin/users/providers', badge: '106' },
            { name: 'Permission Requests', icon: CheckCircle, path: '/admin/permission-requests', active: location.pathname === '/admin/permission-requests', badge: '23' },
            { name: 'Roles & Access', icon: Shield, path: '/admin/users/roles', active: location.pathname === '/admin/users/roles' }
          ]
        },
        {
          title: 'AI Management',
          items: [
            { name: 'AI Dashboard', icon: Brain, path: '/admin/ai', active: location.pathname === '/admin/ai' },
            { name: 'Baby Weight Prediction', icon: Baby, path: '/admin/ai/baby-weight', active: location.pathname === '/admin/ai/baby-weight' },
            { name: 'Diabetes Risk', icon: Activity, path: '/admin/ai/diabetes-risk', active: location.pathname === '/admin/ai/diabetes-risk' },
            { name: 'AI Analytics', icon: TrendingUp, path: '/admin/ai/analytics', active: location.pathname === '/admin/ai/analytics' }
          ]
        },
        {
          title: 'Appointments & Calendar',
          items: [
            { name: 'Global Calendar', icon: Calendar, path: '/admin/calendar', active: location.pathname === '/admin/calendar' },
            { name: 'Appointments', icon: Clock, path: '/admin/appointments', active: location.pathname === '/admin/appointments', badge: '127' },
            { name: 'Vaccinations', icon: Shield, path: '/admin/vaccinations', active: location.pathname === '/admin/vaccinations' }
          ]
        },
        {
          title: 'Content Management',
          items: [
            { name: 'Content Dashboard', icon: FileText, path: '/admin/content', active: location.pathname === '/admin/content' },
            { name: 'Articles & Education', icon: FileText, path: '/admin/content/articles', active: location.pathname === '/admin/content/articles' },
            { name: 'Wellness Plans', icon: Heart, path: '/admin/content/wellness', active: location.pathname === '/admin/content/wellness' },
            { name: 'Media Library', icon: Eye, path: '/admin/content/media', active: location.pathname === '/admin/content/media' }
          ]
        },
        {
          title: 'Communication',
          items: [
            { name: 'Announcements', icon: MessageSquare, path: '/admin/announcements', active: location.pathname === '/admin/announcements' },
            { name: 'Health Campaigns', icon: Bell, path: '/admin/campaigns', active: location.pathname === '/admin/campaigns' },
            { name: 'Communication Logs', icon: MessageSquare, path: '/admin/communication', active: location.pathname === '/admin/communication' }
          ]
        },
        {
          title: 'Healthcare Facilities',
          items: [
            { name: 'Hospitals & Clinics', icon: Hospital, path: '/admin/facilities', active: location.pathname === '/admin/facilities' },
            { name: 'Provider Assignments', icon: Users, path: '/admin/facilities/assignments', active: location.pathname === '/admin/facilities/assignments' },
            { name: 'Regional Management', icon: BarChart3, path: '/admin/regions', active: location.pathname === '/admin/regions' }
          ]
        },
        {
          title: 'Security & System',
          items: [
            { name: 'Security Dashboard', icon: Shield, path: '/admin/security', active: location.pathname === '/admin/security' },
            { name: 'Access Logs', icon: FileText, path: '/admin/security/logs', active: location.pathname === '/admin/security/logs' },
            { name: 'System Settings', icon: Settings, path: '/admin/settings', active: location.pathname === '/admin/settings' }
          ]
                  }
        ]

  return (
    <div className={`admin-sidebar ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        {sidebarOpen && (
          <div className="sidebar-header-content">
            <h1 className="sidebar-title">MommyCare</h1>
            <p className="sidebar-subtitle">Admin Dashboard</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <nav className="nav-section">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              {sidebarOpen && (
                <h3 className="nav-section-title">
                  {section.title}
                </h3>
              )}
              <div className="nav-items">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`nav-item ${item.active ? 'active' : ''}`}
                  >
                    <item.icon className="nav-item-icon" />
                    {sidebarOpen && (
                      <>
                        <span className="nav-item-text">{item.name}</span>
                        {item.badge && (
                          <span className="nav-item-badge">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      
     
    </div>
  );
};

export default AdminSidebar;
