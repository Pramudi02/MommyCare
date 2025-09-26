
# MommyCare Platform

Comprehensive pregnancy and baby care platform for moms, doctors, midwives, service providers, and admins. Built with React, Vite, Node.js, MongoDB, and Python AI backend.

---

## 🧑‍🤝‍🧑 User Roles

- **Mom**: Pregnant women using the platform
- **Doctor**: Healthcare providers
- **Midwife**: Field healthcare staff
- **Service Provider**: Product/service vendors
- **Admin**: Platform administrators

---

## 🚀 Main Features

### 1. Authentication & Profile Management
- JWT-based login/register for all users
- Role-based access and protected routes
- Profile dropdown, edit profile, password change
- Mom profile: medical, personal, location, emergency info

### 2. Admin System
- Secure admin login and dashboard
- User management (view, activate/deactivate, delete)
- Role/permission management
- Statistics: user counts, engagement, registrations
- Permission request management

### 3. Mom System
- Detailed mom profile management
- Medical history, pregnancy info, BMI calculation
- Clinic visit requests
- Vaccination tracking and appointment requests

### 4. Doctor & Midwife System
- Dashboard for appointments, patients, and requests
- Approve/reject clinic visit and vaccination requests
- Messaging with moms

### 5. Service Provider System
- Product management
- Order management
- Dashboard for service providers

### 6. Clinic Visit Request System
- Moms request clinic visits via modal form
- Status tracking: pending, approved, rejected, completed, cancelled
- Admin/midwife management of requests

### 7. Vaccination System
- Vaccination timeline and status (completed, upcoming, due, missed)
- Appointment requests for vaccinations
- WHO-based schedule, batch numbers, adverse effects

### 8. Appointments & Messaging
- Book, view, update, and delete appointments
- Real-time chat between moms and doctors
- File upload (images, documents)
- Socket.io for live updates

### 9. AI Integration
- Python FastAPI backend for baby weight prediction & diabetes risk
- Real dataset (babies.csv) for ML model training
- REST API for predictions
- Fallback to local calculations if AI backend unavailable

### 10. Security & Validation
- JWT authentication, protected routes
- Input validation, error handling
- Role-based permissions
- Secure token storage and session management

---

## 🏗️ System Architecture

### Frontend
- React + Vite
- Context API for auth state
- Tailwind CSS for responsive design

### Backend (Node.js)
- Express.js REST API
- Multi-database: Auth, MommyCareData, Test
- Models: User, Appointment, Message, ClinicVisitRequest, VaccinationRecord, etc.
- Role-based routes and controllers
- Socket.io for real-time messaging

### AI Backend (Python)
- FastAPI server
- ML models: baby weight predictor, diabetes predictor
- Data processing, model training, prediction endpoints
- CSV uploads and model retraining

---

## 🧩 Integrations

- **Socket.io**: Real-time chat, appointment updates
- **Cloudinary**: File/image uploads
- **MongoDB Atlas**: Cloud database
- **FastAPI**: AI backend

---

## 🧑‍💻 Getting Started

1. Clone repo & install dependencies (`npm install`)
2. Configure `.env` files for backend, frontend, and AI backend
3. Start MongoDB and backend server (`npm run dev`)
4. Start frontend (`npm run dev`)
5. Start AI backend (`python main.py` in `ai_backend`)

---

## 📝 Support & Troubleshooting

- Check backend/frontend/AI logs for errors
- Verify environment variables
- Use working admin credentials for admin access
- See individual module READMEs for more details

---

## 📖 Additional Documentation

- `ADMIN_SETUP_README.md`: Admin system setup
- `PROFILE_SYSTEM_README.md`: Profile dropdown system
- `MOM_PROFILE_SYSTEM_README.md`: Mom profile management
- `VACCINATION_SYSTEM_README.md`: Vaccination system
- `CLINIC_VISIT_SETUP.md`: Clinic visit request system
- `AI_INTEGRATION_GUIDE.md`: AI backend integration

---

## 🎉 Summary

MommyCare is a full-featured platform for pregnancy and baby care, supporting multiple user roles, secure authentication, medical and appointment management, vaccination tracking, AI-powered predictions, and real-time communication. See module READMEs for deep dives into each feature!
