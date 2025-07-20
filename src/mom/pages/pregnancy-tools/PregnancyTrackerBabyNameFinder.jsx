import React, { useState } from 'react';
import { Search, Star, Heart, User, Sparkles } from 'lucide-react';
import './BabyNameFinder.css';

const BabyNameFinder = () => {
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedLetter, setSelectedLetter] = useState('Any Letter');
  const [searchQuery, setSearchQuery] = useState('');

  const popularNames = [
    {
      name: 'Anushka',
      meaning: 'Lightning, grace filled of divinity and optimism with divine blessing',
      rating: 5,
      likes: 0
    },
    {
      name: 'Kaweesha',
      meaning: 'A sweet poem, a piece of beautiful world and intelligence',
      rating: 4,
      likes: 0
    },
    {
      name: 'Tharushi',
      meaning: 'Charming, ambitious and also represents an courageous',
      rating: 5,
      likes: 0
    },
    {
      name: 'Nimaya',
      meaning: 'Pure, divine, spiritual Humble, representing someone pure',
      rating: 4,
      likes: 0
    },
    {
      name: 'Dinura',
      meaning: 'Day-bright, bright like the sun, bringing hope and light',
      rating: 4,
      likes: 0
    },
    {
      name: 'Senali',
      meaning: 'Lightning, flash of light that illuminates the sky',
      rating: 5,
      likes: 0
    }
  ];

  const filterOptions = ['All Names', 'Boys', 'Girls', 'Neutral', 'Popular', 'Unique', 'Buddhist'];

  return (
    <div className="app-container">
      {/* Header */}
    
      <div className="main-container">
        {/* Main Name Finder Section */}
        <div className="name-finder-card">
          <div className="name-finder-header">
            <div className="header-icons">
              <span className="smiley-emoji">😊</span>
              <Sparkles className="sparkles-icon" size={32} />
            </div>
            <h1 className="main-title">Find Your Baby's Perfect Name</h1>
            <p className="main-subtitle">Discover beautiful names with meanings that touch your heart</p>
          </div>

          {/* Search Section */}
          <div className="search-container">
            <div className="search-bar">
              <Search className="search-icon-left" size={20} />
              <input
                type="text"
                placeholder="Search for the Perfect Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">
                <Search size={16} />
              </button>
            </div>

            <div className="search-hint">
              <p>Search by name, meaning, or letter</p>
            </div>

            {/* Filter Buttons */}
            <div className="filter-buttons">
              {filterOptions.map((option, index) => (
                <button
                  key={index}
                  className={`filter-btn ${option === 'Popular' ? 'filter-btn-active' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Gender and Letter Selectors */}
            <div className="selectors-container">
              <div className="selector-group">
                <label className="selector-label">Gender</label>
                <select 
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="selector"
                >
                  <option>All Genders</option>
                  <option>Boys</option>
                  <option>Girls</option>
                  <option>Neutral</option>
                </select>
              </div>
              <div className="selector-group">
                <label className="selector-label">Starting Letter</label>
                <select 
                  value={selectedLetter}
                  onChange={(e) => setSelectedLetter(e.target.value)}
                  className="selector"
                >
                  <option>Any Letter</option>
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
                    <option key={letter}>{letter}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="results-info">
            <p>Showing 24 beautiful names for you</p>
          </div>
        </div>

        {/* Popular Names Grid */}
        <div className="names-grid">
          {popularNames.map((name, index) => (
            <div key={index} className="name-card">
              <div className="name-card-header">
                <h3 className="name-title">{name.name}</h3>
                <div className="name-actions">
                  <button className="action-btn">
                    <Heart size={20} />
                  </button>
                  <button className="action-btn">
                    <User size={18} />
                  </button>
                </div>
              </div>
              
              <p className="name-meaning">{name.meaning}</p>
              
              <div className="name-footer">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < name.rating ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                </div>
                <div className="likes">
                  <Heart size={16} className="heart-icon" />
                  <span className="likes-count">{name.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discover More Button */}
        <div className="discover-more">
          <button className="discover-btn">
            <span>✨</span>
            <span>Discover More Beautiful Names</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BabyNameFinder;