import React, { useState, useEffect } from 'react';
import { Calendar, Bell, FileText, BarChart3, Syringe, Shield, Clock, MapPin, User, Hash, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vaccinationAPI } from '../../services/api';
import './Vaccination.css';
 

const Vaccinations= () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(2);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(false);
  const [vaccinationData, setVaccinationData] = useState({
    upcoming: [],
    missed: [],
    completed: []
  });
 
  const handleStatCardClick = (tab) => {
    setActiveTab(tab);
  };

  const StatCard = ({ number, label }) => (
    <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );

  const ImmunizationCard = ({ vaccine, dueDate, lastGiven, recommendation, status, onSchedule, showScheduleButton = false }) => {
    const getStatusBadgeColor = (status) => {
      switch (status) {
        case 'due-soon':
          return 'bg-yellow-100 text-yellow-800';
        case 'upcoming':
          return 'bg-blue-100 text-blue-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'missed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'due-soon':
          return 'Due Soon';
        case 'upcoming':
          return 'Upcoming';
        case 'completed':
          return 'Completed';
        case 'missed':
          return 'Missed';
        default:
          return 'Unknown';
      }
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{vaccine}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Due Date:</span> {dueDate}
          </div>
          {lastGiven && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Last Given:</span> {lastGiven}
            </div>
          )}
          {recommendation && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Recommendation:</span> {recommendation}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-1 text-sm">
            <MoreHorizontal size={16} />
            More Info
          </button>
          {showScheduleButton && (
            <button
              onClick={() => onSchedule(vaccine)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Requesting...' : 'Request Appointment'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const TimelineCard = ({ vaccine, age, status, dueDate, vaccinationDate, batchNo, adverseEffects, bcgScar, onSchedule, showScheduleButton }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed':
          return 'border-l-green-500 bg-green-50';
        case 'upcoming':
          return 'border-l-blue-500 bg-blue-50';
        case 'overdue':
          return 'border-l-red-500 bg-red-50';
        case 'due':
          return 'border-l-yellow-500 bg-yellow-50';
        default:
          return 'border-l-gray-300 bg-gray-50';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'completed':
          return 'Completed';
        case 'upcoming':
          return 'Upcoming';
        case 'overdue':
          return 'Overdue';
        case 'due':
          return 'Due';
        default:
          return 'Not Due';
      }
    };

    const isCompleted = status === 'completed';
    const isUpcomingOrDue = status === 'upcoming' || status === 'due';
    const effectsLabel = isCompleted ? 'Effects' : 'Possible Effects';

    return (
      <div className={`border-l-4 rounded-r-xl p-4 mb-4 shadow-sm transition-all duration-300 hover:shadow-md ${getStatusColor(status)}`}>
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">{vaccine}</h4>
          <div className="text-xs text-gray-600 mb-1">
            <span className="font-medium">Age:</span> {age}
          </div>
          {isCompleted && vaccinationDate && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Vaccination Date:</span> {vaccinationDate}
            </div>
          )}
          {!isCompleted && dueDate && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Due:</span> {dueDate}
            </div>
          )}
          {batchNo && isCompleted && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">Batch:</span> {batchNo}
            </div>
          )}
          {bcgScar !== undefined && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">BCG Scar:</span> {bcgScar ? 'Present' : 'Not Present'}
            </div>
          )}
          {adverseEffects && (
            <div className="text-xs text-gray-600 mb-1">
              <span className="font-medium">{effectsLabel}:</span> {adverseEffects}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            status === 'overdue' ? 'bg-red-100 text-red-800' :
            status === 'due' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {getStatusText(status)}
          </span>
          {showScheduleButton && (
            <button
              onClick={() => onSchedule && onSchedule(vaccine)}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Request Appointment
            </button>
          )}
        </div>
      </div>
    );
  };

  const immunizationSchedule = [
    {
      vaccine: 'B.C.G (Bacillus Calmette-Guérin)',
      age: 'At birth',
      status: 'completed',
      vaccinationDate: 'January 15, 2025',
      dueDate: 'January 15, 2025',
      batchNo: 'BCG-2025-001',
      adverseEffects: 'Mild swelling at injection site',
      bcgScar: true
    },
    {
      vaccine: 'B.C.G Second Dose',
      age: 'At birth',
      status: 'due',
      dueDate: 'February 15, 2025',
      adverseEffects: 'None reported',
      bcgScar: undefined
    },
    {
      vaccine: 'Pentavalent 1 + OPV 1',
      age: '2 months completed',
      status: 'upcoming',
      dueDate: 'March 15, 2025',
      adverseEffects: 'Fever, mild fussiness',
      bcgScar: undefined
    },
    {
      vaccine: 'Pentavalent 2 + OPV 2 + IPV',
      age: '4 months completed',
      status: 'upcoming',
      dueDate: 'May 15, 2025',
      adverseEffects: 'Soreness at injection site',
      bcgScar: undefined
    },
    {
      vaccine: 'Pentavalent 3 + OPV 3',
      age: '6 months completed',
      status: 'upcoming',
      dueDate: 'July 15, 2025',
      adverseEffects: 'Low-grade fever',
      bcgScar: undefined
    },
    {
      vaccine: 'MMR 1 (Measles, Mumps, Rubella)',
      age: '9 months completed',
      status: 'upcoming',
      dueDate: 'October 15, 2025',
      adverseEffects: 'Rash, fever',
      bcgScar: undefined
    },
    {
      vaccine: 'Live JE (Japanese Encephalitis)',
      age: '12 months completed',
      status: 'upcoming',
      dueDate: 'January 15, 2026',
      adverseEffects: 'Headache, fever',
      bcgScar: undefined
    },
    {
      vaccine: 'DPT + OPV 4',
      age: '18 months completed',
      status: 'upcoming',
      dueDate: 'July 15, 2026',
      adverseEffects: 'Soreness, fever',
      bcgScar: undefined
    },
    {
      vaccine: 'MMR 2 (Measles, Mumps, Rubella)',
      age: '3 years completed',
      status: 'upcoming',
      dueDate: 'January 15, 2028',
      adverseEffects: 'Mild rash',
      bcgScar: undefined
    },
    {
      vaccine: 'D.T + OPV 5',
      age: '5 years completed',
      status: 'upcoming',
      dueDate: 'January 15, 2030',
      adverseEffects: 'Soreness at injection site',
      bcgScar: undefined
    },
    {
      vaccine: 'Adult Tetanus & Diphtheria',
      age: '11 years completed',
      status: 'upcoming',
      dueDate: 'January 15, 2036',
      adverseEffects: 'Soreness, mild fever',
      bcgScar: undefined
    }
  ];

  // Sample data for the main content area
  const upcomingImmunizations = [
    {
      vaccine: 'Pentavalent 1 + OPV 1',
      dueDate: 'March 15, 2025',
      lastGiven: 'Not given yet',
      recommendation: '2 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'Pentavalent 2 + OPV 2 + IPV',
      dueDate: 'May 15, 2025',
      lastGiven: 'Not given yet',
      recommendation: '4 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'Pentavalent 3 + OPV 3',
      dueDate: 'July 15, 2025',
      lastGiven: 'Not given yet',
      recommendation: '6 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'MMR 1 (Measles, Mumps, Rubella)',
      dueDate: 'October 15, 2025',
      lastGiven: 'Not given yet',
      recommendation: '9 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'Live JE (Japanese Encephalitis)',
      dueDate: 'January 15, 2026',
      lastGiven: 'Not given yet',
      recommendation: '12 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'DPT + OPV 4',
      dueDate: 'July 15, 2026',
      lastGiven: 'Not given yet',
      recommendation: '18 months completed',
      status: 'upcoming'
    },
    {
      vaccine: 'MMR 2 (Measles, Mumps, Rubella)',
      dueDate: 'January 15, 2028',
      lastGiven: 'Not given yet',
      recommendation: '3 years completed',
      status: 'upcoming'
    },
    {
      vaccine: 'D.T + OPV 5',
      dueDate: 'January 15, 2030',
      lastGiven: 'Not given yet',
      recommendation: '5 years completed',
      status: 'upcoming'
    },
    {
      vaccine: 'Adult Tetanus & Diphtheria',
      dueDate: 'January 15, 2036',
      lastGiven: 'Not given yet',
      recommendation: '11 years completed',
      status: 'upcoming'
    }
  ];

  const missedImmunizations = [
    {
      vaccine: 'B.C.G Second Dose',
      dueDate: 'February 15, 2025',
      lastGiven: 'Not given yet',
      recommendation: 'At birth',
      status: 'missed'
    }
  ];

  const completedImmunizations = [
    {
      vaccine: 'B.C.G (Bacillus Calmette-Guérin)',
      dueDate: 'January 15, 2025',
      lastGiven: 'January 15, 2025',
      recommendation: 'At birth',
      status: 'completed'
    }
  ];

  const renderTabContent = () => {
    // Use static data as fallback when API data is empty
    const staticData = {
      upcoming: upcomingImmunizations,
      missed: missedImmunizations,
      completed: completedImmunizations
    };
    
    // Use API data if available and not empty, otherwise use static data
    const apiData = vaccinationData[activeTab] || [];
    const data = apiData.length > 0 ? apiData : staticData[activeTab] || [];
    
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No {activeTab} vaccinations found.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {data.map((immunization, index) => (
          <ImmunizationCard
            key={index}
            vaccine={immunization.vaccine}
            dueDate={immunization.formattedDueDate || immunization.dueDate}
            lastGiven={immunization.lastGiven}
            recommendation={immunization.recommendation}
            status={immunization.status}
            onSchedule={handleScheduleAppointment}
            showScheduleButton={activeTab !== 'completed'}
          />
        ))}
      </div>
    );
  };

  const handleScheduleAppointment = async (vaccineName) => {
    try {
      setIsLoading(true);

      // Instead of auto-creating a request, set intent for the Appointments page to
      // open the clinic visit form on Baby tab with Vaccinations category selected.
      sessionStorage.setItem('clinicRequestIntent', JSON.stringify({
        openClinicRequestModal: true,
        clinicTab: 'baby',
        clinicCategory: 'Vaccinations',
        source: 'vaccinationsPage',
        vaccineName
      }));

      // Redirect to appointments page
      navigate('/mom/appointments');
    } catch (error) {
      console.error('Error preparing appointment request:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load vaccination data on component mount
  useEffect(() => {
    const loadVaccinationData = async () => {
      try {
        setIsLoading(true);
        const response = await vaccinationAPI.getAll();
        
        if (response.status === 'success' && response.data && response.data.length > 0) {
          const vaccinations = response.data;
          
          // Categorize vaccinations by status
          const upcoming = vaccinations.filter(v => v.status === 'upcoming');
          const missed = vaccinations.filter(v => v.status === 'missed' || v.status === 'due');
          const completed = vaccinations.filter(v => v.status === 'completed');
          
          setVaccinationData({
            upcoming,
            missed,
            completed
          });
        } else {
          // If API returns empty data, use static data
          console.log('API returned empty data, using static data');
          setVaccinationData({
            upcoming: upcomingImmunizations,
            missed: missedImmunizations,
            completed: completedImmunizations
          });
        }
      } catch (error) {
        console.error('Error loading vaccination data:', error);
        // If API fails, use the static data
        setVaccinationData({
          upcoming: upcomingImmunizations,
          missed: missedImmunizations,
          completed: completedImmunizations
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVaccinationData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-5">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="vaccination-header">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Syringe className="text-grey-800" size={32} />
              Vaccination and Immunization Tracker
            </h1>
            <p className="text-lg opacity-90 mb-5">
              Keep your baby's immunizations on track with smart reminders and progress monitoring. Total Vaccinations and Immunizations count is showing below.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
              <div onClick={() => handleStatCardClick('completed')} style={{cursor: 'pointer'}}>
                <StatCard number="1" label="Completed" />
              </div>
              <div onClick={() => handleStatCardClick('upcoming')} style={{cursor: 'pointer'}}>
                <StatCard number="8" label="Upcoming" />
              </div>
              <div onClick={() => handleStatCardClick('overdue')} style={{cursor: 'pointer'}}>
                <StatCard number="0" label="Overdue" />
              </div>
              <div onClick={() => handleStatCardClick('progress')} style={{cursor: 'pointer'}}>
                <StatCard number="9%" label="Progress" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - 70% Left Side */}
        <div className="flex">
          <div className="w-[70%] p-8">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`pb-2 px-1 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'upcoming'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Upcoming Immunizations
                </button>
                <button
                  onClick={() => setActiveTab('missed')}
                  className={`pb-2 px-1 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'missed'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Missed Immunizations
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`pb-2 px-1 font-medium text-sm transition-colors duration-200 ${
                    activeTab === 'completed'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Completed Immunizations
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6">
              {renderTabContent()}
            </div>

            {/* Add New Record Button */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Add New Record
              </button>
            </div>
          </div>

          {/* Timeline Sidebar - 30% Right Side */}
          <div className="w-[30%] bg-gradient-to-br from-slate-50 to-blue-50 p-6 border-l border-gray-200">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center text-white text-sm">
                  🗓️
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Immunization Timeline</h3>
              </div>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {immunizationSchedule.map((immunization, index) => (
                <TimelineCard
                  key={index}
                  vaccine={immunization.vaccine}
                  age={immunization.age}
                  status={immunization.status}
                  dueDate={immunization.dueDate}
                  vaccinationDate={immunization.vaccinationDate}
                  batchNo={immunization.batchNo}
                  adverseEffects={immunization.adverseEffects}
                  bcgScar={immunization.bcgScar}
                  onSchedule={handleScheduleAppointment}
                  showScheduleButton={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;