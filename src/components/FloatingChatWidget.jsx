import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FloatingChatWidget.css';

const FloatingChatWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Handle unread message count (you can integrate this with your chat system)
  useEffect(() => {
    // This is a placeholder - integrate with your actual chat system
    const checkUnreadMessages = () => {
      // For now, we'll check localStorage for unread count
      // In a real implementation, you'd make an API call to get unread messages
      const storedUnreadCount = localStorage.getItem('unreadMessageCount');
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
          const currentCount = parseInt(localStorage.getItem('unreadMessageCount') || '0');
          const newCount = currentCount + 1;
          localStorage.setItem('unreadMessageCount', newCount.toString());
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
    localStorage.removeItem('unreadMessageCount');
    
    // Navigate to the full chat page
    navigate('/mom/chat');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`floating-chat-button ${unreadCount > 0 ? 'has-new-messages' : ''}`} 
        onClick={handleToggleChat}
        title={unreadCount > 0 ? `You have ${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Open Healthcare Chat'}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="floating-chat-badge">{unreadCount}</span>
        )}
      </div>
    </>
  );
};

export default FloatingChatWidget;
