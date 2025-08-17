import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiMapPin, FiBell, FiX, FiCheck, FiClock, FiUser, FiActivity, FiPlay, FiUsers, FiFileText, FiEye, FiChevronDown } from 'react-icons/fi';
import { midwifeAppointmentAPI } from '../../services/api';
import './Appointments.css';

const Appointments = () => {
  const [currentDateRange, setCurrentDateRange] = useState('');
  const [viewMode, setViewMode] = useState('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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

  // Debug: Log appointments whenever they change
  useEffect(() => {
    console.log('Appointments state changed:', appointments);
    console.log('Appointment requests state changed:', appointmentRequests);
  }, [appointments, appointmentRequests]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch both appointments and clinic visit requests
      const [appointmentsResponse, requestsResponse] = await Promise.all([
        midwifeAppointmentAPI.getAppointments(viewMode),
        midwifeAppointmentAPI.getClinicVisitRequests()
      ]);
      
      console.log('Raw appointments response:', appointmentsResponse);
      console.log('Raw requests response:', requestsResponse);
      console.log('Appointments data:', appointmentsResponse.data);
      console.log('Requests data:', requestsResponse.data);
      
      // Get approved requests from clinic visit requests
      const approvedRequests = (requestsResponse.data || []).filter(req => req.status === 'approved');
      console.log('Approved requests:', approvedRequests);
      
      // Combine appointments with approved requests
      const allAppointments = [
        ...(appointmentsResponse.data || []),
        ...approvedRequests.map(req => ({
          _id: req._id,
          startTime: req.appointmentDateTime || req.appointmentDate,
          endTime: req.endDateTime || req.appointmentDate,
          type: req.requestType || 'Appointment',
          location: req.location || 'Location TBD',
          mom: req.mom,
          status: 'approved',
          notes: req.notes,
          source: 'clinicVisitRequest'
        }))
      ];
      
      console.log('Combined appointments:', allAppointments);
      console.log('Setting appointments state to:', allAppointments);
      setAppointments(allAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      console.error('Error details:', err.message, err.stack);
      setError('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Get current week dates
  const getCurrentWeekDates = (date = new Date()) => {
    const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Always start from Monday (1)
    // If current day is Sunday (0), go back 6 days to get to Monday
    // If current day is Monday (1), no offset needed (0)
    // If current day is Tuesday (2), go back 1 day to get to Monday
    // If current day is Wednesday (3), go back 2 days to get to Monday
    // And so on...
    const mondayOffset = currentDay === 0 ? -6 : -(currentDay - 1);
    
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

  // Format week range for display
  const formatWeekRange = (weekDates) => {
    const start = weekDates[0];
    const end = weekDates[6];
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}/${start.getMonth() + 1}-${end.getDate()}/${end.getMonth() + 1}`;
    } else {
      return `${startMonth} ${start.getDate()}/${start.getMonth() + 1}-${endMonth} ${end.getDate()}/${end.getMonth() + 1}`;
    }
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
      case 'week':
        const weekDates = getCurrentWeekDates(date);
        setCurrentDateRange(formatWeekRange(weekDates));
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
      alert('Please fill in start time and end time');
      return;
    }

    // Validate that start time is before end time
    if (acceptFormData.startTime >= acceptFormData.endTime) {
      alert('Start time must be before end time');
      return;
    }

    // Validate that start time is before end time (dropdowns should handle this, but double-check)
    if (acceptFormData.startTime >= acceptFormData.endTime) {
      alert('Start time must be before end time');
      return;
    }

    // Validate that appointment is not in the past
    const { date, time } = getCurrentDateTime();
    if (acceptFormData.appointmentDate < date || 
        (acceptFormData.appointmentDate === date && acceptFormData.startTime < time)) {
      alert('Appointment cannot be scheduled in the past');
      return;
    }

    try {
      setIsLoading(true);
      await midwifeAppointmentAPI.acceptClinicVisitRequest(selectedRequest._id, acceptFormData);
      
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
      alert('Failed to accept request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectFormData.reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setIsLoading(true);
      await midwifeAppointmentAPI.rejectClinicVisitRequest(selectedRequest._id, rejectFormData.reason);
      
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
        alert('Failed to reject request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform real appointment data to display format
  const transformAppointmentData = (appointment) => {
    console.log('Transforming appointment:', appointment);
    
    // Handle different possible field names from backend
    let startTime = appointment.startTime || appointment.appointmentTime || appointment.startDateTime;
    let endTime = appointment.endTime || appointment.endDateTime;
    
    // Handle clinic visit requests that might have different structure
    if (appointment.source === 'clinicVisitRequest') {
      startTime = appointment.startTime || appointment.appointmentDateTime || appointment.appointmentDate;
      endTime = appointment.endTime || appointment.endDateTime || appointment.appointmentDate;
    }
    
    console.log('Extracted startTime:', startTime);
    console.log('Extracted endTime:', endTime);
    
    if (!startTime) {
      console.warn('Appointment missing start time:', appointment);
      return null;
    }
    
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : new Date(startTime);
    
    console.log('Parsed startDate:', startDate);
    console.log('Parsed endDate:', endDate);
    
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
      type: appointment.type || appointment.title || appointment.appointmentType || appointment.requestType || 'Appointment',
      icon: getAppointmentIcon(appointment.type || appointment.appointmentType || appointment.requestType),
      location: appointment.location?.clinicName || appointment.location?.address || appointment.location || 'Location TBD',
      color: getAppointmentColor(appointment.type || appointment.appointmentType || appointment.requestType),
      mom: appointment.mom || appointment.patient,
      status: appointment.status || 'scheduled',
      notes: appointment.notes,
      originalData: appointment
    };
    
    console.log('Transformed appointment:', transformed);
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

  // Transform appointments for display and filter for approved appointments only
  const displayAppointments = appointments
    .map(transformAppointmentData)
    .filter(apt => apt !== null);
  
  console.log('Raw appointments before transform:', appointments);
  console.log('Transformed appointments:', displayAppointments);
  
  console.log('Display appointments after transform:', displayAppointments);
  
  // If no appointments found, show some sample data for testing
  const getSampleAppointments = () => {
    const currentWeekDates = getCurrentWeekDates(selectedDate);
    const currentMonthDates = getCurrentMonthDates(selectedDate);
    const monday = currentWeekDates[0]; // Monday
    const wednesday = currentWeekDates[2]; // Wednesday
    
    // Generate sample appointments for the current month
    const sampleAppointments = [];
    
    // Add some appointments for the current month
    const monthStart = new Date(currentMonthDates.firstDay);
    const monthEnd = new Date(currentMonthDates.lastDay);
    
    // Add appointments on different days of the month
    for (let i = 0; i < 5; i++) {
      const randomDay = new Date(monthStart);
      randomDay.setDate(monthStart.getDate() + Math.floor(Math.random() * (monthEnd.getDate() - monthStart.getDate() + 1)));
      
      const dayName = randomDay.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const date = `${randomDay.getDate().toString().padStart(2, '0')}/${(randomDay.getMonth() + 1).toString().padStart(2, '0')}`;
      
      sampleAppointments.push({
        id: `sample-${i + 1}`,
        day: dayName,
        date: date,
      startTime: '09:00',
      endTime: '09:30',
        type: 'Baby Weight Check',
      icon: 'medical',
        location: 'Kalubowila Clinic',
      color: 'pink',
        mom: { firstName: `Mom ${i + 1}`, lastName: 'Sample' },
        status: 'approved',
        notes: 'Regular checkup',
        originalData: {
          startTime: new Date(randomDay.getFullYear(), randomDay.getMonth(), randomDay.getDate(), 9, 0, 0),
          endTime: new Date(randomDay.getFullYear(), randomDay.getMonth(), randomDay.getDate(), 9, 30, 0)
        }
      });
    }
    
    return sampleAppointments;
  };
  
  const sampleAppointments = getSampleAppointments();
  
  const finalAppointments = displayAppointments.length > 0 ? displayAppointments : sampleAppointments;
  
  console.log('Original appointments:', appointments);
  console.log('Transformed appointments:', displayAppointments);
  console.log('Sample appointments:', sampleAppointments);
  console.log('Final appointments to display:', finalAppointments);

  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Generate days array based on view mode
  const getDaysForViewMode = () => {
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
        
      case 'week':
        const weekDates = getCurrentWeekDates(selectedDate);
        return weekDates.map((date, index) => {
          const dayNames = ['SU', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THU', 'FR', 'SA'];
          const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          
          return {
            name: dayNames[index],
            date: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            key: dayKeys[index],
            current: date.toDateString() === currentDateString,
            weekend: index === 0 || index === 6,
            fullDate: date
          };
        });
        
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
  
  console.log('Days array:', days);
  console.log('Sample appointments:', sampleAppointments);



  const getAppointmentsForTimeSlot = (day, time) => {
    const filtered = finalAppointments.filter(apt => {
      // Check if appointment is on the correct day
      const appointmentDate = new Date(apt.originalData.startTime || apt.originalData.appointmentTime || apt.originalData.startDateTime);
      const dayDate = days.find(d => d.key === day)?.fullDate;
      
      if (!dayDate || !appointmentDate) return false;
      
      const isSameDay = appointmentDate.toDateString() === dayDate.toDateString();
      const isSameTime = apt.startTime === time;
      
      if (isSameDay && isSameTime) {
        console.log(`Found appointment for ${day} at ${time}:`, apt);
      }
      
      return isSameDay && isSameTime;
    });
    
    if (filtered.length === 0) {
      console.log(`No appointments found for ${day} at ${time}`);
    }
    
    return filtered;
  };

  const getAppointmentsForDay = (day) => {
    const filtered = finalAppointments.filter(apt => {
      const appointmentDate = new Date(apt.originalData.startTime || apt.originalData.appointmentTime || apt.originalData.startDateTime);
      const dayDate = days.find(d => d.key === day)?.fullDate;
      
      if (!dayDate || !appointmentDate) return false;
      
      const isSameDay = appointmentDate.toDateString() === dayDate.toDateString();
      
      if (isSameDay) {
        console.log(`Found appointment for ${day}:`, apt);
      }
      
      return isSameDay;
    });
    
    console.log(`Appointments for ${day}:`, filtered);
    return filtered;
  };

  // Get appointments for a specific date string
  const getAppointmentsForDateString = (dateString) => {
    console.log('getAppointmentsForDateString called with:', dateString);
    console.log('finalAppointments:', finalAppointments);
    
    return finalAppointments.filter(apt => {
      // For transformed appointments, the date is already in the apt object
      // We need to reconstruct the date from the day and date fields
      if (apt.day && apt.date) {
        // Get current year and month from selectedDate
        const currentYear = selectedDate.getFullYear();
        const currentMonth = selectedDate.getMonth();
        
        // Parse the date string (format: "MM/DD")
        const [month, day] = apt.date.split('/').map(Number);
        
        // Create a date object for comparison
        const appointmentDate = new Date(currentYear, month - 1, day);
        const result = appointmentDate.toDateString() === dateString;
        
        if (result) {
          console.log('Found matching appointment by day/date:', apt, 'for date:', dateString);
        }
        
        return result;
      }
      
      // Fallback: try to get date from original data
      const dateField = apt.originalData?.startTime || apt.originalData?.appointmentTime || apt.originalData?.startDateTime;
      
      if (dateField) {
        const appointmentDate = new Date(dateField);
        const result = appointmentDate.toDateString() === dateString;
        
        if (result) {
          console.log('Found matching appointment by original data:', apt, 'for date:', dateString);
        }
        
        return result;
      }
      
      console.warn('No date field found for appointment:', apt);
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

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const currentTime = getCurrentTime();

  const getCurrentTimePosition = () => {
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentMinutes = currentHour * 60 + currentMinute;
    
    // Find the closest time slot
    let closestSlot = timeSlots[0];
    let minDifference = Math.abs(currentMinutes - (7 * 60)); // 7 AM in minutes
    
    timeSlots.forEach(slot => {
      const [slotHour, slotMinute] = slot.split(':').map(Number);
      const slotMinutes = slotHour * 60 + slotMinute;
      const difference = Math.abs(currentMinutes - slotMinutes);
      
      if (difference < minDifference) {
        minDifference = difference;
        closestSlot = slot;
      }
    });
    
    // Calculate position: header height (60px) + time slot index * slot height (30px)
    const slotIndex = timeSlots.indexOf(closestSlot);
    return 60 + (slotIndex * 30);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Update appointments when view mode changes
  useEffect(() => {
    fetchAppointments();
  }, [viewMode]);

  // Force re-render of month view when appointments change
  useEffect(() => {
    if (viewMode === 'month') {
      // This will trigger a re-render of the month view
      setSelectedDate(new Date(selectedDate));
    }
  }, [appointments, viewMode]);

  // Update date range when view mode or selected date changes
  useEffect(() => {
    updateDateRange(viewMode, selectedDate);
  }, [viewMode, selectedDate]);

  const renderTodayView = () => {
    const currentDayKey = days.find(d => d.current)?.key || 'thursday';
    const currentDayName = days.find(d => d.current)?.name || 'THU';
    const currentDayDate = days.find(d => d.current)?.fullDate;
    
    const todayAppointments = getAppointmentsForDay(currentDayKey);
    
    return (
      <div className="appointments-calendar__today-view">
        <div className="appointments-calendar__today-header">
          <h2>Today - {currentDayName}, {currentDayDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
        </div>
        <div className="appointments-calendar__today-timeline">
          {todayAppointments.length > 0 ? (
            timeSlots.map(time => {
            const timeAppointments = todayAppointments.filter(apt => apt.startTime === time);
            return (
              <div key={time} className="appointments-calendar__today-time-slot">
                <div className="appointments-calendar__today-time">{time}</div>
                <div className="appointments-calendar__today-events">
                  {timeAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`appointments-calendar__today-event appointments-calendar__event--${appointment.color}`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                       <div className="appointments-calendar__today-event-icon">
                         {getIconComponent(appointment.icon)}
                      </div>
                       <div className="appointments-calendar__today-event-mom">
                         {appointment.mom?.firstName} {appointment.mom?.lastName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            })
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
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  console.log(`Day ${day.toDateString()}: ${dayAppointments.length} appointments`);
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`appointments-calendar__month-day ${isToday ? 'today' : ''} ${dayAppointments.length > 0 ? 'has-appointments' : ''}`}
                      onClick={() => handleDayClick(day)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="appointments-calendar__month-day-number">{day.getDate()}</span>
                      {dayAppointments.length > 0 && (
                        <div className="appointments-calendar__month-day-indicator">
                          {dayAppointments.length}
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

  const renderWeekView = () => {
    return (
      <div className="appointments-calendar__grid">
        <div className="appointments-calendar__time-column">
          <div className="appointments-calendar__time-header"></div>
          {timeSlots.map(time => (
            <div key={time} className="appointments-calendar__time-slot">
              {time}
            </div>
          ))}
        </div>

        {days.map(day => (
          <div key={day.key} className="appointments-calendar__day-column">
            <div className={`appointments-calendar__day-header ${day.current ? 'current' : ''} ${day.weekend ? 'weekend' : ''}`}>
              <div className="appointments-calendar__day-name">{day.name}</div>
              <div className="appointments-calendar__day-date">{day.date}</div>
            </div>
            
            {timeSlots.map(time => {
              const dayAppointments = getAppointmentsForTimeSlot(day.key, time);
              return (
                <div key={time} className="appointments-calendar__time-cell">
                  {dayAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`appointments-calendar__event appointments-calendar__event--${appointment.color}`}
                      style={{
                        gridRow: `span ${calculateAppointmentSpan(appointment.startTime, appointment.endTime)}`
                      }}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                        <div className="appointments-calendar__event-icon">
                          {getIconComponent(appointment.icon)}
                        </div>
                      <div className="appointments-calendar__event-mom">
                        {appointment.mom?.firstName} {appointment.mom?.lastName}
                        </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* Current time indicator */}
        <div 
          className="appointments-calendar__current-time"
          style={{
            top: `${getCurrentTimePosition()}px`
          }}
        >
          <div className="appointments-calendar__current-time-line"></div>
          <div className="appointments-calendar__current-time-label">
            {currentTime}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="appointments-calendar">
      <div className="appointments-calendar-container">
        <div className="appointments-calendar-content">
          <div className="appointments-calendar__main">
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

        </div>

        <div className="appointments-calendar__filters">
          <div className="appointments-calendar__week-selector">
            <button 
              className="appointments-calendar__week-btn"
              onClick={() => {
                if (viewMode === 'week' || viewMode === 'month') {
                  setShowDatePicker(!showDatePicker);
                }
              }}
              title={viewMode === 'week' || viewMode === 'month' ? 'Click to change date' : 'Current date'}
            >
              {currentDateRange}
              <FiCalendar size={16} />
            </button>
            {showDatePicker && viewMode === 'week' && (
              <div className="appointments-calendar__date-picker">
                <div className="appointments-calendar__date-picker-header">
                  <h4>Select Week</h4>
                  <button 
                    className="appointments-calendar__date-picker-close"
                    onClick={() => setShowDatePicker(false)}
                  >
                    <FiX size={16} />
            </button>
                </div>
                <div className="appointments-calendar__date-picker-content">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateSelection(new Date(e.target.value))}
                    className="appointments-calendar__date-input"
                  />
                  <small>Select any date in the week you want to view</small>
                </div>
              </div>
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
              className={`appointments-calendar__view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('week')}
            >
              Week
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
            {viewMode === 'week' && renderWeekView()}
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
                    {selectedAppointment.notes && (
                      <div className="modal__field">
                        <label>Notes</label>
                        <span>{selectedAppointment.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal__actions">
                <button className="modal__btn modal__btn--secondary">Reschedule</button>
                <button className="modal__btn modal__btn--primary">Mark Complete</button>
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
                        <div key={index} className="modal__appointment-item">
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
                            {appointment.notes && (
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
