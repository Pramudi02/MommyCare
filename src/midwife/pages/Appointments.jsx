import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiMapPin, FiBell, FiX, FiCheck, FiClock, FiUser, FiActivity, FiPlay, FiUsers, FiFileText, FiEye, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { midwifeAppointmentAPI } from '../../services/api';
import './Appointments.css';

const Appointments = () => {
  const [currentDateRange, setCurrentDateRange] = useState('');
  const [viewMode, setViewMode] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  // Add state for appointment notes
  const [appointmentNotes, setAppointmentNotes] = useState({
    midwifeNotes: ''
  });

  const todayDateString = () => new Date().toISOString().split('T')[0];

  const generateTimeSlotsBetween = (minTime = '07:00', maxTime = '15:00', stepMinutes = 15) => {
    const [minH, minM] = minTime.split(':').map(Number);
    const [maxH, maxM] = maxTime.split(':').map(Number);
    const minTotal = minH * 60 + minM;
    const maxTotal = maxH * 60 + maxM;
    const slots = [];
    for (let t = minTotal; t <= maxTotal; t += stepMinutes) {
      const h = Math.floor(t / 60).toString().padStart(2, '0');
      const m = (t % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }
    return slots;
  };
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isMomDetailsModalOpen, setIsMomDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [acceptFormData, setAcceptFormData] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  });
  const [rejectFormData, setRejectFormData] = useState({
    reason: ''
  });
  
  // Helper function to get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Real data from API
  const [appointments, setAppointments] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination for requests
  const [visibleRequests, setVisibleRequests] = useState(3);
  const [showAllRequests, setShowAllRequests] = useState(false);
  
  // Notification system
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  
  // Success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Error message
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Current time for display
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  
  // Day appointments modal
  const [isDayAppointmentsModalOpen, setIsDayAppointmentsModalOpen] = useState(false);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    updateDateRange('today');
    
    // Test if backend is accessible
    console.log('Testing backend connectivity...');
    fetch('http://localhost:5000/health')
      .then(response => response.json())
      .then(data => console.log('Backend health check:', data))
      .catch(err => console.error('Backend not accessible:', err));
    
    fetchAppointments();
    fetchClinicVisitRequests();
  }, []);

  // Poll for new requests every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchClinicVisitRequests();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update current time every minute for accurate positioning
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Debug: Log appointments whenever they change
  useEffect(() => {
    console.log('Appointments state changed:', appointments);
    console.log('Appointment requests state changed:', appointmentRequests);
  }, [appointments, appointmentRequests]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch ALL appointments - no date filtering
      const appointmentsResponse = await midwifeAppointmentAPI.getAppointments('all');
      
      console.log('📅 Fetched ALL appointments:', appointmentsResponse.data?.length || 0, 'appointments');
      
      if (appointmentsResponse.status === 'success') {
        setAppointments(appointmentsResponse.data || []);
      } else {
        setError('Failed to fetch appointments');
        setAppointments([]);
      }
    } catch (err) {
      console.error('❌ Error fetching appointments:', err);
      setError('Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Local helpers (do not modify api.js)
  const buildApiBaseUrl = () => {
    let base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    base = base.replace(/\/$/, '');
    if (!/\/api$/i.test(base) && !/\/api\//i.test(base)) {
      base = `${base}/api`;
    }
    return base;
  };

  const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  const fetchClinicVisitRequests = async () => {
    try {
      const response = await midwifeAppointmentAPI.getClinicVisitRequests();
      const requests = response.data || [];
      // Only show pending requests in the list, sorted by newest first
      const pendingRequests = requests
        .filter(request => request.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointmentRequests(pendingRequests);
      
      // Update notification count
      setPendingRequestsCount(pendingRequests.length);
      setShowNotificationBadge(pendingRequests.length > 0);
    } catch (err) {
      console.error('Error fetching clinic visit requests:', err);
      setError('Failed to fetch clinic visit requests');
    }
  };

  // Get current date and time for validation
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };



  // Get current month dates
  const getCurrentMonthDates = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    return { firstDay, lastDay, year, month };
  };

  // Format month range for display
  const formatMonthRange = (monthDates) => {
    const monthName = monthDates.firstDay.toLocaleDateString('en-US', { month: 'long' });
    const year = monthDates.year;
    return `${monthName} ${year}`;
  };

  // Update date range based on view mode
  const updateDateRange = (mode, date = new Date()) => {
    switch (mode) {
      case 'today':
        const today = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        setCurrentDateRange(today);
        break;

      case 'month':
        const monthDates = getCurrentMonthDates(date);
        setCurrentDateRange(formatMonthRange(monthDates));
        break;
      default:
        break;
    }
  };

  // Get time range based on preferred time
  const getTimeRange = (preferredTime) => {
    switch (preferredTime) {
      case 'Morning':
        return { min: '07:00', max: '12:00' };
      case 'Afternoon':
        return { min: '12:00', max: '15:00' };
      case 'Any Time':
        return { min: '07:00', max: '18:00' };
      default:
        return { min: '07:00', max: '18:00' };
    }
  };

  // Generate time options based on preferred time
  const getTimeOptions = (preferredTime) => {
    const timeRange = getTimeRange(preferredTime);
    const options = [];
    
    const startHour = parseInt(timeRange.min.split(':')[0]);
    const endHour = parseInt(timeRange.max.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        if (hour === endHour && minute > 0) break; // Don't exceed end time
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    
    return options;
  };

  // Calculate appointment span for grid display
  const calculateAppointmentSpan = (startTime, endTime) => {
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];
    
    const durationMinutes = endMinutes - startMinutes;
    const span = Math.max(1, Math.ceil(durationMinutes / 30)); // Each time slot is 30 minutes
    
    return span;
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateDateRange(mode, selectedDate);
  };

  // Handle date selection for week/month views
  const handleDateSelection = (date) => {
    setSelectedDate(date);
    updateDateRange(viewMode, date);
    setShowDatePicker(false);
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    setSelectedDate(newDate);
    updateDateRange(viewMode, newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    setSelectedDate(newDate);
    updateDateRange(viewMode, newDate);
  };

  // Handle showing more requests
  const handleShowMoreRequests = () => {
    setShowAllRequests(true);
  };

  const handleShowLessRequests = () => {
    setShowAllRequests(false);
  };

  // Handle bell icon click
  const handleBellClick = () => {
    if (pendingRequestsCount > 0) {
      // Scroll to requests section and show all pending requests
      setShowAllRequests(true);
      const requestsSection = document.querySelector('.appointments-calendar__requests-section');
      if (requestsSection) {
        requestsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Get requests to display based on pagination
  const getDisplayRequests = () => {
    if (showAllRequests) {
      return appointmentRequests;
    }
    return appointmentRequests.slice(0, visibleRequests);
  };

  // Handle appointment request actions
  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setAcceptFormData({
      appointmentDate: request.preferredDate ? new Date(request.preferredDate).toISOString().split('T')[0] : '',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setIsAcceptModalOpen(true);
  };

  const handleRejectRequest = (request) => {
    setSelectedRequest(request);
    setRejectFormData({
      reason: ''
    });
    setIsRejectModalOpen(true);
  };

  const handleViewMomDetails = (request) => {
    setSelectedRequest(request);
    setIsMomDetailsModalOpen(true);
  };

  const handleDayClick = (day) => {
    const dayAppointments = getAppointmentsForDateString(day.toDateString());
    setSelectedDayAppointments(dayAppointments);
    setSelectedDayDate(day);
    setIsDayAppointmentsModalOpen(true);
  };

  const handleAcceptSubmit = async () => {
    if (!acceptFormData.startTime || !acceptFormData.endTime) {
      showError('Please fill in start time and end time');
      return;
    }

    // Validate that start time is before end time
    if (acceptFormData.startTime >= acceptFormData.endTime) {
      showError('Start time must be before end time');
      return;
    }

    // Validate that appointment is not in the past
    const { date, time } = getCurrentDateTime();
    if (acceptFormData.appointmentDate < date || 
        (acceptFormData.appointmentDate === date && acceptFormData.startTime < time)) {
      showError('Appointment cannot be scheduled in the past');
      return;
    }

    try {
      setIsLoading(true);
      // Use POST (backend expects POST, not PATCH)
      const base = buildApiBaseUrl();
      const token = getAuthToken();
      const res = await fetch(`${base}/midwife/clinic-visit-requests/${selectedRequest._id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(acceptFormData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to accept request (${res.status})`);
      }
      await res.json().catch(() => ({}));
      
      // Close modal and reset
      setIsAcceptModalOpen(false);
      setSelectedRequest(null);
      setAcceptFormData({
        appointmentDate: '',
        startTime: '',
        endTime: '',
        notes: ''
      });

      // Remove the accepted request from the local state immediately
      setAppointmentRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
      setPendingRequestsCount(prev => Math.max(0, prev - 1));
      setShowNotificationBadge(prev => prev && pendingRequestsCount > 1);

      // Refresh appointments to show the new appointment in calendar
      await fetchAppointments();
      
      // Show success message
      setSuccessMessage(`Appointment accepted successfully! The appointment has been scheduled for ${selectedRequest.mom?.firstName} ${selectedRequest.mom?.lastName} on ${new Date(acceptFormData.appointmentDate).toLocaleDateString()} at ${acceptFormData.startTime}-${acceptFormData.endTime}.`);
      setShowSuccessMessage(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error accepting request:', err);
      showError('Failed to accept request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectFormData.reason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }


    try {
      setIsLoading(true);
      // Use POST (backend expects POST, not PATCH)
      const base = buildApiBaseUrl();
      const token = getAuthToken();
      const res = await fetch(`${base}/midwife/clinic-visit-requests/${selectedRequest._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reason: rejectFormData.reason })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to reject request (${res.status})`);
      }
      await res.json().catch(() => ({}));
      
      // Close modal and reset
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectFormData({
        reason: ''
      });

      // Remove the rejected request from the local state immediately
      setAppointmentRequests(prev => prev.filter(req => req._id !== selectedRequest._id));
      setPendingRequestsCount(prev => Math.max(0, prev - 1));
      setShowNotificationBadge(prev => prev && pendingRequestsCount > 1);
      
      // Show success message
      setSuccessMessage(`Request rejected successfully for ${selectedRequest.mom?.firstName} ${selectedRequest.mom?.lastName}.`);
      setShowSuccessMessage(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 5000);
      } catch (err) {
        console.error('Error rejecting request:', err);
        showError('Failed to reject request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform real appointment data to display format
  const transformAppointmentData = (appointment) => {
    // Handle MidwifeAppointment data structure
    let startTime = appointment.startTime;
    let endTime = appointment.endTime;
    
    if (!startTime) {
      console.warn('Appointment missing start time:', appointment);
      return null;
    }
    
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : new Date(startTime);
    
    // Get day name and convert to lowercase for matching
    const dayName = startDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const transformed = {
      id: appointment._id,
      day: dayName,
      date: startDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      startTime: startDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      endTime: endDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      type: appointment.type || appointment.title || 'General Checkup',
      icon: getAppointmentIcon(appointment.type),
      location: appointment.location?.clinicName || appointment.location?.address || 'Location TBD',
      color: getAppointmentColor(appointment.type),
      mom: appointment.mom,
      status: appointment.status || 'scheduled',
      isRescheduled: appointment.status === 'cancelled' && appointment.cancellationReason === 'Rescheduled to new date/time',
      notes: appointment.notes || appointment.description,
      originalData: appointment
    };
    

    
    return transformed;
  };

  const getAppointmentIcon = (type) => {
    switch (type) {
      case 'Mom Weight Check':
      case 'Baby Weight Check':
        return 'medical';
      case 'Ultrasound Scan':
        return 'medical';
      case 'Blood Tests':
        return 'medical';
      case 'Vaccinations':
        return 'medical';
      case 'Emergency Care':
        return 'stethoscope';
      case 'General Checkup':
      case 'Antenatal Care':
      case 'Postnatal Care':
        return 'stethoscope';
      case 'Consultation':
      case 'Follow-up':
        return 'stethoscope';
      default:
        return 'stethoscope';
    }
  };

  const getAppointmentColor = (type) => {
    switch (type) {
      case 'Emergency Care':
        return 'pink';
      case 'Vaccinations':
        return 'light-blue';
      case 'Ultrasound Scan':
        return 'blue';
      case 'Blood Tests':
        return 'yellow';
      default:
        return 'pink';
    }
  };

  // Transform appointments for display
  const displayAppointments = appointments
    .map(transformAppointmentData)
    .filter(apt => apt !== null);
  
  const finalAppointments = displayAppointments;





  // Generate days array based on view mode
  const getDaysForViewMode = () => {
    // Get current date fresh each time to ensure accurate highlighting
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();
    
    switch (viewMode) {
      case 'today':
        const today = new Date();
        return [{
          name: today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
          date: `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}`,
          key: 'today',
          current: true,
          weekend: today.getDay() === 0 || today.getDay() === 6,
          fullDate: today
        }];
        

        
      case 'month':
        const monthDates = getCurrentMonthDates(selectedDate);
        const monthDays = [];
        const firstDay = monthDates.firstDay;
        const lastDay = monthDates.lastDay;
        
        // Add days from previous month to fill first week
        const firstDayOfWeek = firstDay.getDay();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          const date = new Date(firstDay);
          date.setDate(firstDay.getDate() - i - 1);
          monthDays.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            key: `prev-${date.getTime()}`,
            current: false,
            weekend: date.getDay() === 0 || date.getDay() === 6,
            fullDate: date,
            otherMonth: true
          });
        }
        
        // Add current month days
        for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
          monthDays.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            key: `current-${date.getTime()}`,
            current: date.toDateString() === currentDateString,
            weekend: date.getDay() === 0 || date.getDay() === 6,
            fullDate: new Date(date),
            otherMonth: false
          });
        }
        
        return monthDays;
        
      default:
        return [];
    }
  };

  const days = getDaysForViewMode();





  // Get appointments for a specific date string
  const getAppointmentsForDateString = (dateString) => {
    return finalAppointments.filter(apt => {
      // Get date from original data
      const dateField = apt.originalData?.startTime;
      
      if (dateField) {
        const appointmentDate = new Date(dateField);
        return appointmentDate.toDateString() === dateString;
      }
      
      return false;
    });
  };

  const getAppointmentsForDate = (date) => {
    return displayAppointments.filter(apt => apt.date === date);
  };

  const getIconComponent = (iconType) => {
    switch (iconType) {
      case 'stethoscope':
        return <FiActivity size={16} />;
      case 'video':
        return <FiPlay size={16} />;
      case 'medical':
        return <FiActivity size={16} />;
      case 'team':
        return <FiUsers size={16} />;
      default:
        return <FiCalendar size={16} />;
    }
  };



  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    // Set existing notes if available
    setAppointmentNotes({
      midwifeNotes: appointment.originalData?.midwifeNotes || ''
    });
    setIsModalOpen(true);
  };

  const openReschedule = () => {
    if (!selectedAppointment) return;
    const start = selectedAppointment.originalData?.startTime
      ? new Date(selectedAppointment.originalData.startTime)
      : null;
    const dateStr = start ? start.toISOString().split('T')[0] : '';
    setRescheduleForm({
      date: dateStr,
      startTime: selectedAppointment.startTime || '',
      endTime: selectedAppointment.endTime || ''
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleForm.date || !rescheduleForm.startTime || !rescheduleForm.endTime) {
      showError('Please select date, start and end time');
      return;
    }
    if (rescheduleForm.startTime >= rescheduleForm.endTime) {
      showError('Start time must be before end time');
      return;
    }
    try {
      setIsLoading(true);
      const start = new Date(rescheduleForm.date);
      const [sh, sm] = rescheduleForm.startTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);
      const end = new Date(rescheduleForm.date);
      const [eh, em] = rescheduleForm.endTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);

      await midwifeAppointmentAPI.updateAppointment(selectedAppointment.id, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'cancelled',
        cancellationReason: 'Rescheduled to new date/time'
      });

      setIsRescheduleModalOpen(false);
      setIsModalOpen(false);
      await fetchAppointments();
      setSuccessMessage('Appointment rescheduled successfully. The old appointment has been cancelled and marked as rescheduled.');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      showError('Failed to reschedule appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setIsLoading(true);
      await midwifeAppointmentAPI.updateAppointment(selectedAppointment.id, { 
        status: 'completed',
        midwifeNotes: appointmentNotes.midwifeNotes
      });
      setIsModalOpen(false);
      await fetchAppointments();
      setSuccessMessage('Appointment marked as completed with notes saved.');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error marking appointment complete:', err);
      setErrorMessage('Failed to mark appointment as completed.');
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
        setErrorMessage('');
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to show error messages
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
      setErrorMessage('');
    }, 4000);
  };

  // Fetch all appointments once on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update date range when view mode or selected date changes
  useEffect(() => {
    updateDateRange(viewMode, selectedDate);
  }, [viewMode, selectedDate]);

  const renderTodayView = () => {
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const currentDayDate = today;
    
    const todayAppointments = getAppointmentsForDateString(today.toDateString());
    
    return (
      <div className="appointments-calendar__today-view">
        <div className="appointments-calendar__today-header">
          <h2>Today - {currentDayName}, {currentDayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
        </div>
        <div className="appointments-calendar__today-timeline">
          {todayAppointments.length > 0 ? (
            todayAppointments.map(appointment => (
              <div key={appointment.id} className="appointments-calendar__today-time-slot">
                <div className="appointments-calendar__today-time">{appointment.startTime}-{appointment.endTime}</div>
                <div className="appointments-calendar__today-events">
                  <div 
                    className={`appointments-calendar__today-event appointments-calendar__event--${appointment.color} ${appointment.status === 'completed' ? 'completed' : ''}`}
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                     <div className="appointments-calendar__today-event-icon">
                       {getIconComponent(appointment.icon)}
                    </div>
                     <div className="appointments-calendar__today-event-mom">
                       {appointment.mom?.firstName} {appointment.mom?.lastName}
                    </div>
                    <div className="appointments-calendar__today-event-type">
                      {appointment.type}
                    </div>
                    {appointment.status === 'completed' && (
                      <div className="appointments-calendar__completed-badge">✓ Completed</div>
                    )}
                    {appointment.isRescheduled && (
                      <div className="appointments-calendar__rescheduled-badge">↻ Rescheduled to today</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="appointments-calendar__today-empty">
              No appointments today
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDates = getCurrentMonthDates(selectedDate);
    const monthName = monthDates.firstDay.toLocaleDateString('en-US', { month: 'long' });
    const year = monthDates.year;
    
    // Generate month grid
    const monthGrid = [];
    const firstDay = monthDates.firstDay;
    const lastDay = monthDates.lastDay;
    
    // Get first day of week for the month
    const firstDayOfWeek = firstDay.getDay();
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      monthGrid.push(null);
    }
    
    // Add all days of the month
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      monthGrid.push(new Date(date));
    }
    
    // Group into weeks
    const weeks = [];
    for (let i = 0; i < monthGrid.length; i += 7) {
      weeks.push(monthGrid.slice(i, i + 7));
    }
    
    return (
      <div className="appointments-calendar__month-view">
        <div className="appointments-calendar__month-header">
          <h2>{monthName} {year}</h2>
        </div>
        <div className="appointments-calendar__month-grid">
          <div className="appointments-calendar__month-days-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="appointments-calendar__month-day-header">
                {day}
              </div>
            ))}
          </div>
          <div className="appointments-calendar__month-weeks">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="appointments-calendar__month-week">
                {week.map((day, dayIndex) => {
                  if (!day) return <div key={dayIndex} className="appointments-calendar__month-day-empty" />;
                  
                  const dayAppointments = getAppointmentsForDateString(day.toDateString());
                                     // Check if this day is the current date (actual current date, not selected date)
                   const isToday = day.toDateString() === new Date().toDateString();
                  

                  
                  // Check if all appointments for this day are completed
                  const allCompleted = dayAppointments.length > 0 && dayAppointments.every(apt => apt.status === 'completed');
                  
                  // Check if any appointments for this day are rescheduled
                  const hasRescheduled = dayAppointments.some(apt => apt.isRescheduled);
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`appointments-calendar__month-day ${isToday ? 'today' : ''} ${dayAppointments.length > 0 ? 'has-appointments' : ''} ${allCompleted ? 'all-completed' : ''}`}
                      onClick={() => handleDayClick(day)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="appointments-calendar__month-day-number">{day.getDate()}</span>
                      {dayAppointments.length > 0 && (
                        <div className="appointments-calendar__month-day-indicator">
                          {dayAppointments.length}
                        </div>
                      )}
                      {allCompleted && (
                        <div className="appointments-calendar__month-day-completed">
                          ✓
                        </div>
                      )}
                      {hasRescheduled && (
                        <div className="appointments-calendar__month-day-rescheduled">
                          ↻
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="appointments-calendar">
      <div className="appointments-calendar-container">
        <div className="appointments-calendar-content">
          <div className="appointments-calendar__header">
            <div className="appointments-calendar__header-icon">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="appointments-calendar__title">
              <h1>Appointments</h1>
              <p>Manage and schedule appointments with your moms efficiently</p>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="appointments-calendar__success-message">
              <div className="appointments-calendar__success-content">
                <FiCheck size={20} />
                <span>{successMessage}</span>
                <button 
                  className="appointments-calendar__success-close"
                  onClick={() => setShowSuccessMessage(false)}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {showErrorMessage && (
            <div className="appointments-calendar__error-message">
              <div className="appointments-calendar__error-content">
                <FiX size={20} />
                <span>{errorMessage}</span>
                <button 
                  className="appointments-calendar__error-close"
                  onClick={() => setShowErrorMessage(false)}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

        <div className="appointments-calendar__filters">
          <div className="appointments-calendar__week-selector">
            {viewMode === 'month' && (
              <>
                <button 
                  className="appointments-calendar__nav-btn"
                  onClick={handlePreviousMonth}
                  title="Previous month"
                >
                  <FiChevronLeft size={16} />
                </button>
                <button 
                  className="appointments-calendar__week-btn"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  title="Click to change date"
                >
                  {currentDateRange}
                  <FiCalendar size={16} />
                </button>
                <button 
                  className="appointments-calendar__nav-btn"
                  onClick={handleNextMonth}
                  title="Next month"
                >
                  <FiChevronRight size={16} />
                </button>
              </>
            )}
            {viewMode === 'today' && (
              <button 
                className="appointments-calendar__week-btn"
                title="Current date"
              >
                {currentDateRange}
                <FiCalendar size={16} />
              </button>
            )}
            
            
            {showDatePicker && viewMode === 'month' && (
              <div className="appointments-calendar__date-picker">
                <div className="appointments-calendar__date-picker-header">
                  <h4>Select Month</h4>
                  <button 
                    className="appointments-calendar__date-picker-close"
                    onClick={() => setShowDatePicker(false)}
                  >
                    <FiX size={16} />
                  </button>
                </div>
                <div className="appointments-calendar__date-picker-content">
                  <label>Month & Year:</label>
                  <input
                    type="month"
                    value={`${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-');
                      handleDateSelection(new Date(parseInt(year), parseInt(month) - 1, 1));
                    }}
                    className="appointments-calendar__date-input"
                  />
                  <small>Select month and year to view</small>
                </div>
              </div>
            )}
          </div>
          <div className="appointments-calendar__view-toggles">
            <button 
              className={`appointments-calendar__view-btn ${viewMode === 'today' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('today')}
            >
              Today
            </button>
            <button 
              className={`appointments-calendar__view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('month')}
            >
              Month
            </button>
          </div>
          <div className="appointments-calendar__actions">
            <button 
              className="appointments-calendar__icon-btn appointments-calendar__notification-btn"
              onClick={handleBellClick}
              title={pendingRequestsCount > 0 ? `${pendingRequestsCount} pending requests` : 'No new requests'}
            >
              <FiBell size={16} />
              {showNotificationBadge && (
                <span className="appointments-calendar__notification-badge">
                  {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="appointments-calendar__content-wrapper">
          <div className="appointments-calendar__calendar-section">
            
            {error && (
              <div className="appointments-calendar__error">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="appointments-calendar__loading">
                Loading appointments...
              </div>
            ) : (
              <>
            {viewMode === 'today' && renderTodayView()}
            {viewMode === 'month' && renderMonthView()}
              </>
            )}
          </div>

          {/* Appointment Requests Section */}
          <div className="appointments-calendar__requests-section">
            <h3>Appointment Requests</h3>

            {isLoading ? (
              <div className="appointments-calendar__loading">
                Loading requests...
              </div>
            ) : appointmentRequests.length === 0 ? (
              <div className="appointments-calendar__no-requests">
                No pending requests
              </div>
            ) : (
              <>
              <div className="appointments-calendar__requests-list">
                  {getDisplayRequests().map(request => (
                  <div key={request._id} className="appointments-calendar__request-item">
                    <div className="appointments-calendar__request-content">
                      <h4 className="appointments-calendar__request-mom">
                        {request.mom?.firstName} {request.mom?.lastName}
                      </h4>

                      <p className="appointments-calendar__request-type">{request.requestType} • {request.preferredTime}</p>
                      <p className="appointments-calendar__request-description">{request.notes}</p>
                      <div className="appointments-calendar__request-details">
                        <span className="appointments-calendar__request-location">
                          <FiMapPin size={12} className="inline mr-1" />
                          {request.location}
                        </span>

                        <span className="appointments-calendar__request-date-label">
                          <FiCalendar size={12} className="inline mr-1" />
                          Preferred date: {new Date(request.preferredDate).toLocaleDateString()}
                          </span>
                        <span className="appointments-calendar__request-date-label">
                          <FiClock size={12} className="inline mr-1" />
                          Request made: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="appointments-calendar__request-actions">
                        <button 
                          className="appointments-calendar__request-btn appointments-calendar__request-btn--view"
                          onClick={() => handleViewMomDetails(request)}
                          title="View Mom Details"
                        >
                          <FiEye size={14} />
                          View Details
                        </button>
                      <button 
                        className="appointments-calendar__request-btn appointments-calendar__request-btn--accept"
                        onClick={() => handleAcceptRequest(request)}
                        disabled={isLoading}
                      >
                        <FiCheck size={14} />
                        {isLoading ? 'Processing...' : 'Accept'}
                      </button>
                      <button 
                          className="appointments-calendar__request-btn appointments-calendar__request-btn--reject"
                          onClick={() => handleRejectRequest(request)}
                        disabled={isLoading}
                      >
                        <FiX size={14} />
                          {isLoading ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                
                {/* Show More/Less Button */}
                {appointmentRequests.length > visibleRequests && (
                  <div className="appointments-calendar__show-more-container">
                    {!showAllRequests ? (
                      <button 
                        className="appointments-calendar__show-more-btn"
                        onClick={handleShowMoreRequests}
                      >
                        <FiChevronDown size={16} />
                        Show More ({appointmentRequests.length - visibleRequests} more)
                      </button>
                    ) : (
                      <button 
                        className="appointments-calendar__show-more-btn"
                        onClick={handleShowLessRequests}
                      >
                        <FiChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
                        Show Less
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

          </div>
        </div>

        {/* Appointment Detail Modal */}
        {isModalOpen && selectedAppointment && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Appointment Details</h2>
                {selectedAppointment.status === 'completed' && (
                  <span className="modal__badge modal__badge--completed">Completed</span>
                )}
                <button className="modal__close" onClick={() => setIsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal__content">
                <div className="modal__section">
                  <h3>Appointment Information</h3>
                  <div className="modal__grid">
                    <div className="modal__field">
                      <label>Date & Time</label>
                      <span>{selectedAppointment.date} at {selectedAppointment.startTime}-{selectedAppointment.endTime}</span>
                    </div>
                    <div className="modal__field">
                      <label>Type</label>
                      <span>{selectedAppointment.type}</span>
                    </div>
                    <div className="modal__field">
                      <label>Location</label>
                      <span>{selectedAppointment.location}</span>
                    </div>
                    {selectedAppointment.mom && (
                      <div className="modal__field">
                        <label>Patient</label>
                        <span>{selectedAppointment.mom.firstName} {selectedAppointment.mom.lastName}</span>
                  </div>
                    )}
                    {selectedAppointment.status && (
                      <div className="modal__field">
                        <label>Status</label>
                        <span>{selectedAppointment.status}</span>
                      </div>
                    )}
                    {selectedAppointment.originalData?.momNotes && (
                      <div className="modal__field">
                        <label>Mom Notes</label>
                        <span>{selectedAppointment.originalData.momNotes}</span>
                      </div>
                    )}
                    {selectedAppointment.originalData?.midwifeNotes && (
                      <div className="modal__field">
                        <label>Midwife Notes</label>
                        <span>{selectedAppointment.originalData.midwifeNotes}</span>
                      </div>
                    )}
                    {selectedAppointment.notes && !selectedAppointment.originalData?.momNotes && !selectedAppointment.originalData?.midwifeNotes && (
                      <div className="modal__field">
                        <label>Mom Notes</label>
                        <span>{selectedAppointment.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedAppointment.status !== 'completed' && (
                <div className="modal__content">
                  <div className="modal__section">
                    <h3>Add Notes</h3>
                    <div className="modal__grid">
                      <div className="modal__field">
                        <label>Midwife Notes (Optional)</label>
                        <textarea
                          value={appointmentNotes.midwifeNotes}
                          onChange={(e) => setAppointmentNotes({ ...appointmentNotes, midwifeNotes: e.target.value })}
                          placeholder="Add your notes as midwife..."
                          className="modal__input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {selectedAppointment.status !== 'completed' && (
                <div className="modal__actions">
                  <button className="modal__btn modal__btn--secondary" onClick={openReschedule}>Reschedule</button>
                  <button className="modal__btn modal__btn--primary" onClick={handleMarkComplete}>Mark Complete</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {isRescheduleModalOpen && selectedAppointment && (
          <div className="modal-overlay" onClick={() => setIsRescheduleModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Reschedule Appointment</h2>
                <button className="modal__close" onClick={() => setIsRescheduleModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal__content">
                <div className="modal__section">
                  <div className="modal__grid">
                    <div className="modal__field">
                      <label>Date</label>
                      <input
                        className="modal__input"
                        type="date"
                        min={todayDateString()}
                        value={rescheduleForm.date}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                      />
                    </div>
                    <div className="modal__field">
                      <label>Start Time</label>
                      <select
                        className="modal__input"
                        value={rescheduleForm.startTime}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, startTime: e.target.value, endTime: '' })}
                      >
                        <option value="">Select start time</option>
                        {generateTimeSlotsBetween('07:00', '15:00').map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="modal__field">
                      <label>End Time</label>
                      <select
                        className="modal__input"
                        value={rescheduleForm.endTime}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, endTime: e.target.value })}
                        disabled={!rescheduleForm.startTime}
                      >
                        <option value="">Select end time</option>
                        {generateTimeSlotsBetween(
                          rescheduleForm.startTime ? rescheduleForm.startTime : '07:00',
                          '15:00'
                        )
                          .filter(t => rescheduleForm.startTime ? t > rescheduleForm.startTime : true)
                          .map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</button>
                <button className="modal__btn modal__btn--primary" onClick={handleRescheduleSubmit}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Accept Request Modal */}
        {isAcceptModalOpen && selectedRequest && (
          <div className="modal-overlay" onClick={() => setIsAcceptModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Accept Request</h2>
                <button className="modal__close" onClick={() => setIsAcceptModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal__content">
                <div className="modal__section">
                  <h3>Appointment Details</h3>
                  <div className="modal__grid">
                    <div className="modal__field">
                      <label>Preferred Date (Mom's Choice)</label>
                      <div className="modal__readonly-field">
                        {acceptFormData.appointmentDate ? new Date(acceptFormData.appointmentDate).toLocaleDateString() : 'No date selected'}
                      </div>
                    </div>
                    <div className="modal__field">
                      <label>Preferred Time (Mom's Choice)</label>
                      <div className="modal__readonly-field">
                        {selectedRequest?.preferredTime || 'No time preference'}
                      </div>
                    </div>
                    <div className="modal__field">
                      <label>Start Time *</label>
                      <select
                        value={acceptFormData.startTime}
                        onChange={(e) => {
                          setAcceptFormData({ 
                            ...acceptFormData, 
                            startTime: e.target.value,
                            endTime: '' // Reset end time when start time changes
                          });
                        }}
                        required
                        className="modal__time-select"
                      >
                        <option value="">Select start time</option>
                        {getTimeOptions(selectedRequest?.preferredTime).map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <small className="modal__field-hint">
                        Available: {getTimeRange(selectedRequest?.preferredTime).min} - {getTimeRange(selectedRequest?.preferredTime).max}
                      </small>
                    </div>
                    <div className="modal__field">
                      <label>End Time *</label>
                      <select
                        value={acceptFormData.endTime}
                        onChange={(e) => {
                          setAcceptFormData({ ...acceptFormData, endTime: e.target.value });
                        }}
                        required
                        className="modal__time-select"
                        disabled={!acceptFormData.startTime}
                      >
                        <option value="">Select end time</option>
                        {getTimeOptions(selectedRequest?.preferredTime)
                          .filter(time => time > acceptFormData.startTime)
                          .map(time => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="modal__field">
                      <label>Notes (Optional)</label>
                      <textarea
                        value={acceptFormData.notes}
                        onChange={(e) => setAcceptFormData({ ...acceptFormData, notes: e.target.value })}
                        placeholder="Add any additional notes..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary" onClick={() => setIsAcceptModalOpen(false)}>Cancel</button>
                <button className="modal__btn modal__btn--primary" onClick={handleAcceptSubmit}>Accept</button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Request Modal */}
        {isRejectModalOpen && selectedRequest && (
          <div className="modal-overlay" onClick={() => setIsRejectModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Reject Request</h2>
                <button className="modal__close" onClick={() => setIsRejectModalOpen(false)}>
                  <FiX size={20} />
                </button>
      </div>
              <div className="modal__content">
                <div className="modal__section">
                  <h3>Rejection Details</h3>
                  <div className="modal__grid">
                    <div className="modal__field">
                      <label>Reason for Rejection *</label>
                      <textarea
                        value={rejectFormData.reason}
                        onChange={(e) => setRejectFormData({ ...rejectFormData, reason: e.target.value })}
                        placeholder="Please provide a reason for rejecting this request..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary" onClick={() => setIsRejectModalOpen(false)}>Cancel</button>
                <button className="modal__btn modal__btn--danger" onClick={handleRejectSubmit}>Reject</button>
              </div>
            </div>
          </div>
        )}

        {/* Mom Details Modal */}
        {isMomDetailsModalOpen && selectedRequest && (
          <div className="modal-overlay" onClick={() => setIsMomDetailsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Mom Details</h2>
                <button className="modal__close" onClick={() => setIsMomDetailsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal__content">
                <div className="modal__section">
                  <h3>Patient Information</h3>
                  <div className="modal__grid">
                    <div className="modal__field">
                      <label>Name</label>
                      <span>{selectedRequest.mom?.firstName} {selectedRequest.mom?.lastName}</span>
                    </div>
                    <div className="modal__field">
                      <label>Email</label>
                      <span>{selectedRequest.mom?.email}</span>
                    </div>
                    <div className="modal__field">
                      <label>Phone</label>
                      <span>{selectedRequest.mom?.phone || 'Not provided'}</span>
                    </div>
                    <div className="modal__field">
                      <label>Request Type</label>
                      <span>{selectedRequest.requestType}</span>
                    </div>
                    <div className="modal__field">
                      <label>Preferred Date</label>
                      <span>{new Date(selectedRequest.preferredDate).toLocaleDateString()}</span>
                    </div>
                    <div className="modal__field">
                      <label>Preferred Time</label>
                      <span>{selectedRequest.preferredTime}</span>
                    </div>
                    <div className="modal__field">
                      <label>Location</label>
                      <span>{selectedRequest.location}</span>
                    </div>
                    {selectedRequest.notes && (
                      <div className="modal__field">
                        <label>Notes</label>
                        <span>{selectedRequest.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary" onClick={() => setIsMomDetailsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Day Appointments Modal */}
        {isDayAppointmentsModalOpen && selectedDayDate && (
          <div className="modal-overlay" onClick={() => setIsDayAppointmentsModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h2>Appointments for {selectedDayDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h2>
                <button className="modal__close" onClick={() => setIsDayAppointmentsModalOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <div className="modal__content">
                {selectedDayAppointments.length > 0 ? (
                  <div className="modal__section">
                    <h3>Appointments ({selectedDayAppointments.length})</h3>
                    <div className="modal__appointments-list">
                      {selectedDayAppointments.map((appointment, index) => (
                        <div 
                          key={index} 
                          className="modal__appointment-item"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsModalOpen(true);
                            setIsDayAppointmentsModalOpen(false);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="modal__appointment-header">
                            <span className="modal__appointment-time">
                              {appointment.startTime}-{appointment.endTime}
                            </span>
                            <span className={`modal__appointment-type modal__appointment-type--${appointment.color}`}>
                              {appointment.type}
                            </span>
                          </div>
                          <div className="modal__appointment-details">
                            {appointment.mom && (
                              <div className="modal__appointment-mom">
                                <FiUser size={14} />
                                {appointment.mom.firstName} {appointment.mom.lastName}
                              </div>
                            )}
                            {appointment.location && (
                              <div className="modal__appointment-location">
                                <FiMapPin size={14} />
                                {appointment.location}
                              </div>
                            )}
                            {appointment.status === 'completed' && (
                              <div className="modal__appointment-status">
                                <FiCheck size={14} />
                                Completed
                              </div>
                            )}
                            {appointment.isRescheduled && (
                              <div className="modal__appointment-status modal__appointment-status--rescheduled">
                                ↻ Rescheduled to today
                              </div>
                            )}
                            {appointment.originalData?.momNotes && (
                              <div className="modal__appointment-notes">
                                <strong>Mom Notes:</strong> {appointment.originalData.momNotes}
                              </div>
                            )}
                            {appointment.originalData?.midwifeNotes && (
                              <div className="modal__appointment-notes">
                                <strong>Midwife Notes:</strong> {appointment.originalData.midwifeNotes}
                              </div>
                            )}
                            {appointment.notes && !appointment.originalData?.momNotes && !appointment.originalData?.midwifeNotes && (
                              <div className="modal__appointment-notes">
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="modal__section">
                    <h3>No Appointments</h3>
                    <p>There are no appointments scheduled for this day.</p>
                  </div>
                )}
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary" onClick={() => setIsDayAppointmentsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
    </div>
  </div>
  </div>
  );
};

export default Appointments;
