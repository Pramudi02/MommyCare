import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, Activity, AlertCircle, BarChart3, Plus, Baby, Calendar, Weight, Ruler } from 'lucide-react';
import { babyGrowthAPI } from '../../../services/api';
import './ChildGrowthChart.css';

const ChildGrowthChart = () => {
  const [babyProfiles, setBabyProfiles] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [growthRate, setGrowthRate] = useState(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    babyName: '',
    gender: 'male',
    birthDate: ''
  });

  const [measurementForm, setMeasurementForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: '',
    notes: ''
  });

  // Load baby profiles on component mount
  useEffect(() => {
    loadBabyProfiles();
  }, []);

  // Load measurements when selected baby changes
  useEffect(() => {
    if (selectedBaby) {
      loadMeasurements(selectedBaby._id);
      loadGrowthRate(selectedBaby._id);
    }
  }, [selectedBaby]);

  const loadBabyProfiles = async () => {
    try {
      setLoading(true);
      const response = await babyGrowthAPI.getAllProfiles();
      setBabyProfiles(response.data);
      
      // Auto-select first baby if available
      if (response.data.length > 0 && !selectedBaby) {
        setSelectedBaby(response.data[0]);
      }
    } catch (err) {
      setError('Failed to load baby profiles');
      console.error('Error loading baby profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMeasurements = async (babyId) => {
    try {
      setLoading(true);
      const response = await babyGrowthAPI.getMeasurements(babyId);
      setMeasurements(response.data.measurements);
    } catch (err) {
      setError('Failed to load measurements');
      console.error('Error loading measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGrowthRate = async (babyId) => {
    try {
      const response = await babyGrowthAPI.getGrowthRate(babyId, 30);
      setGrowthRate(response.data.growthRate);
    } catch (err) {
      console.error('Error loading growth rate:', err);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await babyGrowthAPI.createProfile(profileForm);
      setBabyProfiles([...babyProfiles, response.data]);
      setSelectedBaby(response.data);
      setShowAddProfile(false);
      setProfileForm({ babyName: '', gender: 'male', birthDate: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create baby profile');
      console.error('Error creating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    if (!selectedBaby) return;

    try {
      setLoading(true);
      await babyGrowthAPI.addMeasurement(selectedBaby._id, measurementForm);
      
      // Reload measurements
      await loadMeasurements(selectedBaby._id);
      await loadGrowthRate(selectedBaby._id);
      
      // Reset form
      setMeasurementForm({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        headCircumference: '',
        notes: ''
      });
      
      setShowAddMeasurement(false);
      setError(null);
    } catch (err) {
      setError('Failed to add measurement');
      console.error('Error adding measurement:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today - birth);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatChartData = () => {
    if (!measurements || measurements.length === 0) return [];
    
    return measurements.map((measurement, index) => ({
      date: formatDate(measurement.date),
      weight: measurement.weight,
      height: measurement.height,
      headCircumference: measurement.headCircumference || 0,
      day: index + 1
    }));
  };

  const chartData = formatChartData();

  if (loading && babyProfiles.length === 0) {
    return (
      <div className="child-growth-chart">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading baby growth data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="child-growth-chart">
      <div className="header-growthchart">
        <h1>
          <BarChart3 className="header-icon" style={{marginRight: "15px"}} />
          Baby Growth Chart & Daily Tracker
        </h1>
        <p>Track your baby's daily growth with comprehensive measurements and interactive charts</p>
      </div>

      {/* Baby Profile Selection */}
      <div className="baby-selection-section">
        <div className="baby-profiles">
          <h3>Your Babies</h3>
          <div className="baby-list">
            {babyProfiles.map((baby) => (
              <div
                key={baby._id}
                className={`baby-card ${selectedBaby?._id === baby._id ? 'selected' : ''}`}
                onClick={() => setSelectedBaby(baby)}
              >
                <Baby className="baby-icon" />
                <div className="baby-info">
                  <h4>{baby.babyName}</h4>
                  <p>{baby.gender === 'male' ? 'Boy' : 'Girl'} • {calculateAge(baby.birthDate)} months</p>
                </div>
              </div>
            ))}
            
            <button
              className="add-baby-btn"
              onClick={() => setShowAddProfile(true)}
            >
              <Plus size={20} />
              Add New Baby
            </button>
          </div>
        </div>
      </div>

      {/* Add Baby Profile Modal */}
      {showAddProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Baby Profile</h3>
            <form onSubmit={handleCreateProfile}>
              <div className="form-group">
                <label>Baby Name</label>
                <input
                  type="text"
                  value={profileForm.babyName}
                  onChange={(e) => setProfileForm({...profileForm, babyName: e.target.value})}
                  required
                  placeholder="Enter baby's name"
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Birth Date</label>
                <input
                  type="date"
                  value={profileForm.birthDate}
                  onChange={(e) => setProfileForm({...profileForm, birthDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddProfile(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {selectedBaby ? (
        <div className="main-content">
          {/* Daily Measurement Form */}
          <div className="measurement-form-section">
            <div className="section-header">
              <h3>Daily Growth Measurement</h3>
              <button
                className="add-measurement-btn"
                onClick={() => setShowAddMeasurement(true)}
              >
                <Plus size={16} />
                Add Today's Measurement
              </button>
            </div>
            
            <div className="current-stats">
              <div className="stat-card">
                <Weight className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Latest Weight</span>
                  <span className="stat-value">
                    {measurements.length > 0 ? `${measurements[0].weight} lbs` : 'No data'}
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <Ruler className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Latest Height</span>
                  <span className="stat-value">
                    {measurements.length > 0 ? `${measurements[0].height} inches` : 'No data'}
                  </span>
                </div>
              </div>
              
              <div className="stat-card">
                <Calendar className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-label">Total Measurements</span>
                  <span className="stat-value">{measurements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Charts */}
          <div className="charts-section">
            <div className="chart-container">
              <h3>Weight Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#4caf50" 
                    strokeWidth={3}
                    dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Height Growth Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.8)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="height" 
                    stroke="#2196f3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Rate Analysis */}
          {growthRate && (
            <div className="growth-analysis-section">
              <h3>Growth Rate Analysis (Last 30 Days)</h3>
              <div className="growth-stats">
                <div className="growth-stat">
                  <span className="growth-label">Weight Gain</span>
                  <span className="growth-value">{growthRate.totalWeightGain.toFixed(2)} lbs</span>
                  <span className="growth-rate">{growthRate.weightGainPerDay.toFixed(3)} lbs/day</span>
                </div>
                
                <div className="growth-stat">
                  <span className="growth-label">Height Gain</span>
                  <span className="growth-value">{growthRate.totalHeightGain.toFixed(2)} inches</span>
                  <span className="growth-rate">{growthRate.heightGainPerDay.toFixed(3)} inches/day</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Measurements Table */}
          <div className="measurements-table-section">
            <h3>Recent Measurements</h3>
            <div className="measurements-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (lbs)</th>
                    <th>Height (inches)</th>
                    <th>Head Circumference (inches)</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.slice(0, 10).map((measurement, index) => (
                    <tr key={index}>
                      <td>{formatDate(measurement.date)}</td>
                      <td>{measurement.weight}</td>
                      <td>{measurement.height}</td>
                      <td>{measurement.headCircumference || '-'}</td>
                      <td>{measurement.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-baby-selected">
          <Baby className="no-baby-icon" />
          <h3>No Baby Selected</h3>
          <p>Please select a baby profile or create a new one to start tracking growth.</p>
        </div>
      )}

      {/* Add Measurement Modal */}
      {showAddMeasurement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Daily Measurement</h3>
            <form onSubmit={handleAddMeasurement}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={measurementForm.date}
                  onChange={(e) => setMeasurementForm({...measurementForm, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementForm.weight}
                  onChange={(e) => setMeasurementForm({...measurementForm, weight: e.target.value})}
                  required
                  placeholder="Enter weight in pounds"
                />
              </div>
              
              <div className="form-group">
                <label>Height (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementForm.height}
                  onChange={(e) => setMeasurementForm({...measurementForm, height: e.target.value})}
                  required
                  placeholder="Enter height in inches"
                />
              </div>
              
              <div className="form-group">
                <label>Head Circumference (inches) - Optional</label>
                <input
                  type="number"
                  step="0.1"
                  value={measurementForm.headCircumference}
                  onChange={(e) => setMeasurementForm({...measurementForm, headCircumference: e.target.value})}
                  placeholder="Enter head circumference"
                />
              </div>
              
              <div className="form-group">
                <label>Notes - Optional</label>
                <textarea
                  value={measurementForm.notes}
                  onChange={(e) => setMeasurementForm({...measurementForm, notes: e.target.value})}
                  placeholder="Any additional notes about this measurement"
                  rows="3"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMeasurement(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Measurement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default ChildGrowthChart; 