import React, { useState } from 'react';
import { Gift, Plus, Trash2, Edit3, Save } from 'lucide-react';
import './Registry.css';

const Registry = () => {
  const [registryItems, setRegistryItems] = useState([
    { id: 1, name: 'Baby Crib', category: 'Furniture', priority: 'High', purchased: false },
    { id: 2, name: 'Diapers', category: 'Essentials', priority: 'High', purchased: true },
    { id: 3, name: 'Baby Monitor', category: 'Electronics', priority: 'Medium', purchased: false },
    { id: 4, name: 'Stroller', category: 'Transportation', priority: 'High', purchased: false },
    { id: 5, name: 'Baby Clothes', category: 'Clothing', priority: 'Medium', purchased: false }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    priority: 'Medium'
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = ['Essentials', 'Furniture', 'Clothing', 'Electronics', 'Transportation', 'Toys', 'Feeding', 'Bath & Care'];

  const priorities = [
    { value: 'High', label: 'High Priority', color: '#ef4444' },
    { value: 'Medium', label: 'Medium Priority', color: '#f59e0b' },
    { value: 'Low', label: 'Low Priority', color: '#10b981' }
  ];

  const addItem = () => {
    if (!newItem.name || !newItem.category) {
      alert('Please fill in all fields');
      return;
    }

    const item = {
      id: Date.now(),
      ...newItem,
      purchased: false
    };

    setRegistryItems([...registryItems, item]);
    setNewItem({ name: '', category: '', priority: 'Medium' });
    setIsAddingItem(false);
  };

  const togglePurchased = (id) => {
    setRegistryItems(registryItems.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const deleteItem = (id) => {
    setRegistryItems(registryItems.filter(item => item.id !== id));
  };

  const startEditing = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, category: item.category, priority: item.priority });
  };

  const saveEdit = () => {
    if (!newItem.name || !newItem.category) {
      alert('Please fill in all fields');
      return;
    }

    setRegistryItems(registryItems.map(item => 
      item.id === editingItem.id ? { ...item, ...newItem } : item
    ));
    setEditingItem(null);
    setNewItem({ name: '', category: '', priority: 'Medium' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setNewItem({ name: '', category: '', priority: 'Medium' });
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#6b7280';
  };

  const purchasedCount = registryItems.filter(item => item.purchased).length;
  const totalCount = registryItems.length;

  return (
    <div className="baby-registry-main-container">
      <div className="baby-registry-content-wrapper">
        <header className="baby-registry-header-section">
          <div className="baby-registry-header-icon">🎁</div>
          <h1>Baby Registry</h1>
          <p>Create and manage your baby registry to help friends and family know exactly what you need</p>
        </header>

        <div className="baby-registry-main-content-grid">
          <div className="baby-registry-items-section">
            <div className="baby-registry-section-header">
              <span className="baby-registry-icon-emoji">📋</span>
              <h2>Registry Items</h2>
              <button 
                className="baby-registry-add-item-btn"
                onClick={() => setIsAddingItem(!isAddingItem)}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Add New Item Form */}
            {isAddingItem && (
              <div className="baby-registry-add-form-container">
                <h3>Add New Item</h3>
                <div className="baby-registry-form-row-container">
                  <div className="baby-registry-form-group-wrapper">
                    <label>Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="baby-registry-form-input-field"
                    />
                  </div>
                  <div className="baby-registry-form-group-wrapper">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="baby-registry-form-select-field"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="baby-registry-form-group-wrapper">
                  <label>Priority</label>
                  <div className="baby-registry-priority-buttons-container">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`baby-registry-priority-btn ${newItem.priority === priority.value ? 'baby-registry-priority-active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{ '--priority-color': priority.color }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="baby-registry-form-actions-container">
                  <button className="baby-registry-save-btn" onClick={addItem}>
                    <Save size={16} />
                    Add Item
                  </button>
                  <button className="baby-registry-cancel-btn" onClick={() => setIsAddingItem(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Registry Items List */}
            <div className="baby-registry-items-list-container">
              <div className="baby-registry-items-header-section">
                <h3>Your Registry ({purchasedCount}/{totalCount} purchased)</h3>
                <div className="baby-registry-progress-bar-container">
                  <div 
                    className="baby-registry-progress-fill-bar" 
                    style={{ width: `${(purchasedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="baby-registry-items-grid-layout">
                {registryItems.map(item => (
                  <div key={item.id} className={`baby-registry-item-card ${item.purchased ? 'baby-registry-item-purchased' : ''}`}>
                    <div className="baby-registry-item-header-section">
                      <h4>{item.name}</h4>
                      <div className="baby-registry-item-actions-container">
                        <button 
                          className="baby-registry-action-btn baby-registry-edit-btn"
                          onClick={() => startEditing(item)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="baby-registry-action-btn baby-registry-delete-btn"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="baby-registry-item-details-section">
                      <span className="baby-registry-category-badge">{item.category}</span>
                      <span 
                        className="baby-registry-priority-badge"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    
                    <button
                      className={`baby-registry-purchase-btn ${item.purchased ? 'baby-registry-purchase-completed' : ''}`}
                      onClick={() => togglePurchased(item.id)}
                    >
                      {item.purchased ? '✓ Purchased' : 'Mark as Purchased'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Item Form */}
            {editingItem && (
              <div className="baby-registry-edit-form-container">
                <h3>Edit Item</h3>
                <div className="baby-registry-form-row-container">
                  <div className="baby-registry-form-group-wrapper">
                    <label>Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="baby-registry-form-input-field"
                    />
                  </div>
                  <div className="baby-registry-form-group-wrapper">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="baby-registry-form-select-field"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="baby-registry-form-group-wrapper">
                  <label>Priority</label>
                  <div className="baby-registry-priority-buttons-container">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`baby-registry-priority-btn ${newItem.priority === priority.value ? 'baby-registry-priority-active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{ '--priority-color': priority.color }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="baby-registry-form-actions-container">
                  <button className="baby-registry-save-btn" onClick={saveEdit}>
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button className="baby-registry-cancel-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="baby-registry-info-sidebar">
            <div className="baby-registry-stats-card">
              <h3>Registry Statistics</h3>
              <div className="baby-registry-stats-grid-layout">
                <div className="baby-registry-stat-item-box">
                  <div className="baby-registry-stat-number">{totalCount}</div>
                  <div className="baby-registry-stat-label">Total Items</div>
                </div>
                <div className="baby-registry-stat-item-box">
                  <div className="baby-registry-stat-number">{purchasedCount}</div>
                  <div className="baby-registry-stat-label">Purchased</div>
                </div>
                <div className="baby-registry-stat-item-box">
                  <div className="baby-registry-stat-number">{totalCount - purchasedCount}</div>
                  <div className="baby-registry-stat-label">Remaining</div>
                </div>
              </div>
            </div>

            <div className="baby-registry-tips-card">
              <h3>Registry Tips</h3>
              <ul className="baby-registry-tips-list">
                <li>Include items in different price ranges</li>
                <li>Add both essential and nice-to-have items</li>
                <li>Consider your lifestyle and space</li>
                <li>Update regularly as your needs change</li>
                <li>Share with family and friends</li>
              </ul>
            </div>

            <div className="baby-registry-categories-card">
              <h3>Popular Categories</h3>
              <div className="baby-registry-categories-grid-layout">
                {categories.map(category => (
                  <div key={category} className="baby-registry-category-item-box">
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registry;