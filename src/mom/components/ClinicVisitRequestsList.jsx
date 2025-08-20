import React from 'react';
import { Calendar, Clock, MapPin, FileText, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

const ClinicVisitRequestsList = ({ requests, onCancel, isLoading, isAuthenticated }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No clinic visit requests yet</h3>
        <p className="text-gray-500 mb-4">Select a clinic service above and click "Request Clinic Visit" to create your first request.</p>
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> You need to be logged in to create and view clinic visit requests.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Clinic Visit Requests</h3>
      
      {requests.map((request) => (
        <div
          key={request._id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
              {getStatusIcon(request.status)}
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(request.createdAt)}
            </span>
          </div>

          {/* Request Type */}
          <h4 className="font-medium text-gray-900 mb-2">
            {request.requestType}
          </h4>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Preferred: {formatDate(request.preferredDate)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Time: {formatTime(request.preferredTime)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{request.location}</span>
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="mb-3">
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{request.notes}</span>
              </div>
            </div>
          )}

          {/* Midwife Note - Combined appointment details and admin notes */}
          {(((request.status === 'approved') && (request.appointmentDate || request.appointmentTime)) || request.adminNotes) && (
            <div className="mc-midwife-note mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Midwife Note</h4>

              {/* Appointment Details (if approved) */}
              {request.status === 'approved' && (request.appointmentDate || request.appointmentTime) && (
                <div className="mb-3 pb-3 border-b border-blue-200">
                  <div className="text-sm text-blue-700 mb-2">Appointment Confirmed:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                    {request.appointmentDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(request.appointmentDate)}</span>
                      </div>
                    )}
                    {request.appointmentTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(request.appointmentTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {request.adminNotes && (
                <div className="text-sm text-blue-700">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <div className="font-medium mb-1">Notes:</div>
                      <p>{request.adminNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => onCancel(request._id)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel Request
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClinicVisitRequestsList;
