// MommyCare/src/mom/pages/Appointments/MyAppointments.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Stethoscope,
  Baby,
  Activity,
  Syringe,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  X,
  Bell,
  Weight,
  Hospital,
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Plus,
  UserCheck
} from 'lucide-react';
import './MyAppointments.css';

const AppointmentsDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('July 2025');
  const statsData = [
    { number: 3, label: 'Upcoming Appointments', color: 'text-blue-500', icon: <Calendar size={28} className="text-blue-400 mb-1" /> },
    { number: 2, label: 'Missed Appointments', color: 'text-red-500', icon: <X size={28} className="text-red-400 mb-1" /> },
    { number: 8, label: 'Completed This Month', color: 'text-green-500', icon: <CheckCircle size={28} className="text-green-400 mb-1" /> }
  ];
  const clinicServices = [
    { icon: <Weight size={22} className="text-pink-400" />, name: 'Mom Weight Check' },
    { icon: <Baby size={22} className="text-pink-400" />, name: 'Baby Weight Check' },
    { icon: <Activity size={22} className="text-pink-400" />, name: 'Ultrasound Scan' },
    { icon: <Syringe size={22} className="text-pink-400" />, name: 'Blood Tests' },
    { icon: <Syringe size={22} className="text-pink-400" />, name: 'Vaccinations' },
    { icon: <Stethoscope size={22} className="text-pink-400" />, name: 'General Checkup' }
  ];
  const doctorServices = [
    { icon: <Stethoscope size={22} className="text-cyan-400" />, name: 'Gynecologist' },
    { icon: <Baby size={22} className="text-cyan-400" />, name: 'Pediatrician' },
    { icon: <ClipboardList size={22} className="text-cyan-400" />, name: 'Nutritionist' },
    { icon: <HeartPulse size={22} className="text-cyan-400" />, name: 'Mental Health' },
    { icon: <UserCheck size={22} className="text-cyan-400" />, name: 'Lactation Consultant' },
    { icon: <AlertTriangle size={22} className="text-cyan-400" />, name: 'Emergency' }
  ];
  const appointmentDates = {
    10: 'missed',
    15: 'missed',
    22: 'upcoming',
    25: 'upcoming',
    28: 'upcoming'
  };
  const upcomingAppointments = [
    {
      id: 1,
      type: 'Gynecologist Checkup',
      date: 'July 22, 10:00 AM',
      icon: <Stethoscope size={20} className="text-pink-400" />,
      color: 'bg-pink-100'
    },
    {
      id: 2,
      type: 'Baby Weight Check',
      date: 'July 25, 2:30 PM',
      icon: <Baby size={20} className="text-yellow-400" />,
      color: 'bg-yellow-100'
    },
    {
      id: 3,
      type: 'Ultrasound Scan',
      date: 'July 28, 9:00 AM',
      icon: <Activity size={20} className="text-purple-400" />,
      color: 'bg-purple-100'
    }
  ];
  const missedAppointments = [
    {
      id: 1,
      type: 'Baby Vaccination',
      date: 'July 10, 3:00 PM',
      icon: <Syringe size={20} className="text-red-400" />,
      action: 'Click to reschedule'
    },
    {
      id: 2,
      type: 'Blood Test',
      date: 'July 15, 11:00 AM',
      icon: <Syringe size={20} className="text-red-400" />,
      action: 'Click to reschedule'
    }
  ];
  const healthReminders = [
    {
      id: 1,
      type: 'Take Prenatal Vitamins',
      frequency: 'Daily • 8:00 AM',
      icon: <Activity size={20} className="text-blue-400" />,
      color: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'Weight Monitoring',
      frequency: 'Weekly • Sundays',
      icon: <Weight size={20} className="text-cyan-400" />,
      color: 'bg-cyan-100'
    },
    {
      id: 3,
      type: 'Blood Pressure Check',
      frequency: 'Monthly • 1st of month',
      icon: <HeartPulse size={20} className="text-red-400" />,
      color: 'bg-red-100'
    },
    {
      id: 4,
      type: 'Drink Plenty of Water',
      frequency: 'Daily • After meals',
      icon: <Bell size={20} className="text-cyan-400" />,
      color: 'bg-cyan-100'
    }
  ];
  const navigateMonth = (direction) => {
    // Month navigation logic would go here
    console.log(`Navigate ${direction}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          <Calendar className="inline-block text-pink-400 mr-2" size={32} /> My Appointments
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              {stat.icon}
              <div className="text-gray-600 text-xl">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
            </div>
          ))}
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Clinic Visits Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-100  rounded-full flex items-center justify-center mr-3">
                <Hospital className="text-pink-400" size={28} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Clinic Visits</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {clinicServices.map((service, index) => (
                <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg border-2 border-pink-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="mb-2">{service.icon}</div>
                  <span className="text-sm text-gray-700 text-center">{service.name}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-full transition-colors">
              <Plus className="inline-block mr-2" size={18} /> Request Clinic Visit
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Hospital will confirm your appointment
            </p>
          </div>
          {/* Doctor Consultations Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                <UserCheck className="text-cyan-400" size={28} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Doctor Consultations</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {doctorServices.map((service, index) => (
                <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border-2 border-cyan-200">
                  <div className="mb-2">{service.icon}</div>
                  <span className="text-sm text-gray-700 text-center">{service.name}</span>
                </div>
              ))}
            </div>
            <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 rounded-full transition-colors">
              <Plus className="inline-block mr-2" size={18} /> Request Doctor Visit
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Doctor will confirm your appointment
            </p>
          </div>
          {/* Calendar Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="text-blue-400 mr-2" size={24} />
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
                  <ArrowLeft className="text-pink-500" size={18} />
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="w-8 h-8 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center"
                >
                  <ArrowRight className="text-pink-500" size={18} />
                </button>
              </div>
            </div>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 p-2 bg-gray-50 rounded">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Days */}
            <div className="space-y-1">
              {[
                [null, null, 1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10, 11, 12],
                [13, 14, 15, 16, 17, 18, 19],
                [20, 21, 22, 23, 24, 25, 26],
                [27, 28, 29, 30, 31, null, null]
              ].map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => {
                    if (day === null) {
                      return <div key={dayIndex} className="p-2"></div>;
                    }
                    const appointmentType = appointmentDates[day];
                    let dayClass = "p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer transition-colors";
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-yellow-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-yellow-400 bg-white/90">
                  <div className={`w-10 h-10 ${appointment.color} rounded-full flex items-center justify-center mr-3`}>
                    {appointment.icon}
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <X className="text-red-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Missed Appointments</h3>
            </div>
            <div className="space-y-3">
              {missedAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-red-400 bg-white/90">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    {appointment.icon}
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
                <AlertTriangle className="mr-2" size={16} />
                Please reschedule missed appointments soon
              </div>
            </div>
          </div>
          {/* Health Reminders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Bell className="text-blue-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Health Reminders</h3>
            </div>
            <div className="space-y-3">
              {healthReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center p-3 rounded-lg border-l-4 border-blue-400 bg-white/90">
                  <div className={`w-10 h-10 ${reminder.color} rounded-full flex items-center justify-center mr-3`}>
                    {reminder.icon}
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