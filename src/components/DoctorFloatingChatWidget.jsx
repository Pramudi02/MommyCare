import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FloatingChatWidget.css';

const DoctorFloatingChatWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Check if user is logged in and is a doctor
  useEffect(() => {
    const checkUserAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        // Check if user is a doctor
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'doctor') {
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

  // Handle unread message count (you can integrate this with your chat system)
  useEffect(() => {
    // This is a placeholder - integrate with your actual chat system
    const checkUnreadMessages = () => {
      // For now, we'll check localStorage for unread count
      // In a real implementation, you'd make an API call to get unread messages
      const storedUnreadCount = localStorage.getItem('doctorUnreadMessageCount');
      if (storedUnreadCount) {
        setUnreadCount(parseInt(storedUnreadCount));
      }
    };

    if (isVisible) {
      checkUnreadMessages();
      const interval = setInterval(checkUnreadMessages, 10000); // Check every 10 seconds
      
      // Simulate new messages for testing (remove this in production)
      const testInterval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 10 seconds
          const currentCount = parseInt(localStorage.getItem('doctorUnreadMessageCount') || '0');
          const newCount = currentCount + 1;
          localStorage.setItem('doctorUnreadMessageCount', newCount.toString());
          setUnreadCount(newCount);
        }
      }, 10000);
      
      return () => {
        clearInterval(interval);
        clearInterval(testInterval);
      };
    }
  }, [isVisible]);

  const handleToggleChat = () => {
    // Clear unread count when opening chat
    setUnreadCount(0);
    localStorage.removeItem('doctorUnreadMessageCount');
    
    // Navigate to the doctor chat page
    navigate('/doctor/chat');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`floating-chat-button doctor-floating-chat ${unreadCount > 0 ? 'has-new-messages' : ''}`} 
        onClick={handleToggleChat}
        title={unreadCount > 0 ? `You have ${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Open Patient Chat'}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="floating-chat-badge">{unreadCount}</span>
        )}
      </div>
    </>
  );
};

export default DoctorFloatingChatWidget;
