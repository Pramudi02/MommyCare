import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, MoreHorizontal, Bell, Share, FileText } from 'lucide-react';
import './VaccinationSchedule.css';


const VaccinationDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeImmunizationTab, setActiveImmunizationTab] = useState('upcoming');

  const vaccinationData = {
    upcoming: [
      {
        name: 'MMR (Measles, Mumps, Rubella)',
        doseType: 'First Dose',
        age: '12-15 months',
        dueDate: 'June 19, 2025',
        daysRemaining: '6 days',
        status: 'upcoming'
      },
      {
        name: 'Varicella (Chickenpox)',
        doseType: '',
        age: '12-15 months',
        dueDate: 'June 25, 2025',
        daysRemaining: '16 days',
        status: 'upcoming'
      },
      {
        name: 'Hepatitis A',
        doseType: 'First Dose',
        age: '12-23 months',
        dueDate: 'July 19, 2025',
        daysRemaining: '31 days',
        status: 'upcoming'
      }
    ],
    missed: [
      {
        name: 'Missed Vaccines',
        count: 1
      }
    ],
    completed: [
      {
        name: 'Completed Vaccines',
        count: 8
      }
    ]
  };

  const immunizationData = {
    upcoming: [
      {
        name: 'Influenza (Flu Shot)',
        type: 'Annual Immunization',
        recommendation: 'Annually',
        dueDate: 'September 1, 2025',
        lastGiven: 'September 2024',
        status: 'due-soon'
      },
      {
        name: 'COVID-19 Booster',
        type: 'Booster Dose',
        recommendation: 'As needed',
        dueDate: 'August 15, 2025',
        lastGiven: 'February 2025',
        status: 'upcoming'
      }
    ],
    missed: [],
    completed: [
      {
        name: 'Varicella (Chickenpox)',
        givenDate: 'April 15, 2025',
        ageGiven: '11 months',
        provider: 'Dr. Perera',
        claimNumber: 'VAR-2025-04'
      },
      {
        name: 'DPT (Diphtheria, Pertussis, Tetanus) - Booster',
        givenDate: 'March 10, 2025',
        ageGiven: '9 months',
        provider: 'MCH Clinic - Colombo',
        nextDue: '5 years'
      }
    ]
  };

  const timelineData = [
    {
      vaccine: 'MMR (Measles, Mumps, Rubella)',
      dueDate: 'May 15, 2025',
      age: '12 months',
      location: 'Left arm',
      daysOverdue: '25 days',
      status: 'overdue'
    },
    {
      vaccine: 'Hepatitis A',
      dueDate: 'June 20, 2025',
      age: '15 months',
      location: 'Right arm',
      daysUntil: '11 days',
      status: 'due-soon'
    },
    {
      vaccine: 'Varicella (Chickenpox)',
      givenDate: 'April 15, 2025',
      ageGiven: '11 months',
      provider: 'Dr. Perera',
      claimNumber: 'VAR-2025-04',
      status: 'completed'
    },
    {
      vaccine: 'DPT (Diphtheria, Pertussis, Tetanus) - Booster',
      givenDate: 'March 10, 2025',
      ageGiven: '9 months',
      provider: 'MCH Clinic - Colombo',
      nextDue: '5 years',
      status: 'completed'
    }
  ];

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      overdue: 'bg-red-100 text-red-800',
      'due-soon': 'bg-yellow-100 text-yellow-800',
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    const statusText = {
      overdue: 'Overdue',
      'due-soon': 'Due Soon',
      upcoming: 'Upcoming',
      completed: 'Completed'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const VaccineCard = ({ vaccine, showButtons = true }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{vaccine.name}</h3>
        {vaccine.status && <StatusBadge status={vaccine.status} />}
      </div>
      
      {vaccine.doseType && (
        <p className="text-sm text-gray-600 mb-1">{vaccine.doseType}</p>
      )}
      
      <div className="text-sm text-gray-500 space-y-1">
        {vaccine.age && <p>Recommended Age: <span className="text-gray-700">{vaccine.age}</span></p>}
        {vaccine.dueDate && <p>Due Date: <span className="text-gray-700">{vaccine.dueDate}</span></p>}
        {vaccine.daysRemaining && <p>Days Remaining: <span className="text-gray-700">{vaccine.daysRemaining}</span></p>}
        {vaccine.lastGiven && <p>Last Given: <span className="text-gray-700">{vaccine.lastGiven}</span></p>}
        {vaccine.recommendation && <p>Recommendation: <span className="text-gray-700">{vaccine.recommendation}</span></p>}
      </div>

      {showButtons && (
        <div className="flex gap-2 mt-3">
          <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
            <MoreHorizontal size={16} />
            More Info
          </button>
          <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
            Schedule Appointment
          </button>
        </div>
      )}
    </div>
  );

  const TimelineItem = ({ item, isLast }) => (
    <div className="flex items-start gap-4 mb-6">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${
          item.status === 'overdue' ? 'bg-red-500' : 
          item.status === 'due-soon' ? 'bg-yellow-500' : 
          item.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
        }`} />
        {!isLast && <div className="w-px h-16 bg-gray-300 mt-2" />}
      </div>
      
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900">{item.vaccine}</h4>
          <StatusBadge status={item.status} />
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          {item.dueDate && (
            <p>Due Date: <span className="text-gray-800">{item.dueDate}</span></p>
          )}
          {item.givenDate && (
            <p>Given Date: <span className="text-gray-800">{item.givenDate}</span></p>
          )}
          {item.age && (
            <p>Age: <span className="text-gray-800">{item.age}</span></p>
          )}
          {item.ageGiven && (
            <p>Age Given: <span className="text-gray-800">{item.ageGiven}</span></p>
          )}
          {item.location && (
            <p>Location: <span className="text-gray-800">{item.location}</span></p>
          )}
          {item.provider && (
            <p>Healthcare Provider: <span className="text-gray-800">{item.provider}</span></p>
          )}
          {item.daysOverdue && (
            <p>Days Overdue: <span className="text-red-600 font-medium">{item.daysOverdue}</span></p>
          )}
          {item.daysUntil && (
            <p>Days Until: <span className="text-gray-800">{item.daysUntil}</span></p>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {item.status !== 'completed' ? (
            <>
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                Schedule Now
              </button>
              <button className="text-blue-600 text-sm font-medium">
                Mark as Given
              </button>
            </>
          ) : (
            <>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                <FileText size={14} />
                View Certificate
              </button>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1">
                <Share size={14} />
                Share with Doctor
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Health Dashboard</h1>
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Vaccinations Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus size={20} />
                Vaccinations
              </h2>
            </div>

            {/* Statistics Cards */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">UPCOMING</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600">MISSED</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">COMPLETED</div>
              </div>
            </div>

            {/* Vaccination Tabs */}
            <div className="px-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['upcoming', 'missed', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab} Vaccines
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-4">
                {activeTab === 'upcoming' && (
                  <div className="space-y-3">
                    {vaccinationData.upcoming.map((vaccine, index) => (
                      <VaccineCard key={index} vaccine={vaccine} />
                    ))}
                  </div>
                )}
                {activeTab === 'missed' && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                    <p>1 missed vaccination found</p>
                  </div>
                )}
                {activeTab === 'completed' && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                    <p>8 completed vaccinations</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Immunizations Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus size={20} />
                Immunizations
              </h2>
            </div>

            {/* Immunization Statistics */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <div className="text-sm text-gray-600">UPCOMING</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-gray-600">MISSED</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">COMPLETED</div>
              </div>
            </div>

            {/* Immunization Tabs */}
            <div className="px-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['upcoming', 'missed', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveImmunizationTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeImmunizationTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab} Immunizations
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-4">
                {activeImmunizationTab === 'upcoming' && (
                  <div className="space-y-3">
                    {immunizationData.upcoming.map((vaccine, index) => (
                      <VaccineCard key={index} vaccine={vaccine} />
                    ))}
                  </div>
                )}
                {activeImmunizationTab === 'completed' && (
                  <div className="space-y-3">
                    {immunizationData.completed.map((vaccine, index) => (
                      <VaccineCard key={index} vaccine={vaccine} showButtons={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

              {/* Common Childhood Vaccines */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Common Childhood Vaccines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Polio Vaccine */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                  <div className="text-white text-xs font-medium">💧</div>
                  <span className="absolute mt-8 text-xs text-white bg-blue-500 px-2 py-1 rounded">Oral</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Polio Vaccine</h4>
                <p className="text-sm text-gray-600 mb-3">Protects against poliomyelitis</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  2, 4, 6 months
                </div>
              </div>

              {/* DPT Vaccine */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto relative">
                  <div className="text-white text-lg">💉</div>
                  <span className="absolute mt-8 text-xs text-white bg-purple-500 px-2 py-1 rounded">Injection</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">DPT Vaccine</h4>
                <p className="text-sm text-gray-600 mb-3">Diphtheria, Pertussis, Tetanus</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  2, 4, 6 months
                </div>
              </div>

              {/* Hepatitis B */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto relative">
                  <div className="text-white text-lg">🔬</div>
                  <span className="absolute mt-8 text-xs text-white bg-purple-500 px-2 py-1 rounded">Injection</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Hepatitis B</h4>
                <p className="text-sm text-gray-600 mb-3">Protects liver from infection</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  Birth, 2, 6 months
                </div>
              </div>

              {/* MMR Vaccine */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto relative">
                  <div className="text-white text-lg">🦠</div>
                  <span className="absolute mt-8 text-xs text-white bg-purple-500 px-2 py-1 rounded">Injection</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">MMR Vaccine</h4>
                <p className="text-sm text-gray-600 mb-3">Measles, Mumps, Rubella</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  12-15 months
                </div>
              </div>

              {/* Pneumococcal */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto relative">
                  <div className="text-white text-lg">🫁</div>
                  <span className="absolute mt-8 text-xs text-white bg-purple-500 px-2 py-1 rounded">Injection</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Pneumococcal</h4>
                <p className="text-sm text-gray-600 mb-3">Prevents pneumonia & meningitis</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  2, 4, 6, 12 months
                </div>
              </div>

              {/* Varicella */}
              <div className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-3 mx-auto relative">
                  <div className="text-white text-lg">🌟</div>
                  <span className="absolute mt-8 text-xs text-white bg-purple-500 px-2 py-1 rounded">Injection</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Varicella</h4>
                <p className="text-sm text-gray-600 mb-3">Chickenpox protection</p>
                <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full inline-block">
                  12-18 months
                </div>
              </div>

            </div>
          </div>
        </div>


        {/* Sidebar - Vaccination Timeline */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <Calendar size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vaccination Timeline</h3>
            </div>
            
            <div className="p-4">
              {timelineData.map((item, index) => (
                <TimelineItem 
                  key={index} 
                  item={item} 
                  isLast={index === timelineData.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationDashboard;