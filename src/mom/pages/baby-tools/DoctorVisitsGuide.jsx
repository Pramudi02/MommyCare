import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, Heart, Droplet, Eye, Scale, Stethoscope } from 'lucide-react';
import './DoctorVisitsGuide.css';

export default function DoctorVisitsGuide() {
  const [activeTab, setActiveTab] = useState('vaccinations');

  const upcomingAppointments = [
    {
      id: 1,
      type: 'Gynecologist Checkup',
      date: 'Tomorrow, 11:00 AM',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 2,
      type: 'Baby Weight Check',
      date: 'Fri 24, 2:00 PM',
      icon: Scale,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 3,
      type: 'Ultrasound Scan',
      date: 'Sun 26, 3:00 AM',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  const missedAppointments = [
    {
      id: 1,
      type: 'Baby Vaccination',
      date: 'May 16, 11:00 AM',
      status: 'Missed',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 2,
      type: 'Blood Test',
      date: 'May 20, 11:00 AM',
      status: 'Not Completed',
      icon: Droplet,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const healthReminders = [
    {
      id: 1,
      type: 'Daily Folic Acid',
      time: 'Daily 9:00 AM',
      icon: Heart,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'Weekly Vitamins',
      time: 'Weekly',
      icon: Heart,
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      id: 3,
      type: 'Weight Monitoring',
      time: 'Weekly check',
      icon: Scale,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 4,
      type: 'Blood Pressure Check',
      time: 'Monthly 11:00 PM',
      icon: Heart,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 5,
      type: 'Drink Plenty of Water',
      time: 'Daily after Meal',
      icon: Droplet,
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="doctor-visits-guide">
      <div className="glass-container">
        {/* Header */}
        <div className="header-doctorvisits">
          <h1>
            <Stethoscope className="header-icon" />
            Baby Health Tracker & Doctor Visits Guide
          </h1>
          <p>Stay on top of your baby's health with smart reminders and appointment tracking</p>
        </div>

        {/* Tab Navigation */}
        <div className="glass-tab-navigation-doctorvisits">
          <button
            onClick={() => setActiveTab('vaccinations')}
            className={`tab-button-doctorvisits ${activeTab === 'vaccinations' ? 'active' : ''}`}
          >
            Vaccinations & Immunizations
          </button>
          <button
            onClick={() => setActiveTab('checkups')}
            className={`tab-button-doctorvisits ${activeTab === 'checkups' ? 'active' : ''}`}
          >
            Well-baby Visits & Checkups
          </button>
        </div>

        {/* Vaccination Tab */}
        {activeTab === 'vaccinations' && (
          <div className="space-y-6">
            <div className="vaccination-hero-card glass-hero-card">
              <h2>Ready to Track Your Baby's Vaccination Schedule?</h2>
              <p>Never miss an important vaccination date with our smart reminder system</p>
              <button className="glass-button-doctorvisits">
                View Vaccination Schedule
              </button>
            </div>
          </div>
        )}

        {/* Checkups Tab */}
        {activeTab === 'checkups' && (
          <div className="space-y-6">
            <div className="checkup-hero-card glass-hero-card">
              <h2>Time for your little one's check-up!</h2>
              <p>Regular visits help track your baby's growth and development. Ready to schedule?</p>
              <button className="glass-button-doctorvisits">
                Request new appointment
              </button>
            </div>

            {/* Appointment Sections */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Upcoming Appointments */}
              <div className="glass-card">
                <div className="card-header">
                  <Clock className="w-5 h-5 text-white mr-2" />
                  <h3>Upcoming Appointments</h3>
                </div>
                <div className="appointment-list">
                  {upcomingAppointments.map((appointment) => {
                    const IconComponent = appointment.icon;
                    return (
                      <div key={appointment.id} className="appointment-item">
                        <div className="appointment-icon">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="appointment-details">
                          <p className="appointment-type">{appointment.type}</p>
                          <p className="appointment-date">{appointment.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Missed Appointments */}
              <div className="glass-card">
                <div className="card-header">
                  <AlertCircle className="w-5 h-5 text-white mr-2" />
                  <h3>Missed Appointments</h3>
                </div>
                <div className="appointment-list">
                  {missedAppointments.map((appointment) => {
                    const IconComponent = appointment.icon;
                    return (
                      <div key={appointment.id} className="appointment-item missed">
                        <div className="appointment-icon missed">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="appointment-details">
                          <p className="appointment-type">{appointment.type}</p>
                          <p className="appointment-date">{appointment.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="missed-warning">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <p>Please reschedule missed appointments soon</p>
                </div>
              </div>

              {/* Health Reminders */}
              <div className="glass-card">
                <div className="card-header">
                  <Heart className="w-5 h-5 text-white mr-2" />
                  <h3>Health Reminders</h3>
                </div>
                <div className="appointment-list">
                  {healthReminders.map((reminder) => {
                    const IconComponent = reminder.icon;
                    return (
                      <div key={reminder.id} className="appointment-item">
                        <div className="appointment-icon">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="appointment-details">
                          <p className="appointment-type">{reminder.type}</p>
                          <p className="appointment-date">{reminder.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 