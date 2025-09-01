import React from 'react';
import { Route } from 'react-router-dom';
import DoctorLayout from '../DoctorLayout';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Appointments from '../pages/Appointments';
import NewAppointment from '../pages/NewAppointment';
import ViewAllAppointments from '../pages/ViewAllAppointments';
import AppointmentRequests from '../pages/AppointmentRequests';
import Prescriptions from '../pages/Prescriptions';
import MedicalRecords from '../pages/MedicalRecords';
import ViewMedicalRecords from '../pages/ViewMedicalRecords';
import SubmitMedicalRecord from '../pages/SubmitMedicalRecord';
import Settings from '../pages/Settings';
import PatientDetails from '../pages/PatientDetails';
import EditProfile from '../pages/EditProfile';

export default (
  <Route path="/doctor" element={<DoctorLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="patients" element={<Patients />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="appointments/new" element={<NewAppointment />} />
    <Route path="appointments/view-all" element={<ViewAllAppointments />} />
    <Route path="appointment-requests" element={<AppointmentRequests />} />
    <Route path="prescriptions" element={<Prescriptions />} />
    <Route path="medical-records" element={<MedicalRecords />} />
    <Route path="medical-records/view/:patientId" element={<ViewMedicalRecords />} />
    <Route path="medical-records/submit/:patientId" element={<SubmitMedicalRecord />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<EditProfile />} />
    <Route path="patient-details/:patientId" element={<PatientDetails/>} />
  </Route>
); 