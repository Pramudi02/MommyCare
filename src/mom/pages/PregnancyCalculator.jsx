import React, { useState, useEffect } from 'react';
import './PregnancyCalculator.css';

const PregnancyCalculator = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [calculationMethod, setCalculationMethod] = useState('last-period');
  const [timeline, setTimeline] = useState(null);

  // Initialize with sample data to show the timeline
  useEffect(() => {
    // Set a sample date to show the timeline by default
    const sampleDate = new Date();
    sampleDate.setDate(sampleDate.getDate() - 60); // 60 days ago as sample
    setLastPeriod(sampleDate.toISOString().split('T')[0]);
    calculateSampleTimeline(sampleDate);
  }, []);

  const calculateSampleTimeline = (startDate) => {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 280);

    const conception = new Date(startDate);
    conception.setDate(conception.getDate() + 14);

    const implantation = new Date(startDate);
    implantation.setDate(implantation.getDate() + 20);

    const bloodTest = new Date(startDate);
    bloodTest.setDate(bloodTest.getDate() + 21);

    const heartbeatDetection = new Date(startDate);
    heartbeatDetection.setDate(heartbeatDetection.getDate() + 42);

    const firstTrimester = { start: startDate, end: new Date(startDate.getTime() + 84 * 24 * 60 * 60 * 1000) };
    const secondTrimester = { start: new Date(startDate.getTime() + 85 * 24 * 60 * 60 * 1000), end: new Date(startDate.getTime() + 168 * 24 * 60 * 60 * 1000) };
    const thirdTrimester = { start: new Date(startDate.getTime() + 169 * 24 * 60 * 60 * 1000), end: dueDate };

    const fullTerm = new Date(startDate);
    fullTerm.setDate(fullTerm.getDate() + 259);

    setTimeline({
      dueDate,
      conception,
      implantation,
      bloodTest,
      heartbeatDetection,
      trimesters: { first: firstTrimester, second: secondTrimester, third: thirdTrimester },
      fullTerm
    });
  };

  const calculateDates = () => {
    if (!lastPeriod) return;

    const startDate = new Date(lastPeriod);
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

    // Calculate key milestones
    const conception = new Date(startDate);
    conception.setDate(conception.getDate() + 14);

    const implantation = new Date(startDate);
    implantation.setDate(implantation.getDate() + 20);

    const bloodTest = new Date(startDate);
    bloodTest.setDate(bloodTest.getDate() + 21);

    const heartbeatDetection = new Date(startDate);
    heartbeatDetection.setDate(heartbeatDetection.getDate() + 42);

    // Trimester dates
    const firstTrimester = { start: startDate, end: new Date(startDate.getTime() + 84 * 24 * 60 * 60 * 1000) };
    const secondTrimester = { start: new Date(startDate.getTime() + 85 * 24 * 60 * 60 * 1000), end: new Date(startDate.getTime() + 168 * 24 * 60 * 60 * 1000) };
    const thirdTrimester = { start: new Date(startDate.getTime() + 169 * 24 * 60 * 60 * 1000), end: dueDate };

    const fullTerm = new Date(startDate);
    fullTerm.setDate(fullTerm.getDate() + 259); // 37 weeks

    setTimeline({
      dueDate,
      conception,
      implantation,
      bloodTest,
      heartbeatDetection,
      trimesters: { first: firstTrimester, second: secondTrimester, third: thirdTrimester },
      fullTerm
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatShortDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="pregnancy-calculator">
      <div className="calculator-section">
        <div className="calculator-card">
          <h2 className="calculator-title">
            <span className="calendar-icon">📅</span>
            Pregnancy Due Date Calculator
          </h2>
          
          <div className="form-group">
            <label htmlFor="calculation-method">Calculation method</label>
            <select 
              id="calculation-method"
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              className="form-select"
            >
              <option value="last-period">Last period</option>
              <option value="conception-date">Conception date</option>
              <option value="due-date">Due date</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="last-period">When did your last period start?</label>
            <input
              type="date"
              id="last-period"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cycle-length">Cycle length</label>
            <select 
              id="cycle-length"
              value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="form-select"
            >
              {[...Array(15)].map((_, i) => (
                <option key={i + 21} value={i + 21}>
                  {i + 21} days
                </option>
              ))}
            </select>
          </div>

          <button 
            className="calculate-btn"
            onClick={calculateDates}
            disabled={!lastPeriod}
          >
            Update your timeline
          </button>
        </div>
      </div>

      {timeline && (
        <div className="timeline-section">
          <div className="timeline-card">
            <h2 className="timeline-title">Your Pregnancy Timeline</h2>
            
            <div className="due-date-banner">
              <div className="due-date-text">Your estimated due date is</div>
              <div className="due-date-main">{formatDate(timeline.dueDate)}</div>
            </div>

            <div className="milestones-grid">
              <div className="milestone-card conception">
                <div className="milestone-title">Conception</div>
                <div className="milestone-date">{formatDate(timeline.conception)}</div>
                <div className="milestone-subtitle">Estimated date</div>
              </div>
              
              <div className="milestone-card implantation">
                <div className="milestone-title">Implantation</div>
                <div className="milestone-date">{formatDate(timeline.implantation)}</div>
                <div className="milestone-subtitle">6-12 days after conception</div>
              </div>

              <div className="milestone-card blood-test">
                <div className="milestone-title">Blood Test</div>
                <div className="milestone-date">{formatDate(timeline.bloodTest)}</div>
                <div className="milestone-subtitle">7-12 days after conception</div>
              </div>

              <div className="milestone-card heartbeat">
                <div className="milestone-title">Heartbeat Detection</div>
                <div className="milestone-date">{formatDate(timeline.heartbeatDetection)}</div>
                <div className="milestone-subtitle">6-7 weeks after LMP</div>
              </div>
            </div>

            <div className="pregnancy-timeline-section">
              <h3 className="section-title">Your Pregnancy Timeline</h3>
              
              <div className="timeline-visual">
                <div className="timeline-bar">
                  <div className="timeline-progress" style={{width: '100%'}}></div>
                </div>
                
                <div className="timeline-markers">
                  <div className="timeline-marker conception-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">Conception</div>
                    <div className="marker-date">{formatShortDate(timeline.conception)}</div>
                  </div>
                  
                  <div className="timeline-marker implantation-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">Implantation</div>
                    <div className="marker-date">{formatShortDate(timeline.implantation)}</div>
                  </div>
                  
                  <div className="timeline-marker heartbeat-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">Heartbeat</div>
                    <div className="marker-date">{formatShortDate(timeline.heartbeatDetection)}</div>
                  </div>
                  
                  <div className="timeline-marker fullterm-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">Full Term</div>
                    <div className="marker-date">{formatShortDate(timeline.fullTerm)}</div>
                  </div>
                  
                  <div className="timeline-marker duedate-marker">
                    <div className="marker-dot"></div>
                    <div className="marker-label">Due Date</div>
                    <div className="marker-date">{formatShortDate(timeline.dueDate)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="trimesters-section">
              <h3 className="section-title">Pregnancy Trimesters</h3>
              
              <div className="trimesters-grid">
                <div className="trimester-card first">
                  <div className="trimester-number">1st</div>
                  <div className="trimester-dates">
                    {formatShortDate(timeline.trimesters.first.start)} - {formatShortDate(timeline.trimesters.first.end)}
                  </div>
                  <div className="trimester-weeks">Week 1-12</div>
                </div>
                
                <div className="trimester-card second">
                  <div className="trimester-number">2nd</div>
                  <div className="trimester-dates">
                    {formatShortDate(timeline.trimesters.second.start)} - {formatShortDate(timeline.trimesters.second.end)}
                  </div>
                  <div className="trimester-weeks">Week 13-26</div>
                </div>
                
                <div className="trimester-card third">
                  <div className="trimester-number">3rd</div>
                  <div className="trimester-dates">
                    {formatShortDate(timeline.trimesters.third.start)} - {formatShortDate(timeline.trimesters.third.end)}
                  </div>
                  <div className="trimester-weeks">Week 27-40</div>
                </div>
              </div>

              <div className="additional-dates">
                <div className="date-item">
                  <div className="date-label">Full Term</div>
                  <div className="date-value">{formatDate(timeline.fullTerm)}</div>
                  <div className="date-subtitle">37 weeks</div>
                </div>
                
                <div className="date-item">
                  <div className="date-label">Due Date</div>
                  <div className="date-value">{formatDate(timeline.dueDate)}</div>
                  <div className="date-subtitle">40 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PregnancyCalculator;