import React from 'react';
import { Calendar, Clock, MapPin, FileText, X, CheckCircle, XCircle, Clock as ClockIcon, AlertCircle } from 'lucide-react';

const DoctorVisitRequestsList = ({ requests, onCancelRequest, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <X size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    return timeString;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctor Visit Requests</h3>
        <p className="text-gray-500">You haven't made any doctor visit requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request._id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
              <span className="text-xs text-gray-500">
                Requested {formatDate(request.createdAt)}
              </span>
            </div>
            {request.status === 'pending' && (
              <button
                onClick={() => onCancelRequest(request._id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                title="Cancel request"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Request Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-pink-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              </div>
              <span className="font-medium text-gray-900">{request.requestType}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>Preferred: {formatDate(request.preferredDate)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <span>Time: {formatTime(request.preferredTime)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span>{request.location}</span>
              </div>
            </div>

            {/* Notes */}
            {request.notes && (
              <div className="flex items-start space-x-2 text-gray-600">
                <FileText size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{request.notes}</span>
              </div>
            )}

            {/* Appointment Details (if approved) */}
            {request.status === 'approved' && (request.appointmentDate || request.appointmentTime) && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Appointment Confirmed</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                  {request.appointmentDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{formatDate(request.appointmentDate)}</span>
                    </div>
                  )}
                  {request.appointmentTime && (
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{request.appointmentTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Notes (if any) */}
            {request.adminNotes && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-1">Admin Notes</h4>
                <p className="text-sm text-blue-700">{request.adminNotes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorVisitRequestsList;
