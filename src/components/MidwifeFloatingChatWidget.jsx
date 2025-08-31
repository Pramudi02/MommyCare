import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import './MidwifeFloatingChatWidget.css';

const MidwifeFloatingChatWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // User authentication
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is logged in and is a midwife
  useEffect(() => {
    const checkUserAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'midwife') {
          setIsVisible(true);
          // Set current user info
          setCurrentUser({
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('userName') || 'Midwife',
            role: 'midwife'
          });
        }
      } else {
        setIsVisible(false);
      }
    };

    checkUserAuth();
    
    const handleStorageChange = () => {
      checkUserAuth();
    };

    const interval = setInterval(checkUserAuth, 1000);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleChat = () => {
    navigate('/midwife/chat');
  };

  // Hide floating widget when on chat page
  if (!isVisible || location.pathname === '/midwife/chat') return null;

  return (
    <div 
      className="midwife-floating-chat-button"
      onClick={handleToggleChat}
      title="Open Midwife Chat"
    >
      <MessageCircle size={24} />
    </div>
  );
};

export default MidwifeFloatingChatWidget;
