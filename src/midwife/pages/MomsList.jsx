import React, { useState } from 'react';
import { FiSearch, FiPlus, FiUser, FiCalendar, FiPhone, FiMapPin, FiEdit, FiEye, FiX } from 'react-icons/fi';
import './MomsList.css';

const MomsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMom, setSelectedMom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const moms = [
    {
      id: 1,
      name: 'Emma Wilson',
      age: 28,
      status: 'active',
      dueDate: '3/15/2024',
      week: '32 weeks',
      phone: '(555) 123-4567',
      nextVisit: '2/27/2024',
      height: '165 cm',
      weight: '68 kg',
      bloodGroup: 'A+',
      babyName: 'Lily',
      babyGender: 'Girl',
      babyWeight: '2.1 kg',
      deliveryDate: '3/12/2024'
    },
    {
      id: 2,
      name: 'Sarah Davis',
      age: 31,
      status: 'active',
      dueDate: '4/2/2024',
      week: '28 weeks',
      phone: '(555) 234-5678',
      nextVisit: '2/25/2024',
      height: '170 cm',
      weight: '72 kg',
      bloodGroup: 'O+',
      babyName: '',
      babyGender: '',
      babyWeight: '',
      deliveryDate: ''
    },
    {
      id: 3,
      name: 'Jennifer Lee',
      age: 25,
      status: 'delivered',
      dueDate: '1/20/2024',
      week: 'Delivered',
      phone: '(555) 345-6789',
      nextVisit: '2/20/2024',
      height: '162 cm',
      weight: '65 kg',
      bloodGroup: 'B+',
      babyName: 'Emma',
      babyGender: 'Girl',
      babyWeight: '3.2 kg',
      deliveryDate: '1/18/2024'
    },
    {
      id: 4,
      name: 'Maria Garcia',
      age: 29,
      status: 'active',
      dueDate: '5/10/2024',
      week: '24 weeks',
      phone: '(555) 456-7890',
      nextVisit: '3/5/2024',
      height: '168 cm',
      weight: '70 kg',
      bloodGroup: 'AB+',
      babyName: '',
      babyGender: '',
      babyWeight: '',
      deliveryDate: ''
    }
  ];

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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedMom(moms.find(m => m.id === selectedMom.id)); // Reset to original data
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'blue';
  };

  return (
    <div className="moms-list-page">
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
          </div>

          <div className="moms-list__content">
            {filteredMoms.map((mom) => (
              <div key={mom.id} className="moms-list__mom-card">
                <div className="moms-list__mom-card-avatar">
                  <FiUser size={24} />
                </div>
                <div className="moms-list__mom-card-info">
                  <div className="moms-list__mom-card-name-age">
                    <h3>{mom.name}</h3>
                    <span>{mom.age} years old</span>
                  </div>
                  <div className={`moms-list__mom-card-status moms-list__mom-card-status--${getStatusColor(mom.status)}`}>
                    {getStatusText(mom.status)}
                  </div>
                </div>
                <div className="moms-list__mom-card-details">
                  <div className="moms-list__mom-card-detail">
                    <span className="moms-list__mom-card-label">DUE DATE</span>
                    <span className="moms-list__mom-card-value">{mom.dueDate}</span>
                  </div>
                  <div className="moms-list__mom-card-detail">
                    <span className="moms-list__mom-card-label">WEEK</span>
                    <span className="moms-list__mom-card-value">{mom.week}</span>
                  </div>
                  <div className="moms-list__mom-card-detail">
                    <span className="moms-list__mom-card-label">PHONE</span>
                    <span className="moms-list__mom-card-value">{mom.phone}</span>
                  </div>
                  <div className="moms-list__mom-card-detail">
                    <span className="moms-list__mom-card-label">NEXT VISIT</span>
                    <span className="moms-list__mom-card-value">{mom.nextVisit}</span>
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
                  <button className="moms-list__mom-card-btn moms-list__mom-card-btn--contact">
                    <FiPhone size={16} />
                    Contact
                  </button>
                  <button className="moms-list__mom-card-btn moms-list__mom-card-btn--schedule">
                    <FiCalendar size={16} />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
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
        </div>
      </div>
    </div>
  );
};

export default MomsList; 