import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  X, 
  Search, 
  Filter, 
  User, 
  Users, 
  HeartPulse, 
  Baby, 
  Stethoscope, 
  MoreVertical, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Share, 
  Download, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Calendar, 
  FileText,
  File
} from 'lucide-react';
import './MidwifeChat.css';

const MidwifeChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showChatInfo, setShowChatInfo] = useState(false);
  
  // State for healthcare providers and messages
  const [healthcareProviders, setHealthcareProviders] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for message context menu
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    messageId: null,
    x: 0,
    y: 0
  });
  const [hoveredMessage, setHoveredMessage] = useState(null);
  
  // State for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Socket.IO connection
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // User authentication
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Check if user is logged in and is a midwife
  useEffect(() => {
    const checkUserAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'midwife') {
          // Set current user info
          setCurrentUser({
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('userName') || 'Midwife',
            role: 'midwife'
          });
        }
      }
    };

    checkUserAuth();
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        const newSocket = io('http://localhost:5000', {
          auth: { token },
          transports: ['websocket']
        });

        newSocket.on('connect', () => {
          console.log('✅ Midwife connected to chat server');
          console.log('🔗 Socket ID:', newSocket.id);
          setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from chat server');
          setIsConnected(false);
        });

        newSocket.on('new_message', (data) => {
          console.log('📨 New message received:', data);
          
          // Only add message if it's for the current conversation
          if (data.senderId !== currentUser.id) {
            const newMessage = {
              id: data.id || Date.now(),
              content: data.content,
              sender: data.senderId,
              senderName: data.senderName,
              senderRole: data.senderRole,
              timestamp: data.timestamp,
              status: 'received'
            };
            
            setChatMessages(prev => [...prev, newMessage]);
          }
        });

        newSocket.on('typing', (data) => {
          // Handle typing indicators
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    }
  }, [currentUser]);

  // Fetch real data from database
  useEffect(() => {
    if (currentUser) {
      fetchHealthcareProviders();
      fetchConversations();
    }
  }, [currentUser]);

  const fetchHealthcareProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setHealthcareProviders([]);
        return;
      }
      
      console.log('🏥 Fetching midwife chat users (doctors and moms)...');
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
      
      // Use the new midwife chat users endpoint to get both doctors and moms
      const response = await fetch('http://localhost:5000/api/chat/midwife-chat-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Midwife chat users data received:', data);
        console.log('📊 Data structure:', {
          success: data.success,
          hasData: !!data.data,
          isArray: Array.isArray(data.data),
          dataLength: data.data?.length || 0
        });
        
        if (data.success && data.data && Array.isArray(data.data)) {
          setHealthcareProviders(data.data);
          console.log('✅ Set midwife chat users:', data.data.length, 'users');
        } else {
          console.error('❌ Invalid data format:', data);
          setHealthcareProviders([]);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch midwife chat users:', response.status, errorText);
        setHealthcareProviders([]);
      }
    } catch (error) {
      console.error('Error fetching midwife chat users:', error);
      setHealthcareProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      } else {
        console.error('Failed to fetch conversations');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      const messageToSend = message.trim();
      setMessage(''); // Clear input immediately for better UX

      // Create temporary message for immediate display
      const tempMessage = {
        id: Date.now(),
        content: messageToSend,
        sender: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        timestamp: new Date().toISOString(),
        status: 'sending',
        replyTo: replyingTo
      };

      // Add message to local state immediately
      setChatMessages(prev => [...prev, tempMessage]);
      setReplyingTo(null);

      try {
        // Save message to database
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipientId: selectedChat.id,
            content: messageToSend,
            messageType: 'text',
            replyTo: replyingTo ? replyingTo.id : null
          })
        });

        if (response.ok) {
          const savedMessage = await response.json();
          
          // Update the temporary message with the saved data
          setChatMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, id: savedMessage.data.id, status: 'sent' }
              : msg
          ));

          // Send via socket for real-time delivery
          if (socket && isConnected) {
            socket.emit('send_message', {
              recipientId: selectedChat.id,
              content: messageToSend,
              messageType: 'text',
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              timestamp: new Date().toISOString()
            });
          }

          console.log('✅ Message saved to database and sent via socket');
        } else {
          console.error('❌ Failed to save message to database');
          // Update message status to error
          setChatMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, status: 'error' }
              : msg
          ));
        }
      } catch (error) {
        console.error('❌ Error saving message:', error);
        // Update message status to error
        setChatMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        ));
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectChat = (provider) => {
    setSelectedChat(provider);
    setActiveConversationId(provider.id);
    
    // Fetch real messages from database
    fetchChatMessages(provider.id);
  };

  const fetchChatMessages = async (recipientId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/chat/conversations/${recipientId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.data || []);
      } else {
        console.error('Failed to fetch messages');
        setChatMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setChatMessages([]);
    }
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log(`${type} file selected:`, file.name);
    }
  };

  // Filter providers based on search and type
  const filteredProviders = healthcareProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || provider.role === filterType;
    return matchesSearch && matchesType;
  });

  if (!currentUser) {
    return (
      <div className="midwife-chat-loading">
        <div className="midwife-chat-loading-spinner"></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="midwife-chat-page">
      <div className="midwife-chat-page-content">
        {/* Sidebar - Users List */}
        <div className="midwife-chat-page-sidebar">
          <div className="midwife-chat-page-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="midwife-chat-page-filter">
            <Filter size={16} />
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="doctor">Doctors Only</option>
              <option value="mom">Moms Only</option>
            </select>
          </div>

          <div className="midwife-chat-page-conversations">
            {loading ? (
              <div className="midwife-chat-loading-conversations">
                <div className="midwife-chat-loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              filteredProviders.map(provider => (
                <div
                  key={provider.id}
                  className={`midwife-chat-page-conversation ${
                    activeConversationId === provider.id ? 'active' : ''
                  }`}
                  onClick={() => selectChat(provider)}
                >
                  <div className="midwife-chat-page-avatar">
                    <img src={provider.avatar} alt={provider.name} />
                  </div>
                  <div className="midwife-chat-page-details">
                    <div className="midwife-chat-page-name">
                      {provider.name}
                    </div>
                    <div className="midwife-chat-page-role">
                      {provider.role === 'doctor' ? '👩‍⚕️ Doctor' : '🤱 Mom'}
                    </div>
                    <div className="midwife-chat-page-specialty">
                      {provider.specialty}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="midwife-chat-page-main">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="midwife-chat-page-chat-header">
                <div className="midwife-chat-page-chat-info">
                  <div className="midwife-chat-page-chat-avatar">
                    <img src={selectedChat.avatar} alt={selectedChat.name} />
                  </div>
                  <div>
                    <h3>{selectedChat.name}</h3>
                    <span className="midwife-chat-page-chat-role">
                      {selectedChat.role === 'doctor' ? '👩‍⚕️ Doctor' : '🤱 Mom'}
                    </span>
                  </div>
                </div>
                               <div className="midwife-chat-page-chat-actions">
                 <button 
                   className="midwife-chat-page-action-btn" 
                   title="More options"
                   onClick={() => setShowChatInfo(!showChatInfo)}
                 >
                   <MoreVertical size={18} />
                 </button>
               </div>
              </div>

              {/* Chat Messages */}
              <div className="midwife-chat-page-messages" ref={messagesEndRef}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`midwife-chat-page-message ${
                      msg.sender === 'user' || msg.sender === currentUser.id ? 'outgoing' : 'incoming'
                    }`}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    <div className="midwife-chat-page-message-content">
                      {msg.replyTo && (
                        <div className="midwife-chat-page-message-reply">
                          <span>Replying to: {msg.replyTo.text}</span>
                        </div>
                      )}
                      <div className="midwife-chat-page-message-text">{msg.content || msg.text}</div>
                      <div className="midwife-chat-page-message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="midwife-chat-page-input">
                <div className="midwife-chat-page-input-actions">
                  <button
                    className="midwife-chat-page-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    className="midwife-chat-page-action-btn"
                    onClick={() => imageInputRef.current?.click()}
                    title="Attach image"
                  >
                    <Image size={18} />
                  </button>
                </div>
                
                <div className="midwife-chat-page-input-field">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    rows={1}
                  />
                </div>
                
                <button
                  className="midwife-chat-page-send-btn"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="midwife-chat-page-welcome">
              <div className="midwife-chat-page-welcome-icon">
                <MessageCircle size={64} />
              </div>
              <h2>Welcome to Midwife Communication Hub</h2>
             
              <div className="midwife-chat-page-welcome-features">
                <div className="midwife-chat-page-feature">
                  <Users size={24} />
                  <span>Chat with doctors and moms</span>
                </div>
                <div className="midwife-chat-page-feature">
                  <MessageCircle size={24} />
                  <span>Real-time messaging</span>
                </div>
                <div className="midwife-chat-page-feature">
                  <File size={24} />
                  <span>Share files and documents</span>
                </div>
              </div>
            </div>
          )}
                 </div>

         {/* Chat Info Sidebar */}
         {showChatInfo && selectedChat && (
           <div className="midwife-chat-page-info-sidebar">
             <div className="midwife-chat-page-info-header">
               <h3>User Information</h3>
               <button 
                 className="midwife-chat-page-info-close-btn"
                 onClick={() => setShowChatInfo(false)}
               >
                 <X size={20} />
               </button>
             </div>
             
             <div className="midwife-chat-page-info-content">
               <div className="midwife-chat-page-info-user">
                 <img src={selectedChat.avatar} alt={selectedChat.name} />
                 <h4>{selectedChat.name}</h4>
                 <p className="midwife-chat-page-info-role">
                   {selectedChat.role === 'doctor' ? '👩‍⚕️ Doctor' : '🤱 Mom'}
                 </p>
                 <div className="midwife-chat-page-info-specialty">
                   <span>{selectedChat.specialty}</span>
                 </div>
               </div>
               
               <div className="midwife-chat-page-info-details">
                 <div className="midwife-chat-page-info-item">
                   <User size={16} />
                   <span>Role: {selectedChat.role}</span>
                 </div>
                 <div className="midwife-chat-page-info-item">
                   <MapPin size={16} />
                   <span>Location: {selectedChat.location || 'Medical Center'}</span>
                 </div>
                 <div className="midwife-chat-page-info-item">
                   <Star size={16} />
                   <span>Rating: {selectedChat.rating || '4.8'}</span>
                 </div>
                 <div className="midwife-chat-page-info-item">
                   <Clock size={16} />
                   <span>Experience: {selectedChat.experience || '5+ years'}</span>
                 </div>
                 <div className="midwife-chat-page-info-item">
                   <Calendar size={16} />
                   <span>Next: {selectedChat.nextAppointment || 'TBD'}</span>
                 </div>
                 <div className="midwife-chat-page-info-item">
                   <Shield size={16} />
                   <span>Status: {selectedChat.isActive ? 'Active' : 'Inactive'}</span>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>

       {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e, 'file')}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileUpload(e, 'image')}
        style={{ display: 'none' }}
        accept="image/*"
      />
    </div>
  );
};

export default MidwifeChat;
