import React, { useState } from 'react';

const PregnancyWeightGainCalculator = () => {
  const [activeTab, setActiveTab] = useState('first');
  const [formData, setFormData] = useState({
    preWeight: '',
    currentWeight: '',
    heightFt: '',
    heightIn: '',
    heightCm: '',
    age: '',
    week: '',
    twins: false
  });

  const [results, setResults] = useState({
    weightGain: 2.5,
    minRange: 11.5,
    maxRange: 16,
    remaining: 8,
    weeksPregnant: 16,
    bmi: 22.4,
    bmiStatus: 'Normal Weight'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateRecommendations = () => {
    console.log('Calculating recommendations...');
  };

  const styles = {
    mainContainer: {
      background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%)',
      minHeight: '100vh',
      padding: '20px 0',
      color: '#2d3748',
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    headerSection: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '40px 20px'
    },
    headerIcon: {
      fontSize: '3rem',
      marginBottom: '20px'
    },
    mainTitle: {
      color: '#4299e1',
      fontSize: '2.2rem',
      fontWeight: '600',
      marginBottom: '15px'
    },
    subtitleText: {
      color: '#718096',
      fontSize: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '30px',
      alignItems: 'start'
    },
    calculatorCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e2e8f0'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '25px'
    },
    cardIcon: {
      fontSize: '1.5rem',
      color: '#4299e1'
    },
    cardTitle: {
      color: '#1e3a8a',
      fontSize: '1.4rem',
      fontWeight: '600'
    },
    tabsContainer: {
      display: 'flex',
      marginBottom: '30px',
      borderRadius: '12px',
      background: '#f7fafc',
      padding: '4px',
      border: '1px solid #e2e8f0'
    },
    tabButton: {
      flex: 1,
      padding: '12px 16px',
      border: 'none',
      background: 'transparent',
      color: '#718096',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      borderRadius: '8px',
      textAlign: 'center'
    },
    tabActive: {
      background: '#4299e1',
      color: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    formLabel: {
      color: '#4a5568',
      fontWeight: '500',
      marginBottom: '8px',
      fontSize: '0.9rem'
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    formInput: {
      flex: 1,
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.95rem',
      color: '#2d3748',
      transition: 'all 0.2s ease',
      background: 'white'
    },
    inputUnit: {
      position: 'absolute',
      right: '16px',
      color: '#718096',
      fontWeight: '500',
      pointerEvents: 'none',
      fontSize: '0.9rem'
    },
    heightInputs: {
      display: 'flex',
      gap: '10px'
    },
    weekSelect: {
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.95rem',
      color: '#2d3748',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: '100%'
    },
    checkboxContainer: {
      margin: '10px 0'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      color: '#4a5568',
      fontSize: '0.9rem',
      padding: '8px 0'
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      accentColor: '#4299e1'
    },
    calculateButton: {
      background: '#4299e1',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(66, 153, 225, 0.2)'
    },
    resultsColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    summaryCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    summaryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      fontWeight: '600'
    },
    summaryIcon: {
      fontSize: '1.2rem'
    },
    weightDisplay: {
      textAlign: 'center',
      marginBottom: '25px'
    },
    weightValue: {
      display: 'block',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '5px'
    },
    weightLabel: {
      fontSize: '0.9rem',
      opacity: '0.9'
    },
    recommendationsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    recItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0'
    },
    recLabel: {
      fontSize: '0.9rem',
      opacity: '0.9'
    },
    recValue: {
      fontWeight: '600',
      fontSize: '1rem'
    },
    weeksCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      border: '1px solid #e2e8f0'
    },
    weeksNumber: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '8px'
    },
    weeksText: {
      color: '#718096',
      fontSize: '0.9rem',
      fontWeight: '500'
    },
    bmiCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    bmiHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      color: '#2d3748',
      fontWeight: '600'
    },
    bmiIcon: {
      fontSize: '1.2rem',
      color: '#4299e1'
    },
    bmiValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#4299e1',
      marginBottom: '10px'
    },
    bmiStatus: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#48bb78',
      fontWeight: '600'
    },
    checkIcon: {
      color: '#48bb78',
      fontSize: '1.2rem'
    },
    progressCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    progressHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px',
      color: '#2d3748'
    },
    progressHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600'
    },
    progressIcon: {
      fontSize: '1.2rem',
      color: '#4299e1'
    },
    progressPercent: {
      color: '#48bb78',
      fontWeight: '700',
      fontSize: '1.1rem'
    },
    progressLabel: {
      color: '#718096',
      fontSize: '0.9rem',
      marginBottom: '15px'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#edf2f7',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '12px'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #48bb78, #38a169)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      width: '70%'
    },
    progressNote: {
      color: '#48bb78',
      fontSize: '0.85rem',
      fontWeight: '500'
    },
    tipsCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    },
    tipsHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      color: '#2d3748',
      fontWeight: '600'
    },
    tipsIcon: {
      fontSize: '1.2rem',
      color: '#4299e1'
    },
    tipsList: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      margin: 0,
      padding: 0
    },
    tipItem: {
      padding: '12px 16px',
      background: '#f7fafc',
      borderRadius: '8px',
      color: '#4a5568',
      fontSize: '0.9rem',
      lineHeight: '1.5',
      position: 'relative',
      paddingLeft: '40px',
      border: '1px solid #e2e8f0'
    }
  };

  const tipIcons = ['💡', '💧', '💊', '🚶‍♀️'];

  return (
    <div style={styles.mainContainer}>
      <div style={styles.contentWrapper}>
        {/* Header Section */}
        <header style={styles.headerSection}>
          <div style={styles.headerIcon}>👶</div>
          <h1 style={styles.mainTitle}>Pregnancy Weight Gain Calculator</h1>
          <p style={styles.subtitleText}>Track your healthy weight journey with personalized recommendations and expert guidance throughout your pregnancy</p>
        </header>

        {/* Main Content Grid */}
        <div style={styles.mainGrid}>
          {/* Left Column - Calculator Form */}
          <div style={styles.calculatorCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>📊</span>
              <h2 style={styles.cardTitle}>Calculate Your Weight Gain</h2>
            </div>

            {/* Trimester Tabs */}
            <div style={styles.tabsContainer}>
              {['first', 'second', 'third', 'postpartum'].map((tab, index) => (
                <button 
                  key={tab}
                  style={{
                    ...styles.tabButton,
                    ...(activeTab === tab ? styles.tabActive : {})
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {['First Trimester', 'Second Trimester', 'Third Trimester', 'Postpartum'][index]}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={styles.formContainer}>
              {/* Weight Row */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Pre-pregnancy Weight</label>
                  <div style={styles.inputWrapper}>
                    <input 
                      type="number" 
                      style={styles.formInput}
                      placeholder="Enter weight"
                      value={formData.preWeight}
                      onChange={(e) => handleInputChange('preWeight', e.target.value)}
                    />
                    <span style={styles.inputUnit}>kg</span>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Current Weight</label>
                  <div style={styles.inputWrapper}>
                    <input 
                      type="number" 
                      style={styles.formInput}
                      placeholder="Enter current weight"
                      value={formData.currentWeight}
                      onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    />
                    <span style={styles.inputUnit}>kg</span>
                  </div>
                </div>
              </div>

              {/* Height and Age Row */}
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Height</label>
                  <div style={styles.heightInputs}>
                    <div style={styles.inputWrapper}>
                      <input 
                        type="number" 
                        style={styles.formInput}
                        placeholder="ft"
                        value={formData.heightFt}
                        onChange={(e) => handleInputChange('heightFt', e.target.value)}
                      />
                      <span style={styles.inputUnit}>ft</span>
                    </div>
                    <div style={styles.inputWrapper}>
                      <input 
                        type="number" 
                        style={styles.formInput}
                        placeholder="in"
                        value={formData.heightIn}
                        onChange={(e) => handleInputChange('heightIn', e.target.value)}
                      />
                      <span style={styles.inputUnit}>in</span>
                    </div>
                    <div style={styles.inputWrapper}>
                      <input 
                        type="number" 
                        style={styles.formInput}
                        placeholder="cm"
                        value={formData.heightCm}
                        onChange={(e) => handleInputChange('heightCm', e.target.value)}
                      />
                      <span style={styles.inputUnit}>cm</span>
                    </div>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Age</label>
                  <div style={styles.inputWrapper}>
                    <input 
                      type="number" 
                      style={styles.formInput}
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Week Select */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Week of Pregnancy</label>
                <select 
                  style={styles.weekSelect}
                  value={formData.week}
                  onChange={(e) => handleInputChange('week', e.target.value)}
                >
                  <option value="">Select your current week</option>
                  {Array.from({length: 40}, (_, i) => (
                    <option key={i+1} value={i+1}>Week {i+1}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox */}
              <div style={styles.checkboxContainer}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    style={styles.checkboxInput}
                    checked={formData.twins}
                    onChange={(e) => handleInputChange('twins', e.target.checked)}
                  />
                  <span>I'm carrying twins or multiples</span>
                </label>
              </div>

              {/* Calculate Button */}
              <button 
                type="button" 
                style={styles.calculateButton} 
                onClick={calculateRecommendations}
                onMouseOver={(e) => e.target.style.background = '#3182ce'}
                onMouseOut={(e) => e.target.style.background = '#4299e1'}
              >
                Calculate Weight Gain Recommendations
              </button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div style={styles.resultsColumn}>
            {/* Weight Summary Card */}
            <div style={styles.summaryCard}>
              <div style={styles.summaryHeader}>
                <span style={styles.summaryIcon}>📊</span>
                <span>Weight Gain Summary</span>
              </div>
              <div style={styles.weightDisplay}>
                <span style={styles.weightValue}>+{results.weightGain} kg</span>
                <span style={styles.weightLabel}>Total Weight Gained</span>
              </div>
              <div style={styles.recommendationsList}>
                <div style={styles.recItem}>
                  <span style={styles.recLabel}>Recommended Range</span>
                </div>
                <div style={styles.recItem}>
                  <span style={styles.recLabel}>Minimum</span>
                  <span style={styles.recValue}>{results.minRange} kg</span>
                </div>
                <div style={styles.recItem}>
                  <span style={styles.recLabel}>Maximum</span>
                  <span style={styles.recValue}>{results.maxRange} kg</span>
                </div>
                <div style={styles.recItem}>
                  <span style={styles.recLabel}>Remaining</span>
                  <span style={styles.recValue}>{results.remaining} kg</span>
                </div>
              </div>
            </div>

            {/* Weeks Pregnant Card */}
            <div style={styles.weeksCard}>
              <div style={styles.weeksNumber}>{results.weeksPregnant}</div>
              <div style={styles.weeksText}>Weeks Pregnant</div>
            </div>

            {/* BMI Analysis Card */}
            <div style={styles.bmiCard}>
              <div style={styles.bmiHeader}>
                <span style={styles.bmiIcon}>📊</span>
                <span>BMI Analysis</span>
              </div>
              <div style={styles.bmiValue}>{results.bmi}</div>
              <div style={styles.bmiStatus}>
                <span>{results.bmiStatus}</span>
                <span style={styles.checkIcon}>✓</span>
              </div>
            </div>

            {/* Progress Tracking Card */}
            <div style={styles.progressCard}>
              <div style={styles.progressHeader}>
                <div style={styles.progressHeaderLeft}>
                  <span style={styles.progressIcon}>📈</span>
                  <span>Progress Tracking</span>
                </div>
                <span style={styles.progressPercent}>70%</span>
              </div>
              <div style={styles.progressLabel}>Weight Gain Progress</div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
              <div style={styles.progressNote}>On track for healthy weight gain</div>
            </div>

            {/* Weekly Tips Card */}
            <div style={styles.tipsCard}>
              <div style={styles.tipsHeader}>
                <span style={styles.tipsIcon}>💡</span>
                <span>Weekly Tips</span>
              </div>
              <ul style={styles.tipsList}>
                {[
                  'Eat nutrient-dense foods for you and baby',
                  'Stay hydrated with 8-10 glasses of water daily',
                  'Include prenatal vitamins in your routine',
                  'Gentle exercise like walking is beneficial'
                ].map((tip, index) => (
                  <li key={index} style={styles.tipItem}>
                    <span style={{position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)'}}>
                      {tipIcons[index]}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyWeightGainCalculator;