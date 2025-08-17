import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  File, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  X,
  Smile,
  Mic,
  Camera,
  Download,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Shield,
  Calendar,
  FileText,
  VideoIcon,
  PhoneCall,
  Star,
  RefreshCw
} from 'lucide-react';
import './DoctorChat.css';

const DoctorChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  // State for moms and messages
  const [moms, setMoms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Socket.IO connection
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // User authentication
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      // listeners will be attached in a separate effect to avoid stale state

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  // Re-bind socket listeners when selection/user changes
  useEffect(() => {
    if (!socket) return;

    socket.off('new_message');
    socket.off('typing_indicator');
    socket.off('message_status_update');

    socket.on('new_message', (data) => {
      const msg = data.message || {};
      const conversationId = data.conversationId;
      
      // Only append messages for the currently active conversation
      if (activeConversationId && conversationId === activeConversationId) {
        setChatMessages(prev => [...prev, {
          id: msg.id,
          // Determine sender based on current user vs message sender
          sender: msg.senderId === currentUser?._id ? 'doctor' : 'mom',
          message: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: msg.messageType,
          status: msg.status || 'delivered'
        }]);
      } else if (!selectedChat && conversationId) {
        // Auto-select the mom who sent the message and load conversation messages
        const momId = msg.senderId === currentUser?._id ? msg.recipientId : msg.senderId;
        const momExists = moms.some(m => m.id === momId);
        if (momExists) {
          setSelectedChat(momId);
          setActiveConversationId(conversationId);
          fetchMessages(conversationId);
          setChatMessages(prev => [...prev, {
            id: msg.id,
            sender: 'mom',
            message: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: msg.messageType,
            status: msg.status || 'delivered'
          }]);
        }
      }
    });

    socket.on('typing_indicator', (data) => {
      const { conversationId, userId, isTyping: typing } = data || {};
      // Only show typing for the currently active conversation
      if (activeConversationId && conversationId === activeConversationId && userId !== currentUser?._id) {
        setIsTyping(!!typing);
      } else {
        setIsTyping(false);
      }
    });

    socket.on('message_status_update', (data) => {
      setChatMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, status: data.status }
          : msg
      ));
    });

    return () => {
      socket.off('new_message');
      socket.off('typing_indicator');
      socket.off('message_status_update');
    };
  }, [socket, selectedChat, currentUser]);

  // Get current user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // Fetch moms (patients)
  const fetchMoms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/chat/search?query=.&role=mom', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const momsList = data.data.map(mom => ({
          id: mom.id,
          name: mom.name,
          type: 'mom',
          specialty: 'Pregnancy Care',
          status: 'online',
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
          rating: 4.8,
          experience: 'First-time mom',
          location: 'Local Area',
          avatar: `https://ui-avatars.com/api/?name=${mom.name}&background=ff6b6b&color=fff`,
          isTyping: false,
          availability: 'Available now',
          nextAppointment: 'TBD'
        }));
        
        setMoms(momsList);
      }
    } catch (error) {
      console.error('Error fetching moms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user conversations
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const messages = data.data.map(msg => ({
          id: msg.id,
          sender: msg.sender === 'user' ? 'doctor' : 'mom',
          message: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: msg.messageType,
          status: msg.read ? 'read' : 'delivered'
        }));
        
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchMoms();
    fetchConversations();
  }, []);

  // Filter moms based on search
  const filteredMoms = moms.filter(mom => {
    const matchesSearch = mom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mom.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (message.trim() && selectedChat && currentUser) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const mom = moms.find(m => m.id === selectedChat);
        if (!mom) return;

        const newMessage = {
          id: Date.now(),
          sender: 'doctor',
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'sending'
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        setMessage('');

        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientId: selectedChat,
            content: message.trim(),
            messageType: 'text'
          })
        });

        if (response.ok) {
          const data = await response.json();
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent', id: data.data.id }
              : msg
          ));

          // Ensure we know the conversationId by refetching conversations
          try {
            const convRes = await fetch('http://localhost:5000/api/chat/conversations', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (convRes.ok) {
              const convData = await convRes.json();
              setConversations(convData.data);
              const conversation = convData.data.find(c => c.participants.some(p => p.id === selectedChat));
              if (conversation) {
                setActiveConversationId(conversation.id);
                if (socket) socket.emit('join_conversation', conversation.id);
              }
            }
          } catch (e) {
            console.error('Error refreshing conversations:', e);
          }
        } else {
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'error' }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setChatMessages(prev => prev.map(msg => 
          msg.id === Date.now()
            ? { ...msg, status: 'error' }
            : msg
        ));
      }
    }
  };

  // Handle typing indicator
  const handleTyping = (isTyping) => {
    if (socket && activeConversationId) {
      socket.emit(isTyping ? 'typing_start' : 'typing_stop', {
        conversationId: activeConversationId,
        userId: currentUser?._id
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && selectedChat && currentUser) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipientId', selectedChat);
        formData.append('messageType', 'file');
        formData.append('content', file.name);

        const newMessage = {
          id: Date.now(),
          sender: 'doctor',
          message: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'file',
          file: file,
          status: 'sending'
        };
        
        setChatMessages(prev => [...prev, newMessage]);

        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent', id: data.data.id }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && selectedChat && currentUser) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipientId', selectedChat);
        formData.append('messageType', 'image');
        formData.append('content', 'Image');

        const newMessage = {
          id: Date.now(),
          sender: 'doctor',
          message: 'Image',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'image',
          file: file,
          status: 'sending'
        };
        
        setChatMessages(prev => [...prev, newMessage]);

        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent', id: data.data.id }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get mom by ID
  const getMomById = (id) => {
    return moms.find(mom => mom.id === id);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Get mom icon
  const getMomIcon = () => {
    return <MessageCircle size={16} />;
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="doctor-chat-container">
      {/* Chat Sidebar */}
      <div className="doctor-chat-sidebar">
        {/* Header */}
        <div className="doctor-chat-sidebar-header">
          <div className="doctor-chat-header-title">
            <MessageCircle size={24} />
            <h2>Healthcare Chat</h2>
          </div>
        
        </div>

        {/* Search */}
        <div className="doctor-chat-search-section">
          <div className="doctor-chat-search-container">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search healthcare providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="doctor-chat-search-input"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="doctor-chat-filter-section">
          <button 
            className={`doctor-chat-filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            ALL
          </button>
          <button 
            className={`doctor-chat-filter-btn ${filterType === 'doctors' ? 'active' : ''}`}
            onClick={() => setFilterType('doctors')}
          >
            <MessageCircle size={16} />
            Patients
          </button>
          <button 
            className={`doctor-chat-filter-btn ${filterType === 'midwives' ? 'active' : ''}`}
            onClick={() => setFilterType('midwives')}
          >
            <MessageCircle size={16} />
            MIDWIVES
          </button>
        </div>

        {/* Moms List */}
        <div className="doctor-chat-moms-list">
          {loading ? (
            <div className="doctor-chat-loading">
              <p>Loading patients...</p>
            </div>
          ) : filteredMoms.length > 0 ? (
            filteredMoms.map(mom => (
              <div
                key={mom.id}
                className={`doctor-chat-mom-item ${selectedChat === mom.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChat(mom.id);
                  const conversation = conversations.find(c => 
                    c.participants.some(p => p.id === mom.id)
                  );
                  if (conversation) {
                    setActiveConversationId(conversation.id);
                    if (socket) socket.emit('join_conversation', conversation.id);
                    fetchMessages(conversation.id);
                  } else {
                    setActiveConversationId(null);
                  }
                }}
              >
                <div className="doctor-chat-mom-avatar">
                  <img src={mom.avatar} alt={mom.name} />
                  <div 
                    className="doctor-chat-status-indicator"
                    style={{ backgroundColor: getStatusColor(mom.status) }}
                  ></div>
                </div>
                
                <div className="doctor-chat-mom-info">
                  <div className="doctor-chat-mom-header">
                    <h3>{mom.name}</h3>
                    <div className="doctor-chat-mom-type">
                      {getMomIcon()}
                      <span>{mom.specialty}</span>
                    </div>
                  </div>
                  
                  <div className="doctor-chat-mom-meta">
                    <p className="doctor-chat-last-message">{mom.lastMessage || 'No messages yet'}</p>
                    <div className="doctor-chat-message-meta">
                      <span className="doctor-chat-time">{mom.lastMessageTime || 'New'}</span>
                      {mom.unreadCount > 0 && (
                        <span className="doctor-chat-unread-badge">{mom.unreadCount}</span>
                      )}
                    </div>
                  </div>
                  
                  {mom.isTyping && (
                    <div className="doctor-chat-typing-indicator">
                      <span>typing...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="doctor-chat-no-moms">
              <p>No healthcare providers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="doctor-chat-main">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="doctor-chat-main-header">
              <div className="doctor-chat-header-info">
                <div className="doctor-chat-header-avatar">
                  <img src={getMomById(selectedChat)?.avatar} alt="Patient" />
                  <div 
                    className="doctor-chat-header-status"
                    style={{ backgroundColor: getStatusColor(getMomById(selectedChat)?.status) }}
                  ></div>
                </div>
                
                <div className="doctor-chat-header-details">
                  <h3>{getMomById(selectedChat)?.name || 'Patient'}</h3>
                  <span className="doctor-chat-availability">
                    {getStatusText(getMomById(selectedChat)?.status)}
                  </span>
                </div>
              </div>
              
              <div className="doctor-chat-header-actions">
                <button 
                  className="doctor-chat-action-btn"
                  onClick={() => setShowVoiceCall(true)}
                  title="Voice Call"
                >
                  <PhoneCall size={18} />
                </button>
                <button 
                  className="doctor-chat-action-btn"
                  onClick={() => setShowVideoCall(true)}
                  title="Video Call"
                >
                  <VideoIcon size={18} />
                </button>
                <button 
                  className="doctor-chat-action-btn"
                  onClick={() => setShowChatInfo(true)}
                  title="Chat Info"
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="doctor-chat-messages-container">
              <div className="doctor-chat-messages">
                {chatMessages.length > 0 ? (
                  chatMessages.map(msg => (
                    <div key={msg.id} className={`doctor-chat-message ${msg.sender}`}>
                      <div className="doctor-chat-message-content">
                        {msg.type === 'text' && (
                          <p>{msg.message}</p>
                        )}
                        {msg.type === 'file' && (
                          <div className="doctor-chat-file-message">
                            <File size={20} />
                            <div className="doctor-chat-file-info">
                              <span className="doctor-chat-file-name">{msg.message}</span>
                              <span className="doctor-chat-file-size">{(msg.file?.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button className="doctor-chat-download-btn">
                              <Download size={16} />
                            </button>
                          </div>
                        )}
                        {msg.type === 'image' && (
                          <div className="doctor-chat-image-message">
                            <img src={URL.createObjectURL(msg.file)} alt="Shared image" />
                          </div>
                        )}
                        
                        <div className="doctor-chat-message-meta">
                          <span className="doctor-chat-message-time">{msg.timestamp}</span>
                          {msg.sender === 'doctor' && (
                            <span className={`doctor-chat-message-status ${msg.status}`}>
                              {msg.status === 'sending' && <Clock size={12} />}
                              {msg.status === 'sent' && <Check size={12} />}
                              {msg.status === 'delivered' && <Check size={12} />}
                              {msg.status === 'read' && <Check size={12} className="double-check" />}
                              {msg.status === 'error' && <AlertCircle size={12} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="doctor-chat-no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                
                {isTyping && (
                  <div className="doctor-chat-message mom">
                    <div className="doctor-chat-message-content">
                      <div className="doctor-chat-typing-bubble">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="doctor-chat-input-container">
              <div className="doctor-chat-input-wrapper">
                <div className="doctor-chat-input-actions">
                  <button 
                    className="doctor-chat-input-btn"
                    title="Emoji"
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    className="doctor-chat-input-btn"
                    onClick={() => imageInputRef.current?.click()}
                    title="Send Image"
                  >
                    <Image size={20} />
                  </button>
                  <button 
                    className="doctor-chat-input-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Send File"
                  >
                    <Paperclip size={20} />
                  </button>
                  <button 
                    className="doctor-chat-input-btn"
                    title="Camera"
                  >
                    <Camera size={20} />
                  </button>
                </div>
                
                <div className="doctor-chat-input-field">
                  <textarea
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (e.target.value.length > 0) {
                        handleTyping(true);
                      } else {
                        handleTyping(false);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    onBlur={() => handleTyping(false)}
                    rows={1}
                    className="doctor-chat-textarea"
                  />
                  <button 
                    className="doctor-chat-send-btn"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected}
                  >
                    <Send size={18} />
                  </button>
                </div>
                
                <button className="doctor-chat-voice-btn" title="Voice Message">
                  <Mic size={20} />
                </button>
              </div>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            <input
              ref={imageInputRef}
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              accept="image/*"
            />
          </>
        ) : (
          /* Welcome Screen */
          <div className="doctor-chat-welcome-screen">
            <div className="doctor-chat-welcome-content">
              <div className="doctor-chat-welcome-icon">
                <MessageCircle size={80} />
              </div>
              <h2>Welcome to Patient Chat</h2>
              <p>Connect with your patients for personalized care and support</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Info Sidebar */}
      {showChatInfo && selectedChat && (
        <div className="doctor-chat-info-sidebar">
          <div className="doctor-chat-info-header">
            <h3>Chat Information</h3>
            <button 
              className="doctor-chat-info-close-btn"
              onClick={() => setShowChatInfo(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="doctor-chat-info-content">
            <div className="doctor-chat-info-patient">
              <img src={getMomById(selectedChat)?.avatar} alt="Patient" />
              <h4>Provider</h4>
              <button className="doctor-chat-refresh-btn">
                <RefreshCw size={16} />
              </button>
              <div className="doctor-chat-rating">
                <Star size={20} />
                <span>Rating</span>
              </div>
            </div>
            
            <div className="doctor-chat-info-details">
              <div className="doctor-chat-info-item">
                <Clock size={16} />
                <span>Experience:</span>
              </div>
              <div className="doctor-chat-info-item">
                <MapPin size={16} />
                <span></span>
              </div>
              <div className="doctor-chat-info-item">
                <Calendar size={16} />
                <span>Next:</span>
              </div>
              <div className="doctor-chat-info-item">
                <Shield size={16} />
                <span>Available for consultation</span>
              </div>
            </div>
            
            <div className="doctor-chat-info-actions">
              <button className="doctor-chat-info-action-btn secondary">
                <FileText size={16} />
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      {showVoiceCall && (
        <div className="doctor-chat-modal-overlay" onClick={() => setShowVoiceCall(false)}>
          <div className="doctor-chat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="doctor-chat-call-modal">
              <div className="doctor-chat-call-avatar">
                <img src={getMomById(selectedChat)?.avatar} alt="Patient" />
                <div className="doctor-chat-call-ringing"></div>
              </div>
              <h3>Calling {getMomById(selectedChat)?.name}</h3>
              <p>Connecting to voice call...</p>
              <div className="doctor-chat-call-actions">
                <button className="doctor-chat-call-btn end-call">
                  <Phone size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && (
        <div className="doctor-chat-modal-overlay" onClick={() => setShowVideoCall(false)}>
          <div className="doctor-chat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="doctor-chat-call-modal">
              <div className="doctor-chat-call-avatar">
                <img src={getMomById(selectedChat)?.avatar} alt="Patient" />
                <div className="doctor-chat-call-ringing"></div>
              </div>
              <h3>Calling {getMomById(selectedChat)?.name}</h3>
              <p>Connecting to video call...</p>
              <div className="doctor-chat-call-actions">
                <button className="doctor-chat-call-btn end-call">
                  <Video size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChat;
