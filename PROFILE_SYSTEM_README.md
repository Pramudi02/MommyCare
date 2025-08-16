# 🎯 MommyCare Profile System

## 📋 Overview

The MommyCare Profile System provides a seamless user experience with a profile dropdown in the MainNavbar that shows user information and provides quick access to profile management and logout functionality.

## ✨ Features

### 🔐 Authentication State Management
- **Automatic Detection**: Automatically detects if user is logged in
- **Token Persistence**: Stores JWT tokens in localStorage/sessionStorage
- **Context Management**: Uses React Context for global auth state

### 👤 Profile Display
- **Avatar with Initials**: Shows user initials in a gradient circle
- **User Information**: Displays first name, last name, and role
- **Responsive Design**: Adapts to different screen sizes

### 📱 Dropdown Menu
- **Profile Header**: Shows detailed user info with larger avatar
- **Edit Profile**: Quick access to profile editing
- **Logout**: Secure logout with token cleanup
- **Click Outside**: Closes dropdown when clicking elsewhere

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   └── MainNavbar/
│       ├── MainNavbar.jsx      # Main navbar with profile dropdown
│       ├── MainNavbar.css      # Styling for navbar and dropdown
│       └── Profile.jsx         # Profile page component
├── context/
│   └── AuthContext.jsx         # Authentication context provider
├── hooks/
│   └── useAuth.js              # Hook to access auth context
└── services/
    └── api.js                  # API service functions
```

### Backend API Endpoints
```
GET /api/auth/me              # Get current user profile
PUT /api/auth/profile         # Update user profile
PUT /api/auth/password        # Update user password
POST /api/auth/logout         # Logout user
```

## 🚀 Getting Started

### 1. Backend Setup
Ensure your backend server is running with the auth endpoints:

```bash
cd backend
npm start
```

### 2. Test Backend API
```bash
cd backend
node test-profile-api.js
```

### 3. Frontend Integration
The MainNavbar automatically integrates with the AuthContext. Make sure your app is wrapped with the AuthProvider:

```jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
}
```

## 🔄 User Flow

### 1. **Not Logged In**
- Shows Login and Sign Up buttons
- Clean, simple interface

### 2. **After Login**
- Login/Signup buttons replaced with profile dropdown
- Shows user avatar with initials
- Displays first name, last name, and role

### 3. **Profile Dropdown**
- Click avatar to open dropdown
- Shows detailed user information
- Provides Edit Profile and Logout options

### 4. **Profile Management**
- Edit Profile navigates to role-specific profile page
- Logout clears tokens and redirects to home

## 🎨 Styling

### Avatar Design
- **Gradient Background**: Blue to pink gradient
- **Initials Display**: User's first and last name initials
- **Fallback Icon**: User icon when no name available
- **Hover Effects**: Subtle scale and shadow on hover

### Dropdown Styling
- **Clean White Background**: Professional appearance
- **Shadow Effects**: Subtle depth and separation
- **Smooth Animations**: Slide-down animation on open
- **Responsive Layout**: Adapts to mobile and desktop

## 🔧 Configuration

### Environment Variables
```env
VITE_API_URL=http://localhost:5000/api
```

### Token Storage
- **Primary**: localStorage (persistent across sessions)
- **Fallback**: sessionStorage (cleared on tab close)

### API Headers
```javascript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 📱 Responsive Behavior

### Desktop View
- Full profile information displayed
- Hover effects and smooth transitions
- Large dropdown with detailed layout

### Mobile View
- Compact avatar display
- Touch-friendly dropdown
- Optimized spacing for small screens

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-profile-api.js
```

### Frontend Testing
1. **Login Flow**: Test login and profile display
2. **Dropdown Interaction**: Test opening/closing dropdown
3. **Profile Navigation**: Test edit profile navigation
4. **Logout Flow**: Test logout and cleanup

## 🚨 Error Handling

### Network Errors
- Graceful fallback to default user display
- Error logging for debugging
- User-friendly error messages

### Authentication Errors
- Automatic token cleanup on auth failure
- Redirect to login page
- Clear user state

## 🔒 Security Features

### Token Management
- **Secure Storage**: Tokens stored in browser storage
- **Automatic Cleanup**: Tokens cleared on logout
- **Validation**: Backend validates all requests

### Route Protection
- **Private Routes**: Profile pages require authentication
- **Automatic Redirects**: Unauthorized users redirected to login
- **Context Validation**: Frontend validates auth state

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Profile data fetched only when needed
- **Caching**: User data cached in context
- **Minimal Re-renders**: Efficient state management

### Loading States
- **Skeleton Loading**: Smooth loading experience
- **Progressive Enhancement**: Basic functionality works without JS
- **Error Boundaries**: Graceful error handling

## 🎯 Customization

### Avatar Customization
```css
.avatar-container {
    /* Custom avatar styles */
    background: linear-gradient(45deg, #your-color1, #your-color2);
    border-radius: 50%;
    /* Add your custom styles */
}
```

### Dropdown Customization
```css
.profile-dropdown {
    /* Custom dropdown styles */
    background: your-background-color;
    border: your-border-style;
    /* Add your custom styles */
}
```

## 🔄 Future Enhancements

### Planned Features
- **Profile Picture Upload**: Custom avatar images
- **Theme Switching**: Dark/light mode toggle
- **Notification Center**: User notifications in dropdown
- **Quick Actions**: Frequently used actions in dropdown

### Integration Points
- **Permission System**: Role-based access control
- **Analytics**: User behavior tracking
- **Multi-language**: Internationalization support

## 📞 Support

### Common Issues
1. **Profile Not Loading**: Check backend API and token validity
2. **Dropdown Not Opening**: Verify click event handlers
3. **Styling Issues**: Check CSS class names and Tailwind imports

### Debugging
- Check browser console for errors
- Verify API endpoints are accessible
- Confirm AuthContext is properly configured

## 🎉 Success!

Your MommyCare Profile System is now fully functional with:
- ✅ Profile dropdown in MainNavbar
- ✅ User authentication state management
- ✅ Profile editing capabilities
- ✅ Secure logout functionality
- ✅ Responsive design
- ✅ Error handling and loading states

The system provides a professional, user-friendly experience that enhances the overall MommyCare application! 🚀
