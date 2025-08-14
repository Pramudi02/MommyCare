import React, { useState } from 'react';
import { FiSearch, FiPlus, FiShare2, FiBookmark } from 'react-icons/fi';
import './Education.css';

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'First Trimester Essentials: What to Expect',
      category: 'pregnancy',
      author: 'Midwife Sarah',
      date: '2024-02-18',
      readTime: '6 min',
      summary:
        'Symptoms, nutrition tips, and when to call your provider during the first 12 weeks.',
      tags: ['pregnancy', 'trimester', 'nutrition'],
    },
    {
      id: 2,
      title: 'Postpartum Healing: A Practical 6-Week Guide',
      category: 'postpartum',
      author: 'Midwife Emma',
      date: '2024-02-10',
      readTime: '8 min',
      summary:
        'Realistic recovery milestones, perineal care, mental health, and safe activity resumption.',
      tags: ['postpartum', 'recovery', 'healing'],
    },
    {
      id: 3,
      title: 'Newborn Basics: Feeding, Sleep, and Soothing',
      category: 'baby-care',
      author: 'Dr. Lee',
      date: '2024-02-08',
      readTime: '7 min',
      summary:
        'Foundational tips for feeding schedules, safe sleep, colic, and when to seek help.',
      tags: ['newborn', 'sleep', 'feeding'],
    },
    {
      id: 4,
      title: 'Gestational Diabetes: Diet Ideas that Work',
      category: 'nutrition',
      author: 'Dietitian May',
      date: '2024-01-31',
      readTime: '5 min',
      summary:
        'Meal planning, grocery lists, and simple swaps to keep sugars steady during pregnancy.',
      tags: ['nutrition', 'diabetes', 'pregnancy'],
    },
  ]);

  const [composer, setComposer] = useState({ title: '', category: 'pregnancy', summary: '' });

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'pregnancy', name: 'Pregnancy' },
    { id: 'postpartum', name: 'Postpartum' },
    { id: 'baby-care', name: 'Baby Care' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'mental-health', name: 'Mental Health' },
  ];

  const filtered = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const addArticle = () => {
    if (!composer.title.trim() || !composer.summary.trim()) return;
    const newArticle = {
      id: Date.now(),
      title: composer.title.trim(),
      category: composer.category,
      author: 'You',
      date: new Date().toISOString().slice(0, 10),
      readTime: '~5 min',
      summary: composer.summary.trim(),
      tags: [],
    };
    setArticles([newArticle, ...articles]);
    setComposer({ title: '', category: 'pregnancy', summary: '' });
  };

  return (
    <div className="education-page">
      <div className="education-header">
        <div className="education-title">
          <h1>Documentaries</h1>
          <p>Write and explore practical documentaries, advice, and ideas for health, pregnancy, and child care</p>
        </div>
        <button className="add-resource-btn" onClick={addArticle}>
          <FiPlus />
          Publish Entry
        </button>
      </div>

      {/* Composer */}
      <div className="resource-card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Create a new documentary/advice</h3>
        <div className="resource-meta" style={{ marginBottom: 10 }}>
          <div className="meta-item">
            <span className="meta-label">Title</span>
            <input
              className="form-input"
              type="text"
              placeholder="E.g., Hydration tips in the 2nd trimester"
              value={composer.title}
              onChange={(e) => setComposer({ ...composer, title: e.target.value })}
            />
          </div>
          <div className="meta-item">
            <span className="meta-label">Category</span>
            <select
              className="form-select"
              value={composer.category}
              onChange={(e) => setComposer({ ...composer, category: e.target.value })}
            >
              {categories
                .filter((c) => c.id !== 'all')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <textarea
          className="form-input"
          rows="3"
          placeholder="Write short documentary/advice, ideas, or notes..."
          value={composer.summary}
          onChange={(e) => setComposer({ ...composer, summary: e.target.value })}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button className="action-btn primary" onClick={addArticle}>
            Publish
          </button>
        </div>
      </div>

      <div className="education-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon"><FiSearch /></span>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="education-content">
        <div className="resources-grid">
          {filtered.map((a) => (
            <div key={a.id} className="resource-card">
              <div className="resource-header">
                <div className="resource-type">{a.readTime}</div>
              </div>

              <div className="resource-content">
                <h3 className="resource-title">{a.title}</h3>
                <p className="resource-description">{a.summary}</p>

                <div className="resource-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{categories.find((c) => c.id === a.category)?.name || 'General'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">By:</span>
                    <span className="meta-value">{a.author}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Date:</span>
                    <span className="meta-value">{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="resource-tags">
                  {(a.tags || []).map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="resource-actions">
                <button className="action-btn primary">
                  <FiShare2 /> Share
                </button>
                <button className="action-btn secondary">
                  <FiBookmark /> Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="no-resources">
            <div className="no-resources-icon">D</div>
            <h3>No entries found</h3>
            <p>Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
