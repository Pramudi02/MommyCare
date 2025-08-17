import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, FileText, AlertCircle } from 'lucide-react';

const ClinicVisitRequestModal = ({ isOpen, onClose, onSubmit, isLoading, selectedCategory }) => {
  const [formData, setFormData] = useState({
    requestType: selectedCategory || '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const requestTypes = [
    'Prenatal Care',
    'Ultrasound',
    'Blood Tests',
    'Vaccination',
    'Emergency Care',
    'Regular Checkup',
    'Laboratory Services',
    'Consultation'
  ];

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Any Time'];

  // Update form when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        requestType: selectedCategory
      }));
    }
  }, [selectedCategory]);

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
    
    if (!formData.requestType) {
      newErrors.requestType = 'Please select a request type';
    }
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
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      requestType: '',
      preferredDate: '',
      preferredTime: '',
      location: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Request Clinic Visit</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type *
            </label>
            <input
              type="text"
              name="requestType"
              value={formData.requestType}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
            {errors.requestType && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.requestType}
              </p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date *
            </label>
            <div className="relative">
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {errors.preferredDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.preferredDate}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time *
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.preferredTime ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select preferred time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.preferredTime && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.preferredTime}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter clinic/hospital location"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.location}
              </p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
              <FileText className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClinicVisitRequestModal;
