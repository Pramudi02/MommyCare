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
    <div className="modern-registry-container">
      <header className="modern-registry-header">
        <div className="modern-registry-header-icon">🎁</div>
        <h1 className="modern-registry-title">Baby Registry</h1>
      </header>

      <div className="modern-registry-main-layout">
        <div className="modern-registry-items-section">
          <div className="modern-registry-section-header">
            <h2 className="modern-registry-section-title">Registry Items</h2>
            <button 
              className="modern-registry-add-btn"
              onClick={() => setIsAddingItem(!isAddingItem)}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {/* Add New Item Form */}
          {isAddingItem && (
            <div className="modern-registry-form-card">
              <h3 className="modern-registry-form-title">Add New Item</h3>
              <div className="modern-registry-form-row">
                <div className="modern-registry-form-group">
                  <label className="modern-registry-form-label">Item Name</label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="modern-registry-form-input"
                  />
                </div>
                <div className="modern-registry-form-group">
                  <label className="modern-registry-form-label">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="modern-registry-form-select"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modern-registry-form-group">
                <label className="modern-registry-form-label">Priority</label>
                <div className="modern-registry-priority-buttons">
                  {priorities.map(priority => (
                    <button
                      key={priority.value}
                      className={`modern-registry-priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                      onClick={() => setNewItem({...newItem, priority: priority.value})}
                      style={{ '--priority-color': priority.color }}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modern-registry-form-actions">
                <button className="modern-registry-save-btn" onClick={addItem}>
                  <Save size={16} />
                  Add Item
                </button>
                <button className="modern-registry-cancel-btn" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="modern-registry-progress-section">
            <h3 className="modern-registry-progress-title">
              Your Registry ({purchasedCount}/{totalCount} purchased)
            </h3>
            <div className="modern-registry-progress-bar">
              <div 
                className="modern-registry-progress-fill" 
                style={{ width: `${totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Registry Items List */}
          <div className="modern-registry-items-list">
            {registryItems.map(item => (
              <div 
                key={item.id} 
                className={`modern-registry-item-card ${item.purchased ? 'purchased' : ''}`}
                style={{ '--priority-color': getPriorityColor(item.priority) }}
              >
                <div className="modern-registry-item-header">
                  <h4 className="modern-registry-item-title">{item.name}</h4>
                  <div className="modern-registry-item-actions">
                    <button 
                      className="modern-registry-action-btn modern-registry-edit-btn"
                      onClick={() => startEditing(item)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      className="modern-registry-action-btn modern-registry-delete-btn"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="modern-registry-item-details">
                  <span className="modern-registry-category-badge">{item.category}</span>
                  <span 
                    className="modern-registry-priority-badge"
                    style={{ background: getPriorityColor(item.priority) }}
                  >
                    {item.priority}
                  </span>
                </div>
                
                <button
                  className={`modern-registry-purchase-btn ${item.purchased ? 'completed' : ''}`}
                  onClick={() => togglePurchased(item.id)}
                >
                  {item.purchased ? '✓ Purchased' : 'Mark as Purchased'}
                </button>
              </div>
            ))}
          </div>

          {/* Edit Item Form */}
          {editingItem && (
            <div className="modern-registry-form-card">
              <h3 className="modern-registry-form-title">Edit Item</h3>
              <div className="modern-registry-form-row">
                <div className="modern-registry-form-group">
                  <label className="modern-registry-form-label">Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="modern-registry-form-input"
                  />
                </div>
                <div className="modern-registry-form-group">
                  <label className="modern-registry-form-label">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="modern-registry-form-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modern-registry-form-group">
                <label className="modern-registry-form-label">Priority</label>
                <div className="modern-registry-priority-buttons">
                  {priorities.map(priority => (
                    <button
                      key={priority.value}
                      className={`modern-registry-priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                      onClick={() => setNewItem({...newItem, priority: priority.value})}
                      style={{ '--priority-color': priority.color }}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modern-registry-form-actions">
                <button className="modern-registry-save-btn" onClick={saveEdit}>
                  <Save size={16} />
                  Save Changes
                </button>
                <button className="modern-registry-cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modern-registry-sidebar">
          <div className="modern-registry-sidebar-card">
            <h3 className="modern-registry-sidebar-title">Registry Statistics</h3>
            <div className="modern-registry-stats-grid">
              <div className="modern-registry-stat-item">
                <div className="modern-registry-stat-number">{totalCount}</div>
                <div className="modern-registry-stat-label">Total Items</div>
              </div>
              <div className="modern-registry-stat-item">
                <div className="modern-registry-stat-number">{purchasedCount}</div>
                <div className="modern-registry-stat-label">Purchased</div>
              </div>
              <div className="modern-registry-stat-item">
                <div className="modern-registry-stat-number">{totalCount - purchasedCount}</div>
                <div className="modern-registry-stat-label">Remaining</div>
              </div>
            </div>
          </div>

          <div className="modern-registry-sidebar-card">
            <h3 className="modern-registry-sidebar-title">Registry Tips</h3>
            <ul className="modern-registry-tips-list">
              <li>Include items in different price ranges</li>
              <li>Add both essential and nice-to-have items</li>
              <li>Consider your lifestyle and space</li>
              <li>Update regularly as your needs change</li>
              <li>Share with family and friends</li>
            </ul>
          </div>

          <div className="modern-registry-sidebar-card">
            <h3 className="modern-registry-sidebar-title">Popular Categories</h3>
            <div className="modern-registry-categories-grid">
              {categories.map(category => (
                <div key={category} className="modern-registry-category-item">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registry;