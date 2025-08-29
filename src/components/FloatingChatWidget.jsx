import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FloatingChatWidget.css';

const FloatingChatWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in and is a mom
  useEffect(() => {
    const checkUserAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Check if user is a mom (you can adjust this logic based on your user role system)
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'mom') {
          setIsVisible(true);
        }
      } else {
        setIsVisible(false);
      }
    };

    checkUserAuth();
    
    // Listen for auth changes
    const handleStorageChange = () => {
      checkUserAuth();
    };

    // Check auth status periodically and on storage changes
    const interval = setInterval(checkUserAuth, 1000);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleChat = () => {
    // Navigate to the full chat page
    navigate('/mom/chat');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className="floating-chat-button"
        onClick={handleToggleChat}
        title="Open Healthcare Chat"
      >
        <MessageCircle size={24} />
      </div>
    </>
  );
};

export default FloatingChatWidget;
