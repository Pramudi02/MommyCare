import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Check, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  Settings,
  Eye,
  Trash2,
  UserPlus,
  Lock,
  Unlock,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './RoleAccessManagement.css';

const RoleAccessManagement = () => {
  const [activeTab, setActiveTab] = useState('definitions');
  const [editingRole, setEditingRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch users data from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      // Fetch all users
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch users data');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setUsers(data.data.users);
      } else {
        throw new Error(data.message || 'Failed to fetch users data');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Dynamic role definitions based on actual user data
  const roleDefinitions = [
    {
      id: 1,
      name: 'System Admin',
      code: 'SYSTEM_ADMIN',
      description: 'Full system access with administrative privileges',
      userCount: users.filter(u => u.role === 'admin' || u.role === 'super_admin').length,
      isSystemRole: true,
      permissions: ['all_access', 'user_management', 'system_config', 'security_management']
    },
    {
      id: 2,
      name: 'Doctor',
      code: 'DOCTOR',
      description: 'Medical doctor with patient management access',
      userCount: users.filter(u => u.role === 'doctor').length,
      isSystemRole: true,
      permissions: ['patient_management', 'medical_records', 'appointments', 'ai_predictions']
    },
    {
      id: 3,
      name: 'Midwife',
      code: 'MIDWIFE',
      description: 'Midwife with limited patient care access',
      userCount: users.filter(u => u.role === 'midwife').length,
      isSystemRole: true,
      permissions: ['basic_patient_care', 'vaccinations', 'appointments', 'educational_content']
    },
    {
      id: 4,
      name: 'Mother',
      code: 'MOTHER',
      description: 'Pregnant mother with limited access to personal data',
      userCount: users.filter(u => u.role === 'mom').length,
      isSystemRole: true,
      permissions: ['personal_data', 'appointments', 'educational_content', 'ai_predictions']
    },
    {
      id: 5,
      name: 'Service Provider',
      code: 'SERVICE_PROVIDER',
      description: 'External service provider with limited access',
      userCount: users.filter(u => u.role === 'service_provider').length,
      isSystemRole: true,
      permissions: ['service_management', 'basic_reports', 'customer_data']
    }
  ];

  // Sample permissions data (this could be fetched from backend in future)
  const allPermissions = [
    { id: 'all_access', name: 'Full System Access', category: 'System', critical: true },
    { id: 'user_management', name: 'User Management', category: 'Administration' },
    { id: 'system_config', name: 'System Configuration', category: 'System', critical: true },
    { id: 'security_management', name: 'Security Management', category: 'Security', critical: true },
    { id: 'patient_management', name: 'Patient Management', category: 'Healthcare' },
    { id: 'medical_records', name: 'Medical Records Access', category: 'Healthcare' },
    { id: 'appointments', name: 'Appointment Management', category: 'Healthcare' },
    { id: 'ai_predictions', name: 'AI Predictions Access', category: 'AI/ML' },
    { id: 'basic_patient_care', name: 'Basic Patient Care', category: 'Healthcare' },
    { id: 'vaccinations', name: 'Vaccination Management', category: 'Healthcare' },
    { id: 'educational_content', name: 'Educational Content', category: 'Content' },
    { id: 'personal_data', name: 'Personal Data Access', category: 'User' },
    { id: 'service_management', name: 'Service Management', category: 'Business' },
    { id: 'basic_reports', name: 'Basic Reports', category: 'Analytics' },
    { id: 'customer_data', name: 'Customer Data Access', category: 'Business' }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`tab-button ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  const RoleCard = ({ role }) => (
    <div className="role-card">
      <div className="role-header">
        <div className="role-info">
          <div className="role-title-section">
            <h3 className="role-title">{role.name}</h3>
            {role.isSystemRole && (
              <span className="system-role-badge">System Role</span>
            )}
          </div>
          <p className="role-description">{role.description}</p>
          <div className="role-stats">
            <span className="role-stat">
              <Users className="stat-icon" />
              {role.userCount} users
            </span>
            <span className="role-stat">
              <Shield className="stat-icon" />
              {role.permissions.length} permissions
            </span>
          </div>
        </div>
        <div className="role-actions">
          <button className="action-btn edit">
            <Edit className="action-icon" />
          </button>
          <button className="action-btn more">
            <MoreHorizontal className="action-icon" />
          </button>
        </div>
      </div>
    </div>
  );

  const PermissionMatrix = () => {
    const categories = [...new Set(allPermissions.map(p => p.category))];
    
    return (
      <div className="matrix-container">
        <div className="matrix-header">
          <h3 className="matrix-title">Access Control Matrix</h3>
          <p className="matrix-description">Manage permissions for each role</p>
        </div>
        <div className="matrix-table-container">
          <table className="matrix-table">
            <thead className="matrix-thead">
              <tr>
                <th className="permission-header">Permission</th>
                {roleDefinitions.map(role => (
                  <th key={role.id} className="role-header">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="matrix-tbody">
              {categories.map(category => (
                <React.Fragment key={category}>
                  <tr className="category-row">
                    <td colSpan={roleDefinitions.length + 1} className="category-cell">
                      {category}
                    </td>
                  </tr>
                  {allPermissions.filter(p => p.category === category).map(permission => (
                    <tr key={permission.id} className="permission-row">
                      <td className="permission-cell">
                        <div className="permission-info">
                          <span className="permission-name">{permission.name}</span>
                          {permission.critical && (
                            <AlertTriangle className="critical-icon" />
                          )}
                        </div>
                      </td>
                      {roleDefinitions.map(role => (
                        <td key={role.id} className="checkbox-cell">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={role.permissions.includes(permission.id)}
                              onChange={() => {}}
                              className="permission-checkbox"
                              disabled={permission.critical && role.code !== 'SYSTEM_ADMIN'}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="matrix-footer">
          <div className="matrix-footer-left">
            <div className="critical-notice">
              <AlertTriangle className="critical-icon" />
              <span className="critical-text">Critical permissions require System Admin role</span>
            </div>
          </div>
          <div className="matrix-footer-right">
            <button className="reset-btn">Reset Changes</button>
            <button className="save-btn">
              <Save className="save-icon" />
              Save Matrix
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UserAssignmentTable = () => (
    <div className="assignment-container">
      <div className="assignment-header">
        <div className="assignment-header-left">
          <h3 className="assignment-title">User Role Assignment</h3>
          <p className="assignment-description">Manage user roles and permissions</p>
        </div>
        <div className="assignment-header-right">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="bulk-assign-btn">
            <UserPlus className="bulk-assign-icon" />
            Bulk Assign
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="assignment-table">
          <thead className="table-thead">
            <tr>
              <th className="checkbox-header">
                <input type="checkbox" className="select-all-checkbox" />
              </th>
              <th className="user-header">User</th>
              <th className="role-header">Current Role</th>
              <th className="login-header">Last Login</th>
              <th className="status-header">Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="user-row">
                  <td className="checkbox-cell">
                    <input type="checkbox" className="user-checkbox" />
                  </td>
                  <td className="user-cell">
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </td>
                  <td className="role-cell">
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td className="login-cell">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${user.status === 'Active' ? 'active' : 'inactive'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-controls">
                      <select className="role-select">
                        <option>Change Role</option>
                        {roleDefinitions.map(role => (
                          <option key={role.id} value={role.code}>{role.name}</option>
                        ))}
                      </select>
                      <a href={`/admin/users/${user.id}`} className="edit-user-btn">
                        <Edit className="edit-icon" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  <div className="empty-content">
                    <Users className="empty-icon" />
                    <h3>No users found</h3>
                    <p>Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <div className="footer-left">
          <span className="footer-text">Showing {filteredUsers.length} of {users.length} users</span>
        </div>
        <div className="footer-right">
          <button className="export-btn">
            <Download className="export-icon" />
            Export
          </button>
          <button className="apply-btn">Apply Changes</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <main className="dashboard-main">
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <p>Loading role and access management data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-main">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchUsers} className="retry-btn">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Calculate total stats
  const totalStats = {
    totalRoles: roleDefinitions.length,
    totalUsers: users.length,
    totalPermissions: allPermissions.length,
    customRoles: 0
  };

  return (
    <main className="dashboard-main">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">Role & Access Management</h1>
            <p className="page-description">Configure user roles, permissions, and access control</p>
          </div>
          <div className="header-actions">
            <button className="export-roles-btn">
              <Download className="export-icon" />
              Export Roles
            </button>
            <button className="create-role-btn">
              <Plus className="create-icon" />
              Create Role
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <nav className="tab-nav">
          <TabButton
            id="definitions"
            label="Role Definitions"
            isActive={activeTab === 'definitions'}
            onClick={setActiveTab}
          />
          <TabButton
            id="matrix"
            label="Access Control Matrix"
            isActive={activeTab === 'matrix'}
            onClick={setActiveTab}
          />
          <TabButton
            id="assignments"
            label="User Role Assignment"
            isActive={activeTab === 'assignments'}
            onClick={setActiveTab}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'definitions' && (
          <div className="definitions-content">
            {/* Summary Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <Shield className="stat-icon blue" />
                  <div className="stat-info">
                    <p className="stat-label">Total Roles</p>
                    <p className="stat-value">{totalStats.totalRoles}</p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <Users className="stat-icon green" />
                  <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">{totalStats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <Lock className="stat-icon orange" />
                  <div className="stat-info">
                    <p className="stat-label">Permissions</p>
                    <p className="stat-value">{totalStats.totalPermissions}</p>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <Settings className="stat-icon purple" />
                  <div className="stat-info">
                    <p className="stat-label">Custom Roles</p>
                    <p className="stat-value">{totalStats.customRoles}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Cards */}
            <div className="roles-grid">
              {roleDefinitions.map(role => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matrix' && <PermissionMatrix />}

        {activeTab === 'assignments' && <UserAssignmentTable />}
      </div>
    </main>
  );
};

export default RoleAccessManagement; 