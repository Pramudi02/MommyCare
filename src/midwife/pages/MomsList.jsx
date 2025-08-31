import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiUser, FiCalendar, FiPhone, FiMapPin, FiEdit, FiEye, FiX, FiMessageCircle, FiBarChart2, FiBell, FiFileText, FiUserPlus, FiCheckCircle } from 'react-icons/fi';
import { midwifeAPI } from '../../services/api';
import './MomsList.css';

const MomsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMom, setSelectedMom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Add mom modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [assignNotes, setAssignNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification state
  const [notification, setNotification] = useState(null);

  // Real data state
  const [moms, setMoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load moms assigned to this midwife
  const fetchMoms = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await midwifeAPI.getMomProfiles(search);
      if (response.status === 'success') {
        setMoms(response.data);
      } else {
        setError('Failed to fetch moms');
      }
    } catch (err) {
      console.error('Error fetching moms:', err);
      setError('Failed to fetch moms');
    } finally {
      setLoading(false);
    }
  };

  // Load moms on component mount
  useEffect(() => {
    fetchMoms();
  }, []);

  const filteredMoms = moms.filter(mom => {
    const matchesSearch = mom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mom.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || mom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (mom) => {
    setSelectedMom(mom);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedMom) return;
    
    try {
      // Here you would typically save the changes to your backend
      // For now, we'll just close the editing mode
      setIsEditing(false);
      // Refresh the moms list
      await fetchMoms();
    } catch (err) {
      console.error('Error saving changes:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data by finding the mom again
    const originalMom = moms.find(m => m._id === selectedMom._id);
    if (originalMom) {
      setSelectedMom(originalMom);
    }
  };

  const getStatusText = (status) => {
    if (status === 'delivered') return 'Delivered';
    if (status === 'active') return 'Active';
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    if (status === 'delivered') return 'blue';
    return 'green';
  };

  // Calculate pregnancy week based on LMP and EDD
  const calculatePregnancyWeek = (lmp, edd) => {
    if (!lmp) return 'Unknown';
    
    const today = new Date();
    const lmpDate = new Date(lmp);
    const weeksDiff = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24 * 7));
    
    if (weeksDiff < 0) return 'Pre-pregnancy';
    if (weeksDiff > 42) return 'Delivered';
    
    return `${weeksDiff} weeks`;
  };

  // Search for moms to assign
  const searchMomsToAssign = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      console.log('🔍 Searching for moms with query:', query);
      
      // Add a small delay to prevent too many API calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await midwifeAPI.searchMoms(query);
      console.log('📡 Search API response:', response);
      
      if (response.status === 'success') {
        const results = response.data || [];
        console.log('✅ Search results:', results);
        setSearchResults(results);
      } else {
        console.log('❌ Search failed:', response.message);
        setSearchResults([]);
      }
    } catch (err) {
      console.error('💥 Search error:', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  // Assign mom to midwife
  const assignMom = async (momId) => {
    try {
      console.log('🔄 Assigning mom with ID:', momId);
      console.log('📝 Assignment notes:', assignNotes);
      
      const response = await midwifeAPI.assignMom(momId, assignNotes);
      console.log('📡 Assign response:', response);
      
      if (response.status === 'success') {
        console.log('✅ Mom assigned successfully!');
        // Show success notification instead of alert
        showNotification('Mom assigned successfully!', 'success');
        setShowAddModal(false);
        setAssignNotes('');
        setSearchResults([]);
        setSearchQuery('');
        // Refresh the moms list
        await fetchMoms();
      } else {
        console.log('❌ Assignment failed:', response.message);
        showNotification(`Assignment failed: ${response.message}`, 'error');
      }
    } catch (err) {
      console.error('💥 Error assigning mom:', err);
      showNotification('Error assigning mom. Please try again.', 'error');
    }
  };

  // Stats for the sidebar
  const stats = {
    totalMoms: moms.length,
    activePregnancies: moms.filter(mom => mom.status !== 'delivered').length,
    delivered: moms.filter(mom => mom.status === 'delivered').length,
    upcomingThisWeek: moms.filter(mom => {
      if (!mom.nextClinicDate) return false;
      const nextDate = new Date(mom.nextClinicDate);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextDate >= today && nextDate <= weekFromNow;
    }).length
  };

  if (loading) {
    return (
      <div className="moms-list-page">
        <div className="moms-list-container">
          <div className="moms-list-content">
            <div className="moms-list__loading">Loading moms...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="moms-list-page">
      {/* Notification Component */}
      {notification && (
        <div className={`moms-list__notification moms-list__notification--${notification.type}`}>
          <div className="moms-list__notification-content">
            {notification.type === 'success' && <FiCheckCircle size={20} />}
            <span>{notification.message}</span>
          </div>
          <button 
            className="moms-list__notification-close"
            onClick={() => setNotification(null)}
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <div className="moms-list-container">
        <div className="moms-list-content">
          <div className="moms-list__header">
            <div className="moms-list__header-icon">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="moms-list__title">
              <h1>Moms Management</h1>
              <p>Manage and track all your pregnant moms</p>
            </div>
          </div>

          {error && (
            <div className="moms-list__error">
              <p>{error}</p>
            </div>
          )}

          <div className="moms-list__filters">
            <div className="moms-list__search">
              <FiSearch size={18} />
              <input
                type="text"
                placeholder="Search moms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="moms-list__status-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="delivered">Delivered</option>
            </select>
            <button 
              className="moms-list__add-btn"
              onClick={() => setShowAddModal(true)}
            >
              <FiUserPlus size={18} />
              Add New Mom
            </button>
          </div>

          <div className="moms-list__main-content">
            <div className="moms-list__content">
              {filteredMoms.length === 0 ? (
                <div className="moms-list__no-moms">
                  <p>No moms found. {searchTerm ? 'Try adjusting your search terms.' : 'Add your first mom to get started.'}</p>
                </div>
              ) : (
                filteredMoms.map((mom) => (
                  <div key={mom._id} className="moms-list__mom-card">
                    <div className="moms-list__mom-card-avatar">
                      <FiUser size={24} />
                    </div>
                    <div className="moms-list__mom-card-info">
                      <div className="moms-list__mom-card-name-age">
                        <h3>{mom.name}</h3>
                        <span>{mom.age} years old</span>
                      </div>
                      <div className={`moms-list__mom-card-status moms-list__mom-card-status--${getStatusColor(mom.status || 'active')}`}>
                        {getStatusText(mom.status || 'active')}
                      </div>
                    </div>
                    <div className="moms-list__mom-card-details">
                      <div className="moms-list__mom-card-detail">
                        <span className="moms-list__mom-card-label">USER ID</span>
                        <span className="moms-list__mom-card-value moms-list__mom-card-userid">
                          {mom._id}
                        </span>
                      </div>
                      <div className="moms-list__mom-card-detail">
                        <span className="moms-list__mom-card-label">DUE DATE</span>
                        <span className="moms-list__mom-card-value">
                          {mom.edd ? new Date(mom.edd).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      <div className="moms-list__mom-card-detail">
                        <span className="moms-list__mom-card-label">
                          {mom.status === 'delivered' ? 'BABY NAME' : 'WEEK'}
                        </span>
                        <span className="moms-list__mom-card-value">
                          {mom.status === 'delivered' ? 
                            (mom.babyName || 'Not set') : 
                            (mom.lmp ? calculatePregnancyWeek(mom.lmp, mom.edd) : 'Not set')
                          }
                        </span>
                      </div>
                      <div className="moms-list__mom-card-detail">
                        <span className="moms-list__mom-card-label">PHONE</span>
                        <span className="moms-list__mom-card-value">{mom.phone}</span>
                      </div>
                      <div className="moms-list__mom-card-detail">
                        <span className="moms-list__mom-card-label">
                          {mom.status === 'delivered' ? 'DELIVERY DATE' : 'NEXT VISIT'}
                        </span>
                        <span className="moms-list__mom-card-value">
                          {mom.status === 'delivered' ? 
                            (mom.deliveryDate || 'Not set') : 
                            (mom.nextClinicDate ? new Date(mom.nextClinicDate).toLocaleDateString() : 'Not set')
                          }
                        </span>
                      </div>
                    </div>
                    <div className="moms-list__mom-card-actions">
                      <button 
                        className="moms-list__mom-card-btn moms-list__mom-card-btn--view"
                        onClick={() => handleViewDetails(mom)}
                      >
                        <FiEye size={16} />
                        View Details
                      </button>
                      <button className="moms-list__mom-card-btn moms-list__mom-card-btn--chat">
                        <FiMessageCircle size={16} />
                        Chat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="moms-list__sidebar">
              <div className="moms-list__sidebar-section">
                <h3>Quick Stats</h3>
                <div className="moms-list__stats-grid">
                  <div className="moms-list__stat-card">
                    <div className="moms-list__stat-icon moms-list__stat-icon--blue">
                      <FiUser size={20} />
                    </div>
                    <div className="moms-list__stat-content">
                      <div className="moms-list__stat-value">{stats.totalMoms}</div>
                      <div className="moms-list__stat-label">Total Moms</div>
                    </div>
                  </div>
                  <div className="moms-list__stat-card">
                    <div className="moms-list__stat-icon moms-list__stat-icon--green">
                      <FiUser size={20} />
                    </div>
                    <div className="moms-list__stat-content">
                      <div className="moms-list__stat-value">{stats.activePregnancies}</div>
                      <div className="moms-list__stat-label">Active Pregnancies</div>
                    </div>
                  </div>
                  <div className="moms-list__stat-card">
                    <div className="moms-list__stat-icon moms-list__stat-icon--purple">
                      <FiUser size={20} />
                    </div>
                    <div className="moms-list__stat-content">
                      <div className="moms-list__stat-value">{stats.delivered}</div>
                      <div className="moms-list__stat-label">Delivered</div>
                    </div>
                  </div>
                  <div className="moms-list__stat-card">
                    <div className="moms-list__stat-icon moms-list__stat-icon--orange">
                      <FiCalendar size={20} />
                    </div>
                    <div className="moms-list__stat-content">
                      <div className="moms-list__stat-value">{stats.upcomingThisWeek}</div>
                      <div className="moms-list__stat-label">Upcoming This Week</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="moms-list__sidebar-section">
                <h3>Recent Activity</h3>
                <div className="moms-list__activity-list">
                  {moms.length === 0 ? (
                    <div className="moms-list__no-activity">
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    moms.slice(0, 3).map((mom) => (
                      <div key={mom._id} className="moms-list__activity-item">
                        <div className="moms-list__activity-icon">
                          <FiUser size={14} />
                        </div>
                        <div className="moms-list__activity-content">
                          <p>{mom.name} - Profile updated</p>
                          <span>Recently</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && selectedMom && (
            <div className="moms-list__modal-overlay" onClick={() => setIsModalOpen(false)}>
              <div className="moms-list__modal" onClick={(e) => e.stopPropagation()}>
                <div className="moms-list__modal-header">
                  <h2>{selectedMom.name}'s Details</h2>
                  <button 
                    className="moms-list__modal-close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="moms-list__modal-content">
                  <div className="moms-list__modal-section">
                    <h3>Personal Information</h3>
                    <div className="moms-list__modal-grid">
                      <div className="moms-list__modal-field">
                        <label>Height</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            defaultValue={selectedMom.height}
                            className="moms-list__modal-input"
                          />
                        ) : (
                          <span>{selectedMom.height}</span>
                        )}
                      </div>
                      <div className="moms-list__modal-field">
                        <label>Weight</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            defaultValue={selectedMom.weight}
                            className="moms-list__modal-input"
                          />
                        ) : (
                          <span>{selectedMom.weight}</span>
                        )}
                      </div>
                      <div className="moms-list__modal-field">
                        <label>Blood Group</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            defaultValue={selectedMom.bloodGroup}
                            className="moms-list__modal-input"
                          />
                        ) : (
                          <span>{selectedMom.bloodGroup}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedMom.babyName && (
                    <div className="moms-list__modal-section">
                      <h3>Baby Information</h3>
                      <div className="moms-list__modal-grid">
                        <div className="moms-list__modal-field">
                          <label>Baby Name</label>
                          {isEditing ? (
                            <input 
                              type="text" 
                              defaultValue={selectedMom.babyName}
                              className="moms-list__modal-input"
                            />
                          ) : (
                            <span>{selectedMom.babyName}</span>
                          )}
                        </div>
                        <div className="moms-list__modal-field">
                          <label>Gender</label>
                          {isEditing ? (
                            <select defaultValue={selectedMom.babyGender} className="moms-list__modal-input">
                              <option value="Boy">Boy</option>
                              <option value="Girl">Girl</option>
                            </select>
                          ) : (
                            <span>{selectedMom.babyGender}</span>
                          )}
                        </div>
                        <div className="moms-list__modal-field">
                          <label>Weight</label>
                          {isEditing ? (
                            <input 
                              type="text" 
                              defaultValue={selectedMom.babyWeight}
                              className="moms-list__modal-input"
                            />
                          ) : (
                            <span>{selectedMom.babyWeight}</span>
                          )}
                        </div>
                        <div className="moms-list__modal-field">
                          <label>Delivery Date</label>
                          {isEditing ? (
                            <input 
                              type="date" 
                              defaultValue={selectedMom.deliveryDate}
                              className="moms-list__modal-input"
                            />
                          ) : (
                            <span>{selectedMom.deliveryDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="moms-list__modal-actions">
                  {isEditing ? (
                    <>
                      <button className="moms-list__modal-btn moms-list__modal-btn--save" onClick={handleSave}>
                        Save Changes
                      </button>
                      <button className="moms-list__modal-btn moms-list__modal-btn--cancel" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="moms-list__modal-btn moms-list__modal-btn--edit" onClick={handleEdit}>
                      <FiEdit size={16} />
                      Edit Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add Mom Modal */}
          {showAddModal && (
            <div className="moms-list__modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="moms-list__modal" onClick={(e) => e.stopPropagation()}>
                <div className="moms-list__modal-header">
                  <h2>Add New Mom to Your List</h2>
                  <button 
                    className="moms-list__modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="moms-list__modal-content">
                  <div className="moms-list__modal-section">
                    <h3>Search for Mom</h3>
                    <div className="moms-list__search-container">
                      <input
                        type="text"
                        placeholder="Enter mom's name or phone number..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchMomsToAssign(e.target.value);
                        }}
                        className="moms-list__modal-input"
                      />
                      <FiSearch size={18} className="moms-list__search-icon" />
                    </div>
                    
                    {searching && <div className="moms-list__loading">Searching...</div>}
                    
                    {searchResults.length > 0 && (
                      <div className="moms-list__search-results">
                        <h4>Search Results</h4>
                        {searchResults.map((mom) => (
                          <div key={mom._id} className="moms-list__search-result-item">
                            <div className="moms-list__result-info">
                              <h5>{mom.name}</h5>
                                                             <div className="moms-list__result-details">
                                 <div className="moms-list__result-detail">
                                   <strong>User ID:</strong> {mom._id}
                                 </div>
                                 <div className="moms-list__result-detail">
                                   <strong>Address:</strong> {mom.phmArea || 'Not set'}
                                 </div>
                                 <div className="moms-list__result-detail">
                                   <strong>Age:</strong> {mom.age || 'Not set'}
                                 </div>
                               </div>
                            </div>
                            <button 
                              className="moms-list__assign-btn"
                              onClick={() => assignMom(mom._id)}
                            >
                              Assign
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.length === 0 && !searching && searchQuery.length >= 2 && (
                      <div className="moms-list__no-results">
                        <p>No moms found. Try searching with a different name or phone number.</p>
                      </div>
                    )}
                  </div>

                  <div className="moms-list__modal-section">
                    <h3>Assignment Notes (Optional)</h3>
                    <textarea 
                      className="moms-list__modal-textarea"
                      rows="3"
                      placeholder="Enter any notes about this assignment..."
                      value={assignNotes}
                      onChange={(e) => setAssignNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="moms-list__modal-actions">
                  <button className="moms-list__modal-btn moms-list__modal-btn--cancel" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomsList; 