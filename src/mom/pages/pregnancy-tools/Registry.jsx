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
    <div className="registry">
      <div className="container">
        <header className="header">
          <div className="icon">🎁</div>
          <h1>Baby Registry</h1>
          <p>Create and manage your baby registry to help friends and family know exactly what you need</p>
        </header>

        <div className="main-content">
          <div className="registry-section">
            <div className="section-header">
              <span className="registry-icon">📋</span>
              <h2>Registry Items</h2>
              <button 
                className="add-btn"
                onClick={() => setIsAddingItem(!isAddingItem)}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Add New Item Form */}
            {isAddingItem && (
              <div className="add-item-form">
                <h3>Add New Item</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="form-select"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-buttons">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{ '--priority-color': priority.color }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={addItem}>
                    <Save size={16} />
                    Add Item
                  </button>
                  <button className="cancel-btn" onClick={() => setIsAddingItem(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Registry Items List */}
            <div className="registry-items">
              <div className="items-header">
                <h3>Your Registry ({purchasedCount}/{totalCount} purchased)</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(purchasedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="items-grid">
                {registryItems.map(item => (
                  <div key={item.id} className={`registry-item ${item.purchased ? 'purchased' : ''}`}>
                    <div className="item-header">
                      <h4>{item.name}</h4>
                      <div className="item-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => startEditing(item)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-details">
                      <span className="category-badge">{item.category}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    
                    <button
                      className={`purchase-btn ${item.purchased ? 'purchased' : ''}`}
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
              <div className="edit-item-form">
                <h3>Edit Item</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="form-select"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-buttons">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{ '--priority-color': priority.color }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button className="save-btn" onClick={saveEdit}>
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="info-section">
            <div className="stats-card">
              <h3>Registry Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{totalCount}</div>
                  <div className="stat-label">Total Items</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{purchasedCount}</div>
                  <div className="stat-label">Purchased</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{totalCount - purchasedCount}</div>
                  <div className="stat-label">Remaining</div>
                </div>
              </div>
            </div>

            <div className="tips-card">
              <h3>Registry Tips</h3>
              <ul className="tips-list">
                <li>Include items in different price ranges</li>
                <li>Add both essential and nice-to-have items</li>
                <li>Consider your lifestyle and space</li>
                <li>Update regularly as your needs change</li>
                <li>Share with family and friends</li>
              </ul>
            </div>

            <div className="categories-card">
              <h3>Popular Categories</h3>
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category} className="category-item">
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