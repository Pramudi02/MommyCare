import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from './chat';

const ChatPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Navigate back to the previous page or home
    navigate('/mom');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.5)'
    }}>
      <ChatBox 
        isOpen={true} 
        onClose={handleClose} 
        isFloating={false}
      />
    </div>
  );
};

export default ChatPage;
