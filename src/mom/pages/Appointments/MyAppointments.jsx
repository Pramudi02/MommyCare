// MommyCare/src/mom/pages/Appointments/MyAppointments.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  CheckCircle,
  Plus
} from 'lucide-react';
import { clinicVisitRequestAPI, doctorVisitRequestAPI } from '../../../services/api';
import ClinicVisitRequestModal from '../../components/ClinicVisitRequestModal';
import ClinicVisitRequestsList from '../../components/ClinicVisitRequestsList';
import DoctorVisitRequestModal from '../../components/DoctorVisitRequestModal';
import DoctorVisitRequestsList from '../../components/DoctorVisitRequestsList';
import './MyAppointments.css';

const AppointmentsDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState('July 2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [clinicRequests, setClinicRequests] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clinicRequestsRef = useRef(null);
  const doctorRequestsRef = useRef(null);
  const upcomingRef = useRef(null);
  const missedRef = useRef(null);
  const completedRef = useRef(null);
  const [selectedClinicCategory, setSelectedClinicCategory] = useState(null);
  const [selectedDoctorCategory, setSelectedDoctorCategory] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const statsData = [
    { number: 3, label: 'Upcoming Appointments', color: 'text-blue-500', icon: <Calendar size={28} className="text-blue-400 mb-1" /> },
    { number: 2, label: 'Missed Appointments', color: 'text-red-500', icon: <X size={28} className="text-red-400 mb-1" /> },
    { number: 8, label: 'Completed This Month', color: 'text-green-500', icon: <CheckCircle size={28} className="text-green-400 mb-1" /> }
  ];

  const [activeTab, setActiveTab] = useState('mom');

  const momServices = [
    { icon: Stethoscope, name: 'General Checkup' },
    { icon: Calendar, name: 'Prenatal Checkup' },
    { icon: Search, name: 'Ultrasound Scan' },
    { icon: TestTube, name: 'Glucose Screening' },
    { icon: Baby, name: 'Breastfeeding Support' },
    { icon: Brain, name: 'Mental Health Check' }
  ];

  const babyServices = [
    { icon: Scale, name: 'Baby Weight Check' },
    { icon: Syringe, name: 'Vaccinations' },
    { icon: Stethoscope, name: 'Newborn Screening' },
    { icon: Baby, name: 'Feeding Assessment' },
    { icon: Calendar, name: 'Developmental Check' },
    { icon: AlertTriangle, name: 'Jaundice Monitoring' }
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

  // Check authentication status and fetch clinic visit requests on component mount
  useEffect(() => {
    checkAuthStatus();
    fetchClinicRequests();
    fetchDoctorRequests();
  }, []);

  // Check for vaccination highlighting data and scroll to vaccination section
  useEffect(() => {
    const highlightData = sessionStorage.getItem('highlightVaccination');
    if (highlightData) {
      try {
        const data = JSON.parse(highlightData);
        if (data.highlightSection === 'vaccinations') {
          // Scroll to clinic visit requests section
          setTimeout(() => {
            if (clinicRequestsRef.current) {
              clinicRequestsRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
              
              // Add highlighting effect to vaccination requests
              const vaccinationRequests = document.querySelectorAll('[data-request-type="Vaccinations"]');
              vaccinationRequests.forEach(request => {
                request.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50');
                setTimeout(() => {
                  request.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50');
                }, 3000);
              });
            }
          }, 500);
          
          // Clear the session storage
          sessionStorage.removeItem('highlightVaccination');
        }
      } catch (error) {
        console.error('Error parsing highlight data:', error);
        sessionStorage.removeItem('highlightVaccination');
      }
    }
  }, [clinicRequests]);

  // Handle intent coming from Vaccinations page to open clinic form preselected
  useEffect(() => {
    const intentRaw = sessionStorage.getItem('clinicRequestIntent');
    if (!intentRaw) return;
    try {
      const intent = JSON.parse(intentRaw);
      if (intent.openClinicRequestModal && intent.clinicCategory === 'Vaccinations') {
        // Preselect Baby tab and Vaccinations category
        setActiveTab('baby');
        setSelectedClinicCategory('Vaccinations');

        // If authenticated, open the clinic visit modal
        if (isAuthenticated) {
          setIsModalOpen(true);
        } else {
          // If not authenticated, keep selection but prompt to login when clicking
          console.warn('User not authenticated. Modal will not auto-open.');
        }
      }
    } catch (e) {
      console.error('Error parsing clinicRequestIntent:', e);
    } finally {
      // Clear intent so it doesn't re-trigger
      sessionStorage.removeItem('clinicRequestIntent');
    }
  }, [isAuthenticated]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    setIsAuthenticated(!!token);
  };

  // Demo function to simulate login (for testing purposes)
  const demoLogin = () => {
    localStorage.setItem('token', 'demo-token-123');
    setIsAuthenticated(true);
    fetchClinicRequests(); // Refresh requests after login
    fetchDoctorRequests(); // Refresh doctor requests after login
  };

  const demoLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSelectedClinicCategory(null);
    setSelectedDoctorCategory(null);
    setClinicRequests([]);
    setDoctorRequests([]);

  };

  const fetchClinicRequests = async () => {
    try {
      setIsLoading(true);
      const response = await clinicVisitRequestAPI.getAll();
      setClinicRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching clinic requests:', error);
      
      // Handle authentication errors silently for fetch requests
      if (error.message.includes('Not authorized') || error.message.includes('no token')) {
        // User is not authenticated, set empty requests array
        setClinicRequests([]);
        setIsAuthenticated(false);
      } else {
        // For other errors, show in console but don't alert user
        console.warn('Could not fetch clinic requests:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorRequests = async () => {
    try {
      setIsLoading(true);
      const response = await doctorVisitRequestAPI.getAll();
      setDoctorRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching doctor requests:', error);
      
      // Handle authentication errors silently for fetch requests
      if (error.message.includes('Not authorized') || error.message.includes('no token')) {
        // User is not authenticated, set empty requests array
        setDoctorRequests([]);
      } else {
        // For other errors, show in console but don't alert user
        console.warn('Could not fetch doctor requests:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (requestData) => {
    try {
      setIsSubmitting(true);
      await clinicVisitRequestAPI.create(requestData);
      setIsModalOpen(false);
      setSelectedClinicCategory(null); // Reset selection after successful submission
      fetchClinicRequests(); // Refresh the list
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
      // Clear any lingering state in case modal reopens quickly
      // (modal components themselves reset on open via their effect)
    } catch (error) {
      console.error('Error creating clinic request:', error);
      
      // Handle different types of errors
      if (error.message.includes('Not authorized') || error.message.includes('no token')) {
        alert('Please log in to create clinic visit requests. You need to be authenticated to use this feature.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        alert(`Failed to create clinic visit request: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDoctorRequest = async (requestData) => {
    try {
      setIsSubmitting(true);
      await doctorVisitRequestAPI.create(requestData);
      setIsDoctorModalOpen(false);
      setSelectedDoctorCategory(null); // Reset selection after successful submission
      fetchDoctorRequests(); // Refresh the list
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 seconds
      // Ensure state is clean before next open
    } catch (error) {
      console.error('Error creating doctor request:', error);
      
      // Handle different types of errors
      if (error.message.includes('Not authorized') || error.message.includes('no token')) {
        alert('Please log in to create doctor visit requests. You need to be authenticated to use this feature.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        alert(`Failed to create doctor visit request: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      try {
        setIsLoading(true);
        await clinicVisitRequestAPI.cancel(requestId);
        fetchClinicRequests(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling request:', error);
        alert('Failed to cancel request. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelDoctorRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this doctor visit request?')) {
      try {
        setIsLoading(true);
        await doctorVisitRequestAPI.cancel(requestId);
        fetchDoctorRequests(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling doctor request:', error);
        alert('Failed to cancel doctor visit request. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCategorySelect = (category, type) => {
    if (type === 'clinic') {
      setSelectedClinicCategory(category);
      setSelectedDoctorCategory(null); // Clear doctor selection
    } else if (type === 'doctor') {
      setSelectedDoctorCategory(category);
      setSelectedClinicCategory(null); // Clear clinic selection
    }
  };

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      alert('Please log in to create clinic visit requests');
      return;
    }
    if (!selectedClinicCategory) {
      alert('Please select a clinic service category first');
      return;
    }
    setIsModalOpen(true);
  };

  const handleOpenDoctorModal = () => {
    if (!isAuthenticated) {
      alert('Please log in to create doctor visit requests');
      return;
    }
    if (!selectedDoctorCategory) {
      alert('Please select a doctor service category first');
      return;
    }
    setIsDoctorModalOpen(true);
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

  const scrollToClinicRequests = () => {
    if (clinicRequestsRef.current) {
      const y = clinicRequestsRef.current.getBoundingClientRect().top + window.pageYOffset;
      const header = document.querySelector('nav');
      const offset = (header?.offsetHeight || 80) + 12;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  };

  const scrollToDoctorRequests = () => {
    if (doctorRequestsRef.current) {
      const y = doctorRequestsRef.current.getBoundingClientRect().top + window.pageYOffset;
      const header = document.querySelector('nav');
      const offset = (header?.offsetHeight || 80) + 12;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  };

  const scrollToUpcoming = () => {
    if (upcomingRef.current) {
      const y = upcomingRef.current.getBoundingClientRect().top + window.pageYOffset;
      const header = document.querySelector('nav');
      const offset = (header?.offsetHeight || 80) + 12;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  };

  const scrollToMissed = () => {
    if (missedRef.current) {
      const y = missedRef.current.getBoundingClientRect().top + window.pageYOffset;
      const header = document.querySelector('nav');
      const offset = (header?.offsetHeight || 80) + 12;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  };

  const scrollToCompleted = () => {
    if (completedRef.current) {
      const y = completedRef.current.getBoundingClientRect().top + window.pageYOffset;
      const header = document.querySelector('nav');
      const offset = (header?.offsetHeight || 80) + 12;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
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
          <button onClick={scrollToUpcoming} className="stat-card-appointments stat-card-upcoming text-left">
            <div className="stat-number-appointments text-blue-600">3</div>
            <div className="stat-label-appointments">Upcoming</div>
            <div className="stat-subtitle-appointments">Appointments</div>
          </button>
          <button onClick={scrollToMissed} className="stat-card-appointments stat-card-missed text-left">
            <div className="stat-number-appointments text-red-600">2</div>
            <div className="stat-label-appointments">Missed</div>
            <div className="stat-subtitle-appointments">Appointments</div>
          </button>
          <button onClick={scrollToCompleted} className="stat-card-appointments stat-card-completed text-left">
            <div className="stat-number-appointments text-green-600">8</div>
            <div className="stat-label-appointments">Completed</div>
            <div className="stat-subtitle-appointments">This Month</div>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Clinic Visits Card */}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <Building2 className="text-pink-500 w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Clinic Visits</h2>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setActiveTab('mom');
                    setSelectedClinicCategory(null);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'mom'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Mom
                </button>
                <button
                  onClick={() => {
                    setActiveTab('baby');
                    setSelectedClinicCategory(null);
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'baby'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Baby
                </button>
              </div>
            </div>
            

            <div className="grid grid-cols-2 gap-4 mb-6">
               {(activeTab === 'mom' ? momServices : babyServices).map((service, index) => {
                 const IconComponent = service.icon;
                 const isSelected = selectedClinicCategory === service.name;
                 return (
                   <div 
                     key={index} 
                     onClick={() => isAuthenticated && handleCategorySelect(service.name, 'clinic')}
                     className={`service-item flex flex-col items-center p-4 rounded-lg transition-all border ${
                       isAuthenticated 
                         ? isSelected 
                           ? 'bg-pink-100 border-pink-300 shadow-md scale-105 cursor-pointer' 
                           : 'hover:bg-gray-50 border-transparent hover:border-gray-200 cursor-pointer'
                         : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                     }`}
                   >
                     <div className={`mb-2 ${isSelected ? 'text-pink-600' : 'text-gray-600'}`}>
                       <IconComponent className="w-6 h-6" />
                     </div>
                     <span className={`text-sm text-center font-medium ${
                       isSelected ? 'text-pink-700' : 'text-gray-700'
                     }`}>
                       {service.name}
                     </span>
                   </div>
                 );
               })}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleOpenModal}
                disabled={!selectedClinicCategory || !isAuthenticated}
                className={`flex-1 font-medium py-3 rounded-full transition-colors ${
                  selectedClinicCategory && isAuthenticated
                    ? 'bg-pink-400 hover:bg-pink-500 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="inline-block mr-2" size={18} /> 
                {!isAuthenticated 
                  ? 'Please log in first' 
                  : selectedClinicCategory 
                    ? `Request ${selectedClinicCategory}` 
                    : 'Select a service first'
                }
              </button>
              {selectedClinicCategory && isAuthenticated && (
                <button 
                  onClick={() => setSelectedClinicCategory(null)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={scrollToClinicRequests}
              className="mt-3 w-full font-medium py-3 rounded-full border border-pink-300 text-pink-600 hover:bg-pink-50 transition-colors"
            >
              See All Requests
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Hospital will confirm your appointment
            </p>
          </div>

          {/* Doctor Consultations Card */}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-pink-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                  <Stethoscope className="text-cyan-500 w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Doctor Consultations</h2>
              </div>
              {selectedDoctorCategory && (
                <div className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                  Selected: {selectedDoctorCategory}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {doctorServices.map((service, index) => {
                const IconComponent = service.icon;
                const isSelected = selectedDoctorCategory === service.name;
                return (
                  <div 
                    key={index} 
                    className={`service-item flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent ${
                      isSelected ? 'bg-cyan-50 border-cyan-200 shadow-md scale-105' : ''
                    }`}
                    onClick={() => handleCategorySelect(service.name, 'doctor')}
                  >
                    <div className={`mb-2 ${isSelected ? 'text-cyan-600' : 'text-gray-600'}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className={`text-sm text-center font-medium ${
                      isSelected ? 'text-cyan-700' : 'text-gray-700'
                    }`}>
                      {service.name}
                    </span>
                    {!isAuthenticated && (
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        Login required
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleOpenDoctorModal}
                disabled={!selectedDoctorCategory || !isAuthenticated}
                className={`flex-1 font-medium py-3 rounded-full transition-colors ${
                  selectedDoctorCategory && isAuthenticated
                    ? 'bg-cyan-400 hover:bg-cyan-500 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus className="inline-block mr-2" size={18} /> 
                {!isAuthenticated 
                  ? 'Please log in first' 
                  : selectedDoctorCategory 
                    ? `Request ${selectedDoctorCategory}` 
                    : 'Select a service first'
                }
              </button>
              {selectedDoctorCategory && isAuthenticated && (
                <button 

                  onClick={() => setSelectedDoctorCategory(null)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"

                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={scrollToDoctorRequests}
              className="mt-3 w-full font-medium py-3 rounded-full border border-cyan-300 text-cyan-600 hover:bg-cyan-50 transition-colors"
            >
              See All Requests
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Doctor will confirm your appointment</p>
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
          <div ref={upcomingRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
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
          <div ref={missedRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
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

          {/* Completed Appointments */}
          <div ref={completedRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Completed Appointments</h3>
            </div>
            <div className="space-y-3">
              {/* Placeholder completed list; hook this to real data when available */}
              {[{ id: 1, type: 'General Checkup', date: 'July 5, 10:00 AM' }, { id: 2, type: 'Blood Test', date: 'July 8, 11:30 AM' }].map((item) => (
                <div key={item.id} className="flex items-center p-3 rounded-lg border-l-4 border-green-400">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">{item.type}</div>
                    <div className="text-gray-600 text-xs">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <div className="flex items-center text-green-800">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Request created successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Your request has been submitted and is pending approval.</p>
          </div>
        )}

        {/* Visit Requests Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
          {/* Clinic Visit Requests */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200" ref={clinicRequestsRef}>
            <div className="request-list-scroll max-h-[60vh] overflow-y-auto pr-1">
              <ClinicVisitRequestsList 
                requests={clinicRequests}
                onCancel={handleCancelRequest}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>

          {/* Doctor Visit Requests */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200" ref={doctorRequestsRef}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Doctor Visit Requests</h3>
            </div>
            <div className="request-list-scroll max-h-[60vh] overflow-y-auto pr-1">
              <DoctorVisitRequestsList 
                requests={doctorRequests}
                onCancelRequest={handleCancelDoctorRequest}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Visit Request Modal */}
      <ClinicVisitRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRequest}
        isLoading={isSubmitting}
        selectedCategory={selectedClinicCategory}
        activeTab={activeTab}
      />

      {/* Doctor Visit Request Modal */}
      <DoctorVisitRequestModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleSubmitDoctorRequest}
        isLoading={isSubmitting}
        selectedCategory={selectedDoctorCategory}
      />
    </div>
  );
};

export default AppointmentsDashboard;