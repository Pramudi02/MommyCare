import React, { useState } from 'react';
import { Search, Star, Heart, User, Sparkles } from 'lucide-react';

const BabyNameFinder = () => {
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedLetter, setSelectedLetter] = useState('Any Letter');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');

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

  const filterOptions = [
    'All Names', 'Boys', 'Girls', 'Neutral', 'Popular', 'Unique', 'Buddhist'
  ];

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
                placeholder="Search for the Perfect Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '3rem',
                  paddingRight: '4rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '1.125rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '9999px',
                  outline: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#ec4899',
                border: 'none',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#db2777'}
              onMouseLeave={(e) => e.target.style.background = '#ec4899'}>
                <Search style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Search by name, meaning, or letter</p>
            </div>

            {/* Filter Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}>
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setActiveFilter(option)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: activeFilter === option ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    background: activeFilter === option ? '#9333ea' : 'white',
                    color: activeFilter === option ? 'white' : '#6b7280',
                    boxShadow: activeFilter === option ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    transform: activeFilter === option ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== option) {
                      e.target.style.background = '#f9fafb';
                      e.target.style.borderColor = '#d1d5db';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== option) {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#e5e7eb';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Gender and Letter Selectors */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Gender
                </label>
                <select 
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    background: 'white',
                    outline: 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option>All Genders</option>
                  <option>Boys</option>
                  <option>Girls</option>
                  <option>Neutral</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Starting Letter
                </label>
                <select 
                  value={selectedLetter}
                  onChange={(e) => setSelectedLetter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    background: 'white',
                    outline: 'none',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.boxShadow = '0 0 0 4px rgba(236, 72, 153, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option>Any Letter</option>
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => (
                    <option key={letter}>{letter}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontWeight: '500' }}>
                Showing 24 beautiful names for you
              </p>
            </div>
          </div>
        </div>

        {/* Names Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 1024 ? 'repeat(3, 1fr)' : window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {popularNames.map((name, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>{name.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}>
                    <Heart style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#9ca3af'
                    }} />
                  </button>
                  <button style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#eff6ff'}
                  onMouseLeave={(e) => e.target.style.background = 'none'}>
                    <User style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#9ca3af'
                    }} />
                  </button>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                lineHeight: '1.5'
              }}>
                {name.meaning}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        color: i < name.rating ? '#eab308' : '#d1d5db',
                        fill: i < name.rating ? 'currentColor' : 'none'
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#f3f4f6',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px'
                }}>
                  <Heart style={{
                    width: '1rem',
                    height: '1rem',
                    color: '#ec4899'
                  }} />
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>{name.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discover More Button */}
        <div style={{ textAlign: 'center' }}>
          <button style={{
            background: 'linear-gradient(90deg, #ec4899, #9333ea)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            padding: '1rem 2rem',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #db2777, #7c3aed)';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #ec4899, #9333ea)';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <span style={{ fontSize: '1rem' }}>Discover More Beautiful Names</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BabyNameFinder;