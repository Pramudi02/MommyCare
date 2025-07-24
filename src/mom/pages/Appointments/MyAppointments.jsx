// MommyCare/src/mom/pages/Appointments/MyAppointments.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Scale, 
  Baby, 
  Search, 
  TestTube, 
  Syringe, 
  Stethoscope,
  UserCheck,
  User,
  Salad,
  Brain,
  Heart,
  AlertTriangle,
  Building2,
  Pill,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Bell,
  Clock
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
    { icon: Scale, name: 'Mom Weight Check' },
    { icon: Baby, name: 'Baby Weight Check' },
    { icon: Search, name: 'Ultrasound Scan' },
    { icon: TestTube, name: 'Blood Tests' },
    { icon: Syringe, name: 'Vaccinations' },
    { icon: Stethoscope, name: 'General Checkup' }
  ];
  const doctorServices = [
    { icon: UserCheck, name: 'Gynecologist' },
    { icon: User, name: 'Pediatrician' },
    { icon: Salad, name: 'Nutritionist' },
    { icon: Brain, name: 'Mental Health' },
    { icon: Baby, name: 'Lactation Consultant' },
    { icon: AlertTriangle, name: 'Emergency' }
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
      icon: UserCheck,
      color: 'bg-pink-100'
    },
    {
      id: 2,
      type: 'Baby Weight Check',
      date: 'July 25, 2:30 PM',
      icon: Baby,
      color: 'bg-yellow-100'
    },
    {
      id: 3,
      type: 'Ultrasound Scan',
      date: 'July 28, 9:00 AM',
      icon: Search,
      color: 'bg-purple-100'
    }
  ];
  const missedAppointments = [
    {
      id: 1,
      type: 'Baby Vaccination',
      date: 'July 10, 3:00 PM',
      icon: Syringe,
      action: 'Click to reschedule'
    },
    {
      id: 2,
      type: 'Blood Test',
      date: 'July 15, 11:00 AM',
      icon: TestTube,
      action: 'Click to reschedule'
    }
  ];
  const healthReminders = [
    {
      id: 1,
      type: 'Take Prenatal Vitamins',
      frequency: 'Daily • 8:00 AM',
      icon: Pill,
      color: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'Weight Monitoring',
      frequency: 'Weekly • Sundays',
      icon: Scale,
      color: 'bg-cyan-100'
    },
    {
      id: 3,
      type: 'Blood Pressure Check',
      frequency: 'Monthly • 1st of month',
      icon: Heart,
      color: 'bg-red-100'
    },
    {
      id: 4,
      type: 'Drink Plenty of Water',
      frequency: 'Daily • After meals',
      icon: Droplets,
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
        <div className="headerAppointments">
          <div className="headerAppointments-icon">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="headerAppointments-title">My Appointments</h1>
          <p className="headerAppointments-description">
            Manage your healthcare appointments, track your medical visits, and never miss an important checkup with smart reminders and scheduling.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid-appointments">
          <div className="stat-card-appointments stat-card-upcoming">
            <div className="stat-number-appointments text-blue-600">3</div>
            <div className="stat-label-appointments">Upcoming</div>
            <div className="stat-subtitle-appointments">Appointments</div>
          </div>
          <div className="stat-card-appointments stat-card-missed">
            <div className="stat-number-appointments text-red-600">2</div>
            <div className="stat-label-appointments">Missed</div>
            <div className="stat-subtitle-appointments">Appointments</div>
          </div>
          <div className="stat-card-appointments stat-card-completed">
            <div className="stat-number-appointments text-green-600">8</div>
            <div className="stat-label-appointments">Completed</div>
            <div className="stat-subtitle-appointments">This Month</div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Clinic Visits Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <Building2 className="text-pink-500 w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Clinic Visits</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {clinicServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent">
                    <div className="mb-2">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700 text-center">{service.name}</span>
                  </div>
                );
              })}
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
                <Stethoscope className="text-cyan-500 w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Doctor Consultations</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {doctorServices.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={index} className="service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent">
                    <div className="mb-2">
                      <IconComponent className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700 text-center">{service.name}</span>
                  </div>
                );
              })}
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
                <Calendar className="text-blue-500 w-6 h-6 mr-2" />
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
                  <ChevronLeft className="text-pink-500 w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="w-8 h-8 bg-pink-100 hover:bg-pink-200 rounded-full flex items-center justify-center"
                >
                  <ChevronRight className="text-pink-500 w-4 h-4" />
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Zap className="text-yellow-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const IconComponent = appointment.icon;
                return (
                  <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-yellow-400">
                    <div className={`w-10 h-10 ${appointment.color} rounded-full flex items-center justify-center mr-3`}>
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{appointment.type}</div>
                      <div className="text-gray-600 text-xs">{appointment.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Missed Appointments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <X className="text-red-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Missed Appointments</h3>
            </div>
            <div className="space-y-3">
              {missedAppointments.map((appointment) => {
                const IconComponent = appointment.icon;
                return (
                  <div key={appointment.id} className="flex items-center p-3 rounded-lg border-l-4 border-red-400">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{appointment.type}</div>
                      <div className="text-gray-600 text-xs">{appointment.date}</div>
                      <button className="text-red-500 text-xs hover:underline mt-1">
                        {appointment.action}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center text-orange-600 text-xs">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Please reschedule missed appointments soon
              </div>
            </div>
          </div>
          {/* Health Reminders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Bell className="text-blue-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Health Reminders</h3>
            </div>
            <div className="space-y-3">
              {healthReminders.map((reminder) => {
                const IconComponent = reminder.icon;
                return (
                  <div key={reminder.id} className="flex items-center p-3 rounded-lg border-l-4 border-blue-400">
                    <div className={`w-10 h-10 ${reminder.color} rounded-full flex items-center justify-center mr-3`}>
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{reminder.type}</div>
                      <div className="text-gray-600 text-xs">{reminder.frequency}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;