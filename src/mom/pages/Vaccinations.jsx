import React, { useState } from 'react';
import { Calendar, Bell, FileText, BarChart3, Syringe, Shield, Clock, MapPin, User, Hash } from 'lucide-react';
import './Vaccination.css';
import { useNavigate } from 'react-router-dom';

const Vaccinations= () => {
  const [notifications, setNotifications] = useState(2);
  const navigate = useNavigate();

  const handleStatCardClick = (tab) => {
    navigate('/mom/vaccinationschedule', { state: { tab } });
  };

  const handleActionClick = (action) => {
    alert(`Opening: ${action}`);
  };

  const handleButtonClick = (e, originalText, button) => {
    e.stopPropagation();
    button.textContent = 'Done!';
    button.className = button.className.replace(/bg-\w+-\d+/, 'bg-green-500');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.className = button.className.replace('bg-green-500', 'bg-gradient-to-r from-indigo-500 to-purple-600');
    }, 1500);
  };

  const StatCard = ({ number, label }) => (
    <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );

  const ActionCard = ({ icon: Icon, title, desc, hasNotification = false, onClick }) => (
    <div 
      className="bg-white rounded-xl p-5 text-center shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-indigo-500 relative"
      onClick={() => onClick(title)}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
        <Icon size={20} />
      </div>
      <div className="font-semibold mb-2 text-gray-800">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
      {hasNotification && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
          {notifications}
        </div>
      )}
    </div>
  );

  const VaccineButton = ({ children, variant = 'primary', onClick }) => {
    const baseClasses = "px-4 py-2 rounded-lg border-none cursor-pointer text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg";
    const variants = {
      primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white",
      secondary: "bg-gray-100 text-gray-700 border border-gray-300"
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]}`}
        onClick={(e) => onClick && onClick(e, children, e.target)}
      >
        {children}
      </button>
    );
  };

  const VaccineCard = ({ vaccine, status, dueDate, age, location, additionalInfo, additionalLabel, onButtonClick }) => {
    const statusConfig = {
      completed: {
        dotColor: 'bg-green-500',
        borderColor: 'border-l-green-500',
        statusBg: 'bg-green-100 text-green-800',
        statusText: 'Completed'
      },
      upcoming: {
        dotColor: 'bg-yellow-500',
        borderColor: 'border-l-yellow-500',
        statusBg: 'bg-yellow-100 text-yellow-800',
        statusText: 'Due Soon'
      },
      overdue: {
        dotColor: 'bg-red-500',
        borderColor: 'border-l-red-500',
        statusBg: 'bg-red-100 text-red-800',
        statusText: 'Overdue'
      }
    };

    const config = statusConfig[status];

    return (
      <div className="relative pl-20 mb-6 cursor-pointer transition-all duration-300 hover:translate-x-2 group">
        <div className={`absolute left-6 top-2 w-4 h-4 rounded-full border-4 border-white shadow-lg ${config.dotColor}`}></div>
        <div className={`bg-white rounded-xl p-5 shadow-lg border-l-4 ${config.borderColor} transition-all duration-300 group-hover:shadow-xl`}>
          <div className="flex justify-between items-start mb-3">
            <div className="font-semibold text-gray-800">{vaccine}</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.statusBg}`}>
              {config.statusText}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">{status === 'completed' ? 'Given Date' : 'Due Date'}</div>
              <div className="text-sm font-medium text-gray-700">{dueDate}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Age</div>
              <div className="text-sm font-medium text-gray-700">{age}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">{status === 'completed' ? 'Healthcare Provider' : 'Location'}</div>
              <div className="text-sm font-medium text-gray-700">{location}</div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">{additionalLabel}</div>
              <div className="text-sm font-medium text-gray-700">{additionalInfo}</div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {status === 'overdue' && (
              <>
                <VaccineButton variant="primary" onClick={onButtonClick}>Schedule Now</VaccineButton>
                <VaccineButton variant="secondary" onClick={onButtonClick}>Mark as Given</VaccineButton>
              </>
            )}
            {status === 'upcoming' && (
              <>
                <VaccineButton variant="primary" onClick={onButtonClick}>Schedule Appointment</VaccineButton>
                <VaccineButton variant="secondary" onClick={onButtonClick}>Set Reminder</VaccineButton>
              </>
            )}
            {status === 'completed' && (
              <>
                <VaccineButton variant="secondary" onClick={onButtonClick}>View Certificate</VaccineButton>
                <VaccineButton variant="secondary" onClick={onButtonClick}>Add Notes</VaccineButton>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const vaccineData = [
    {
      vaccine: 'MMR (Measles, Mumps, Rubella)',
      status: 'overdue',
      dueDate: 'May 15, 2025',
      age: '12 months',
      location: 'Left arm',
      additionalInfo: '25 days',
      additionalLabel: 'Days Overdue'
    },
    {
      vaccine: 'Hepatitis A',
      status: 'upcoming',
      dueDate: 'June 20, 2025',
      age: '15 months',
      location: 'Right arm',
      additionalInfo: '11 days',
      additionalLabel: 'Days Until'
    },
    {
      vaccine: 'Varicella (Chickenpox)',
      status: 'completed',
      dueDate: 'April 18, 2025',
      age: '11 months',
      location: 'Dr. Perera',
      additionalInfo: 'VAR-2025-04',
      additionalLabel: 'Batch Number'
    },
    {
      vaccine: 'DPT (Diphtheria, Pertussis, Tetanus) - Booster',
      status: 'completed',
      dueDate: 'March 10, 2025',
      age: '9 months',
      location: 'MOH Clinic - Colombo',
      additionalInfo: '5 years',
      additionalLabel: 'Next Due'
    }
  ];

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
              <Syringe className="text-white" size={32} />
              Vaccination an Immunization Tracker
            </h1>
            <p className="text-lg opacity-90 mb-5">
              Keep your baby's immunizations on track with smart reminders and progress monitoring. Total  Vaccinations and Immunizations count is showing below.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
              <div onClick={() => handleStatCardClick('completed')} style={{cursor: 'pointer'}}>
                <StatCard number="8" label="Completed" />
              </div>
              <div onClick={() => handleStatCardClick('upcoming')} style={{cursor: 'pointer'}}>
                <StatCard number="3" label="Upcoming" />
              </div>
              <div onClick={() => handleStatCardClick('overdue')} style={{cursor: 'pointer'}}>
                <StatCard number="1" label="Overdue" />
              </div>
              <div onClick={() => handleStatCardClick('progress')} style={{cursor: 'pointer'}}>
                <StatCard number="67%" label="Progress" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center text-white text-sm">
                ⚡
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard 
                icon={Calendar} 
                title="Schedule Appointment" 
                desc="Book next vaccination visit"
                onClick={handleActionClick}
              />
              <ActionCard 
                icon={FileText} 
                title="View Vaccination Card" 
                desc="Digital immunization record"
                onClick={handleActionClick}
              />
              <ActionCard 
                icon={Bell} 
                title="Set Reminders" 
                desc="Never miss a vaccination"
                hasNotification={true}
                onClick={handleActionClick}
              />
              <ActionCard 
                icon={BarChart3} 
                title="Progress Report" 
                desc="Vaccination timeline overview"
                onClick={handleActionClick}
              />
            </div>
          </div>

          {/* Vaccination Timeline */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center text-white text-sm">
                🗓️
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Vaccination Timeline</h2>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                
                {vaccineData.map((vaccine, index) => (
                  <VaccineCard
                    key={index}
                    vaccine={vaccine.vaccine}
                    status={vaccine.status}
                    dueDate={vaccine.dueDate}
                    age={vaccine.age}
                    location={vaccine.location}
                    additionalInfo={vaccine.additionalInfo}
                    additionalLabel={vaccine.additionalLabel}
                    onButtonClick={handleButtonClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;