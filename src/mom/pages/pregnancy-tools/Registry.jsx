import React, { useState } from 'react';
import { Gift, Plus, Trash2, Edit3, Save } from 'lucide-react';

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
    <div style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      lineHeight: 1.6,
      minHeight: '100vh'
    }}>
      <div className="baby-registry-unique-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        minHeight: '100vh'
      }}>
        <header className="baby-registry-unique-header" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          padding: '20px 0',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div className="baby-registry-unique-header-icon" style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white'
          }}>🎁</div>
          <h1 className="baby-registry-unique-title" style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#1e293b',
            margin: 0
          }}>Baby Registry</h1>
        </header>

        <div className="baby-registry-unique-main-layout" style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 320px' : '1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          <div className="baby-registry-unique-items-section" style={{
            background: '#ffffff'
          }}>
            <div className="baby-registry-unique-section-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 className="baby-registry-unique-section-title" style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1e293b',
                margin: 0
              }}>Registry Items</h2>
              <button 
                className="baby-registry-unique-add-btn"
                onClick={() => setIsAddingItem(!isAddingItem)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px'
                }}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Add New Item Form */}
            {isAddingItem && (
              <div className="baby-registry-unique-form-card" style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 className="baby-registry-unique-form-title" style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '20px'
                }}>Add New Item</h3>
                <div className="baby-registry-unique-form-row" style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div className="baby-registry-unique-form-group" style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <label className="baby-registry-unique-form-label" style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>Item Name</label>
                    <input
                      type="text"
                      placeholder="Enter item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="baby-registry-unique-form-input"
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: '#ffffff'
                      }}
                    />
                  </div>
                  <div className="baby-registry-unique-form-group" style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <label className="baby-registry-unique-form-label" style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="baby-registry-unique-form-select"
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: '#ffffff'
                      }}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="baby-registry-unique-form-group" style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <label className="baby-registry-unique-form-label" style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px'
                  }}>Priority</label>
                  <div className="baby-registry-unique-priority-buttons" style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`baby-registry-unique-priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{
                          padding: '8px 14px',
                          border: `1px solid ${newItem.priority === priority.value ? priority.color : '#d1d5db'}`,
                          borderRadius: '6px',
                          background: newItem.priority === priority.value ? priority.color : '#ffffff',
                          color: newItem.priority === priority.value ? 'white' : '#6b7280',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="baby-registry-unique-form-actions" style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button 
                    className="baby-registry-unique-save-btn" 
                    onClick={addItem}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                  >
                    <Save size={16} />
                    Add Item
                  </button>
                  <button 
                    className="baby-registry-unique-cancel-btn" 
                    onClick={() => setIsAddingItem(false)}
                    style={{
                      padding: '10px 16px',
                      background: '#ffffff',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Progress Section */}
            <div className="baby-registry-unique-progress-section" style={{
              marginBottom: '24px'
            }}>
              <h3 className="baby-registry-unique-progress-title" style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Your Registry ({purchasedCount}/{totalCount} purchased)
              </h3>
              <div className="baby-registry-unique-progress-bar" style={{
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div 
                  className="baby-registry-unique-progress-fill" 
                  style={{ 
                    width: `${totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
            </div>

            {/* Registry Items List */}
            <div className="baby-registry-unique-items-list" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {registryItems.map(item => (
                <div 
                  key={item.id} 
                  className={`baby-registry-unique-item-card ${item.purchased ? 'purchased' : ''}`}
                  style={{
                    background: item.purchased ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    borderLeft: `4px solid ${getPriorityColor(item.priority)}`,
                    opacity: item.purchased ? 0.6 : 1
                  }}
                >
                  <div className="baby-registry-unique-item-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h4 className="baby-registry-unique-item-title" style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1e293b',
                      margin: 0
                    }}>{item.name}</h4>
                    <div className="baby-registry-unique-item-actions" style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button 
                        className="baby-registry-unique-action-btn baby-registry-unique-edit-btn"
                        onClick={() => startEditing(item)}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: 'transparent',
                          color: '#6b7280'
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="baby-registry-unique-action-btn baby-registry-unique-delete-btn"
                        onClick={() => deleteItem(item.id)}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: 'transparent',
                          color: '#6b7280'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="baby-registry-unique-item-details" style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <span className="baby-registry-unique-category-badge" style={{
                      padding: '4px 10px',
                      background: '#f1f5f9',
                      color: '#475569',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>{item.category}</span>
                    <span 
                      className="baby-registry-unique-priority-badge"
                      style={{
                        padding: '4px 10px',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: getPriorityColor(item.priority)
                      }}
                    >
                      {item.priority}
                    </span>
                  </div>
                  
                  <button
                    className={`baby-registry-unique-purchase-btn ${item.purchased ? 'completed' : ''}`}
                    onClick={() => togglePurchased(item.id)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: `1px solid ${item.purchased ? '#10b981' : '#d1d5db'}`,
                      borderRadius: '8px',
                      background: item.purchased ? '#10b981' : '#ffffff',
                      color: item.purchased ? 'white' : '#374151',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                  >
                    {item.purchased ? '✓ Purchased' : 'Mark as Purchased'}
                  </button>
                </div>
              ))}
            </div>

            {/* Edit Item Form */}
            {editingItem && (
              <div className="baby-registry-unique-form-card" style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 className="baby-registry-unique-form-title" style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '20px'
                }}>Edit Item</h3>
                <div className="baby-registry-unique-form-row" style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div className="baby-registry-unique-form-group" style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <label className="baby-registry-unique-form-label" style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      className="baby-registry-unique-form-input"
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: '#ffffff'
                      }}
                    />
                  </div>
                  <div className="baby-registry-unique-form-group" style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <label className="baby-registry-unique-form-label" style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px'
                    }}>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="baby-registry-unique-form-select"
                      style={{
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        background: '#ffffff'
                      }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="baby-registry-unique-form-group" style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <label className="baby-registry-unique-form-label" style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px'
                  }}>Priority</label>
                  <div className="baby-registry-unique-priority-buttons" style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        className={`baby-registry-unique-priority-btn ${newItem.priority === priority.value ? 'active' : ''}`}
                        onClick={() => setNewItem({...newItem, priority: priority.value})}
                        style={{
                          padding: '8px 14px',
                          border: `1px solid ${newItem.priority === priority.value ? priority.color : '#d1d5db'}`,
                          borderRadius: '6px',
                          background: newItem.priority === priority.value ? priority.color : '#ffffff',
                          color: newItem.priority === priority.value ? 'white' : '#6b7280',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="baby-registry-unique-form-actions" style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px'
                }}>
                  <button 
                    className="baby-registry-unique-save-btn" 
                    onClick={saveEdit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                  <button 
                    className="baby-registry-unique-cancel-btn" 
                    onClick={cancelEdit}
                    style={{
                      padding: '10px 16px',
                      background: '#ffffff',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="baby-registry-unique-sidebar" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div className="baby-registry-unique-sidebar-card" style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="baby-registry-unique-sidebar-title" style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '16px'
              }}>Registry Statistics</h3>
              <div className="baby-registry-unique-stats-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <div className="baby-registry-unique-stat-item" style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div className="baby-registry-unique-stat-number" style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>{totalCount}</div>
                  <div className="baby-registry-unique-stat-label" style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 500
                  }}>Total Items</div>
                </div>
                <div className="baby-registry-unique-stat-item" style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div className="baby-registry-unique-stat-number" style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>{purchasedCount}</div>
                  <div className="baby-registry-unique-stat-label" style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 500
                  }}>Purchased</div>
                </div>
                <div className="baby-registry-unique-stat-item" style={{
                  textAlign: 'center',
                  padding: '12px 8px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div className="baby-registry-unique-stat-number" style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: '4px'
                  }}>{totalCount - purchasedCount}</div>
                  <div className="baby-registry-unique-stat-label" style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 500
                  }}>Remaining</div>
                </div>
              </div>
            </div>

            <div className="baby-registry-unique-sidebar-card" style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="baby-registry-unique-sidebar-title" style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '16px'
              }}>Registry Tips</h3>
              <ul className="baby-registry-unique-tips-list" style={{
                listStyle: 'none',
                padding: 0
              }}>
                <li style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <span style={{
                    content: '•',
                    color: '#6366f1',
                    position: 'absolute',
                    left: 0,
                    fontWeight: 'bold'
                  }}>•</span>
                  Include items in different price ranges
                </li>
                <li style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <span style={{
                    content: '•',
                    color: '#6366f1',
                    position: 'absolute',
                    left: 0,
                    fontWeight: 'bold'
                  }}>•</span>
                  Add both essential and nice-to-have items
                </li>
                <li style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <span style={{
                    content: '•',
                    color: '#6366f1',
                    position: 'absolute',
                    left: 0,
                    fontWeight: 'bold'
                  }}>•</span>
                  Consider your lifestyle and space
                </li>
                <li style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <span style={{
                    content: '•',
                    color: '#6366f1',
                    position: 'absolute',
                    left: 0,
                    fontWeight: 'bold'
                  }}>•</span>
                  Update regularly as your needs change
                </li>
                <li style={{
                  padding: '8px 0',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  paddingLeft: '20px'
                }}>
                  <span style={{
                    content: '•',
                    color: '#6366f1',
                    position: 'absolute',
                    left: 0,
                    fontWeight: 'bold'
                  }}>•</span>
                  Share with family and friends
                </li>
              </ul>
            </div>

            <div className="baby-registry-unique-sidebar-card" style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="baby-registry-unique-sidebar-title" style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '16px'
              }}>Popular Categories</h3>
              <div className="baby-registry-unique-categories-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}>
                {categories.map(category => (
                  <div key={category} className="baby-registry-unique-category-item" style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#475569',
                    fontWeight: 500,
                    textAlign: 'center'
                  }}>
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