import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const DoctorVisitRequestModal = ({ isOpen, onClose, onSubmit, isLoading, selectedCategory }) => {
  const [formData, setFormData] = useState({
    requestType: selectedCategory || '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  const timeSlots = ['Morning', 'Afternoon', 'Any Time'];

  // Update form when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        requestType: selectedCategory
      }));
    }
  }, [selectedCategory]);

  // Reset form each time modal opens to avoid stale values
  useEffect(() => {
    if (isOpen) {
      setFormData({
        requestType: selectedCategory || '',
        preferredDate: '',
        preferredTime: '',
        location: '',
        notes: ''
      });
      setErrors({});
      setShowCalendar(false);
      setCurrentDate(new Date());
    }
  }, [isOpen, selectedCategory]);

  // Handle click outside calendar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    }
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter a location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      requestType: selectedCategory || '',
      preferredDate: '',
      preferredTime: '',
      location: '',
      notes: ''
    });
    setErrors({});
    setShowCalendar(false);
    onClose();
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      // Format as YYYY-MM-DD in local time to avoid timezone shift
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const ymd = `${year}-${month}-${dayStr}`;
      setFormData(prev => ({ ...prev, preferredDate: ymd }));
      setShowCalendar(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'next') {
        newDate.setMonth(prev.getMonth() + 1);
      } else {
        newDate.setMonth(prev.getMonth() - 1);
      }
      return newDate;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!day || !formData.preferredDate) return false;
    const selectedDate = new Date(formData.preferredDate);
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-20">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Request Doctor Visit</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type <span className="text-red-500">*</span>
            </label>
            <div className="w-full px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-700 font-medium">
              {selectedCategory || 'No category selected'}
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="preferredDate"
                value={formData.preferredDate ? (() => { const [y,m,d] = formData.preferredDate.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString(); })() : ''}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
                placeholder="Click to select date"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-colors cursor-pointer ${
                  errors.preferredDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            
            {/* Calendar Popup */}
            {showCalendar && (
              <div ref={calendarRef} className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h3 className="text-sm font-semibold">{formatDate(currentDate)}</h3>
                  <button
                    type="button"
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      disabled={!day || isPastDate(day)}
                      className={`p-1 text-xs rounded transition-colors ${
                        !day 
                          ? 'invisible' 
                          : isPastDate(day)
                          ? 'text-gray-300 cursor-not-allowed'
                          : isToday(day)
                          ? 'bg-cyan-500 text-white font-bold'
                          : isSelected(day)
                          ? 'bg-cyan-200 text-cyan-800 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {errors.preferredDate && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.preferredDate}
              </div>
            )}
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className={`mc-preferred-time-select w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-colors ${
                  errors.preferredTime ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select preferred time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            {errors.preferredTime && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.preferredTime}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter clinic/hospital location"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-colors ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <MapPin className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
            {errors.location && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {errors.location}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <div className="relative">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information or special requirements..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-colors resize-none"
              />
              <FileText className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.notes.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorVisitRequestModal;
