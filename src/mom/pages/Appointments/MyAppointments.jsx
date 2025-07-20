// MommyCare/src/mom/pages/Appointments/MyAppointments.jsx
import React, { useState } from 'react';
import './MyAppointments.css';

const AppointmentsDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('July 2025');
  
  const statsData = [
    { number: 3, label: 'Upcoming Appointments', color: 'text-blue-500' },
    { number: 2, label: 'Missed Appointments', color: 'text-red-500' },
    { number: 8, label: 'Completed This Month', color: 'text-green-500' }
  ];

  const clinicServices = [
    { icon: '⚖️', name: 'Mom Weight Check' },
    { icon: '👶', name: 'Baby Weight Check' },
    { icon: '🔍', name: 'Ultrasound Scan' },
    { icon: '🩸', name: 'Blood Tests' },
    { icon: '💉', name: 'Vaccinations' },
    { icon: '🩺', name: 'General Checkup' }
  ];

  const doctorServices = [
    { icon: '👩‍⚕️', name: 'Gynecologist' },
    { icon: '👨‍⚕️', name: 'Pediatrician' },
    { icon: '🥗', name: 'Nutritionist' },
    { icon: '🧠', name: 'Mental Health' },
    { icon: '🤱', name: 'Lactation Consultant' },
    { icon: '🚨', name: 'Emergency' }
  ];

  // Calendar data for July 2025
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null]
  ];

  // Appointment dates - consistent with upcoming and missed appointments
  const appointmentDates = {
    10: 'missed', // July 10 - missed
    15: 'missed', // July 15 - missed
    22: 'upcoming', // July 22 - upcoming
    25: 'upcoming', // July 25 - upcoming
    28: 'upcoming'  // July 28 - upcoming
  };

  const upcomingAppointments = [
    {
      id: 1,
      type: 'Gynecologist Checkup',
      date: 'July 22, 10:00 AM',
      icon: '👩‍⚕️',
      color: 'bg-pink-100'
    },
    {
      id: 2,
      type: 'Baby Weight Check',
      date: 'July 25, 2:30 PM',
      icon: '👶',
      color: 'bg-yellow-100'
    },
    {
      id: 3,
      type: 'Ultrasound Scan',
      date: 'July 28, 9:00 AM',
      icon: '🔍',
      color: 'bg-purple-100'
    }
  ];

  const missedAppointments = [
    {
      id: 1,
      type: 'Baby Vaccination',
      date: 'July 10, 3:00 PM',
      icon: '💉',
      action: 'Click to reschedule'
    },
    {
      id: 2,
      type: 'Blood Test',
      date: 'July 15, 11:00 AM',
      icon: '🩸',
      action: 'Click to reschedule'
    }
  ];

  const healthReminders = [
    {
      id: 1,
      type: 'Take Prenatal Vitamins',
      frequency: 'Daily • 8:00 AM',
      icon: '💊',
      color: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'Weight Monitoring',
      frequency: 'Weekly • Sundays',
      icon: '⚖️',
      color: 'bg-cyan-100'
    },
    {
      id: 3,
      type: 'Blood Pressure Check',
      frequency: 'Monthly • 1st of month',
      icon: '❤️',
      color: 'bg-red-100'
    },
    {
      id: 4,
      type: 'Drink Plenty of Water',
      frequency: 'Daily • After meals',
      icon: '💧',
      color: 'bg-cyan-100'
    }
  ];

  const navigateMonth = (direction) => {
    // Month navigation logic would go here
    console.log(`Navigate ${direction}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          My Appointments
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Clinic Visits Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-pink-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-pink-500 text-xl">🏥</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Clinic Visits</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {clinicServices.map((service, index) => (
                <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <span className="text-sm text-gray-700 text-center">{service.name}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-full transition-colors">
              Request Clinic Visit
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Hospital will confirm your appointment
            </p>
          </div>

          {/* Doctor Consultations Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-pink-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-cyan-500 text-xl">👨‍⚕️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Doctor Consultations</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {doctorServices.map((service, index) => (
                <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent">
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <span className="text-sm text-gray-700 text-center">{service.name}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-full transition-colors">
              Request Doctor Visit
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Doctor will confirm your appointment
            </p>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-blue-500 text-xl mr-2">📅</span>
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentMonth}
                </span>
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="w-8 h-8 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center"
                >
                  <span className="text-pink-500">‹</span>
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="w-8 h-8 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center"
                >
                  <span className="text-pink-500">›</span>
                </button>
              </div>
            </div>

            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-2 bg-gray-50 rounded">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="space-y-1">
              {calendarDays.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => {
                    if (day === null) {
                      return <div key={dayIndex} className="p-2"></div>;
                    }
                    
                    const appointmentType = appointmentDates[day];
                    let dayClass = "p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer transition-colors";
                    
                    // Today is July 20, 2025 - highlight in pink
                    if (day === 20) {
                      dayClass += " bg-pink-400 text-white font-bold";
                    } else if (appointmentType === 'missed') {
                      dayClass += " bg-red-100 text-red-600 font-medium";
                    } else if (appointmentType === 'upcoming') {
                      dayClass += " border-2 border-blue-400 text-blue-600 font-medium";
                    }
                    
                    return (
                      <div key={dayIndex} className={dayClass}>
                        {day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments and Reminders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-yellow-500 text-lg mr-2">⚡</span>
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className={`w-10 h-10 ${appointment.color} rounded-full flex items-center justify-center mr-3`}>
                    <span>{appointment.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{appointment.type}</div>
                    <div className="text-gray-600 text-xs">{appointment.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missed Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-red-500 text-lg mr-2">✕</span>
              <h3 className="text-lg font-semibold text-gray-800">Missed Appointments</h3>
            </div>
            <div className="space-y-3">
              {missedAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-red-400">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span>{appointment.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{appointment.type}</div>
                    <div className="text-gray-600 text-xs">{appointment.date}</div>
                    <button className="text-red-500 text-xs hover:underline mt-1">
                      {appointment.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center text-orange-600 text-xs">
                <span className="mr-2">⚠️</span>
                Please reschedule missed appointments soon
              </div>
            </div>
          </div>

          {/* Health Reminders */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <span className="text-blue-500 text-lg mr-2">🔔</span>
              <h3 className="text-lg font-semibold text-gray-800">Health Reminders</h3>
            </div>
            <div className="space-y-3">
              {healthReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center p-3 rounded-lg border-l-4 border-blue-400">
                  <div className={`w-10 h-10 ${reminder.color} rounded-full flex items-center justify-center mr-3`}>
                    <span>{reminder.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{reminder.type}</div>
                    <div className="text-gray-600 text-xs">{reminder.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;