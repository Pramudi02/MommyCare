import React, { useState, useEffect } from 'react';
import { Search, Star, Heart, User, Sparkles, Volume2, Venus } from 'lucide-react';
import { babyNamesAPI } from '../../../services/api';

const BabyNameFinder = () => {
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedLetter, setSelectedLetter] = useState('Any Letter');
  const [searchQuery, setSearchQuery] = useState('');
  const [babyNames, setBabyNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load baby names on component mount
  useEffect(() => {
    loadBabyNames();
  }, []);

  // Load baby names when filters change
  useEffect(() => {
    loadBabyNames();
  }, [selectedGender, selectedLetter, searchQuery]);

  const loadBabyNames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (selectedGender !== 'All Genders') params.gender = selectedGender;
      if (selectedLetter !== 'Any Letter') params.letter = selectedLetter;
      if (searchQuery) params.search = searchQuery;
      
      console.log('Loading baby names with params:', params);
      console.log('Selected gender:', selectedGender);
      
      const response = await babyNamesAPI.getAll(params);
      console.log('API response:', response);
      setBabyNames(response.data || []);
    } catch (err) {
      setError('Failed to load baby names');
      console.error('Error loading baby names:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (nameId) => {
    try {
      await babyNamesAPI.like(nameId);
      // Reload names to get updated like count
      loadBabyNames();
    } catch (err) {
      console.error('Error liking name:', err);
    }
  };

  const handleGenderChange = (gender) => {
    console.log('Gender changed to:', gender);
    setSelectedGender(gender);
  };

  const handleLetterChange = (letter) => {
    setSelectedLetter(letter);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSelectedGender('All Genders');
    setSelectedLetter('Any Letter');
    setSearchQuery('');
  };

  // Generate alphabet letters for filtering
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 50%, #fce7f3 100%)',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '96rem', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '2.5rem' }}>😊</span>
              <Sparkles style={{ color: '#eab308', width: '2rem', height: '2rem' }} />
            </div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #9333ea, #ec4899)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              marginBottom: '1rem'
            }}>
              Find Your Baby's Perfect Name
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Discover beautiful names with meanings that touch your heart
            </p>
          </div>

          {/* Search Section */}
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Search style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '1.25rem',
                height: '1.25rem'
              }} />
              <input
                type="text"
                placeholder="Search names or meanings..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Gender Filter */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {['All Genders', 'girl', 'boy'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => handleGenderChange(gender)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedGender === gender ? '#9333ea' : 'rgba(255, 255, 255, 0.6)',
                      color: selectedGender === gender ? 'white' : '#374151',
                      border: selectedGender === gender ? 'none' : '1px solid #e5e7eb'
                    }}
                  >
                    {gender === 'All Genders' ? 'All' : gender === 'girl' ? '👧 Girls' : '👦 Boys'}
                  </button>
                ))}
              </div>

              {/* Letter Filter */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {['Any Letter', ...alphabet.slice(0, 8)].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterChange(letter)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedLetter === letter ? '#ec4899' : 'rgba(255, 255, 255, 0.6)',
                      color: selectedLetter === letter ? 'white' : '#374151',
                      border: selectedLetter === letter ? 'none' : '1px solid #e5e7eb',
                      minWidth: '2.5rem'
                    }}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.6)'}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Results Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151' }}>
              {loading ? 'Loading...' : `${babyNames.length} Baby Names Found`}
            </h2>
            {error && (
              <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
          </div>

          {/* Names Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #9333ea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#6b7280' }}>Finding perfect names for you...</p>
            </div>
          ) : babyNames.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p>No names found matching your criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
              gap: '1.5rem'
            }}>
              {babyNames.map((name) => (
                <div key={name._id} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                >
                  {/* Name Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Heart style={{ 
                        color: '#ec4899', 
                        width: '1.25rem', 
                        height: '1.25rem',
                        cursor: 'pointer'
                      }} 
                      onClick={() => handleLike(name._id)}
                      />
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {name.name}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Volume2 style={{ color: '#6b7280', width: '1rem', height: '1rem' }} />
                      <Venus style={{ color: '#ec4899', width: '1rem', height: '1rem' }} />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {name.gender === 'girl' ? 'Girl' : name.gender === 'boy' ? 'Boy' : 'Unisex'}
                      </span>
                    </div>
                  </div>

                  {/* Meaning */}
                  <p style={{ 
                    color: '#4b5563', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    {name.meaning}
                  </p>

                  {/* Popularity and Likes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star style={{ color: '#eab308', width: '1rem', height: '1rem' }} />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {name.popularity}/100
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Heart style={{ color: '#ec4899', width: '1rem', height: '1rem' }} />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {name.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BabyNameFinder;