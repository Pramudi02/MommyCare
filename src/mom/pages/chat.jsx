import React, { useState, useEffect, useRef } from 'react';
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
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  HeartPulse, 
  Baby, 
  Stethoscope,
  X,
  Smile,
  Mic,
  Camera,
  Download,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  ArrowLeft,
  Shield,
  Calendar,
  FileText,
  VideoIcon,
  PhoneCall
} from 'lucide-react';
import './chat.css';

const ChatBox = ({ isOpen, onClose, selectedProvider = null }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Mock data for healthcare providers
  const healthcareProviders = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      type: 'doctor',
      specialty: 'Cardiology',
      status: 'online',
      lastMessage: 'How are you feeling today? Any chest discomfort?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      rating: 4.9,
      experience: '15+ years',
      location: 'Downtown Medical Center',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      isTyping: false,
      availability: 'Available now',
      nextAppointment: 'Tomorrow, 2:30 PM'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      type: 'doctor',
      specialty: 'Pediatrics',
      status: 'online',
      lastMessage: 'The vaccination schedule looks perfect for your baby',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      rating: 4.8,
      experience: '12+ years',
      location: 'Children\'s Hospital',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      isTyping: true,
      availability: 'Available now',
      nextAppointment: 'Friday, 11:00 AM'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      type: 'midwife',
      specialty: 'Prenatal Care',
      status: 'online',
      lastMessage: 'Your next appointment is scheduled for next week',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      rating: 4.9,
      experience: '8+ years',
      location: 'Women\'s Health Clinic',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
      isTyping: false,
      availability: 'Available now',
      nextAppointment: 'Next Tuesday, 3:00 PM'
    },
    {
      id: 4,
      name: 'Dr. David Kim',
      type: 'doctor',
      specialty: 'Obstetrics',
      status: 'away',
      lastMessage: 'The ultrasound results are completely normal',
      lastMessageTime: '1 day ago',
      unreadCount: 0,
      rating: 4.7,
      experience: '20+ years',
      location: 'Maternity Care Center',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isTyping: false,
      availability: 'Back in 30 min',
      nextAppointment: 'Next Monday, 10:00 AM'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      type: 'midwife',
      specialty: 'Postpartum Care',
      status: 'offline',
      lastMessage: 'Remember to take your vitamins daily',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      rating: 4.8,
      experience: '10+ years',
      location: 'Family Care Center',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      isTyping: false,
      availability: 'Offline until tomorrow',
      nextAppointment: 'Wednesday, 2:00 PM'
    },
    {
      id: 6,
      name: 'Dr. Jennifer Lee',
      type: 'doctor',
      specialty: 'Gynecology',
      status: 'online',
      lastMessage: 'Your annual checkup is due next month',
      lastMessageTime: '3 days ago',
      unreadCount: 0,
      rating: 4.9,
      experience: '14+ years',
      location: 'Women\'s Wellness Center',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      isTyping: false,
      availability: 'Available now',
      nextAppointment: 'Next month, TBD'
    }
  ];

  // Mock messages for selected chat
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'user',
      message: 'Hello Dr. Sarah, I have some questions about my heart health',
      timestamp: '10:30 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      sender: 'provider',
      message: 'Hello! I\'m here to help. What specific concerns do you have?',
      timestamp: '10:32 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 3,
      sender: 'user',
      message: 'I\'ve been experiencing some chest discomfort lately',
      timestamp: '10:33 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 4,
      sender: 'provider',
      message: 'I understand your concern. Can you describe the type of discomfort? Is it sharp, dull, or pressure-like?',
      timestamp: '10:35 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 5,
      sender: 'user',
      message: 'It feels like pressure, especially when I\'m stressed',
      timestamp: '10:36 AM',
      type: 'text',
      status: 'delivered'
    }
  ]);

  // Filter providers based on search and type
  const filteredProviders = healthcareProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || provider.type === filterType;
    return matchesSearch && matchesType;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Set selected chat when provider is passed from Communication page
  useEffect(() => {
    if (selectedProvider) {
      setSelectedChat(selectedProvider.id);
    }
  }, [selectedProvider]);

  // Handle sending message
  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sending'
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate provider typing and response
      setTimeout(() => {
        setIsTyping(true);
      }, 1000);
      
      setTimeout(() => {
        setIsTyping(false);
        const providerResponse = {
          id: Date.now() + 1,
          sender: 'provider',
          message: 'Thank you for sharing that. Based on your description, it sounds like stress-related chest tightness, which is common. However, I\'d recommend scheduling an appointment for a thorough evaluation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'read'
        };
        setChatMessages(prev => [...prev, providerResponse]);
      }, 3000);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedChat) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file',
        file: file,
        status: 'sending'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setShowFileUpload(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedChat) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: 'Image',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image',
        file: file,
        status: 'sending'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setShowFileUpload(false);
    }
  };

  // Handle key press for sending message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get provider by ID
  const getProviderById = (id) => {
    return healthcareProviders.find(provider => provider.id === id);
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

  // Get provider icon
  const getProviderIcon = (type) => {
    return type === 'doctor' ? <Stethoscope size={16} /> : <Baby size={16} />;
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

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-container" onClick={(e) => e.stopPropagation()}>
        {/* Chat Sidebar */}
        <div className="chat-sidebar">
          {/* Header */}
          <div className="chat-sidebar-header">
            <div className="chat-header-title">
              <MessageCircle size={24} />
              <h2>Healthcare Chat</h2>
            </div>
            
          </div>



          {/* Search and Filter */}
          <div className="chat-search-section">
            <div className="chat-search-container">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search healthcare providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="chat-search-input"
              />
            </div>
            
            <div className="chat-filter-tabs">
              <button
                className={`chat-filter-tab ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                className={`chat-filter-tab ${filterType === 'doctor' ? 'active' : ''}`}
                onClick={() => setFilterType('doctor')}
              >
                <Stethoscope size={14} />
                Doctors
              </button>
              <button
                className={`chat-filter-tab ${filterType === 'midwife' ? 'active' : ''}`}
                onClick={() => setFilterType('midwife')}
              >
                <Baby size={14} />
                Midwives
              </button>
            </div>
          </div>

          {/* Provider List */}
          <div className="chat-provider-list">
            {filteredProviders.map(provider => (
              <div
                key={provider.id}
                className={`chat-provider-item ${selectedChat === provider.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(provider.id)}
              >
                <div className="chat-provider-avatar">
                  <img src={provider.avatar} alt={provider.name} />
                  <div 
                    className="chat-status-indicator"
                    style={{ backgroundColor: getStatusColor(provider.status) }}
                  ></div>
                </div>
                
                <div className="chat-provider-info">
                  <div className="chat-provider-header">
                    <h3>{provider.name}</h3>
                    <div className="chat-provider-type">
                      {getProviderIcon(provider.type)}
                      <span>{provider.specialty}</span>
                    </div>
                  </div>
                  
                  <div className="chat-provider-meta">
                    <p className="chat-last-message">{provider.lastMessage}</p>
                    <div className="chat-message-meta">
                      <span className="chat-time">{provider.lastMessageTime}</span>
                      {provider.unreadCount > 0 && (
                        <span className="chat-unread-badge">{provider.unreadCount}</span>
                      )}
                    </div>
                  </div>
                  
                  {provider.isTyping && (
                    <div className="chat-typing-indicator">
                      <span>typing...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-main-header">
                <div className="chat-header-info">
                  <div className="chat-header-avatar">
                    <img src={getProviderById(selectedChat)?.avatar} alt="Provider" />
                    <div 
                      className="chat-header-status"
                      style={{ backgroundColor: getStatusColor(getProviderById(selectedChat)?.status) }}
                    ></div>
                  </div>
                  
                  <div className="chat-header-details">
                    <h3>{getProviderById(selectedChat)?.name}</h3>
                    <div className="chat-header-meta">
                      <span className="chat-specialty">
                        {getProviderIcon(getProviderById(selectedChat)?.type)}
                        {getProviderById(selectedChat)?.specialty}
                      </span>
                      <span className="chat-rating">
                        <Star size={14} fill="#fbbf24" />
                        {getProviderById(selectedChat)?.rating}
                      </span>
                      <span className="chat-experience">
                        <Clock size={14} />
                        {getProviderById(selectedChat)?.experience}
                      </span>
                    </div>
                    <span className="chat-availability">
                      {getStatusText(getProviderById(selectedChat)?.status)}
                    </span>
                  </div>
                </div>
                
                <div className="chat-header-actions">
                  <button 
                    className="chat-action-btn"
                    onClick={() => setShowVoiceCall(true)}
                    title="Voice Call"
                  >
                    <PhoneCall size={18} />
                  </button>
                  <button 
                    className="chat-action-btn"
                    onClick={() => setShowVideoCall(true)}
                    title="Video Call"
                  >
                    <VideoIcon size={18} />
                  </button>
                  <button 
                    className="chat-action-btn"
                    onClick={() => setShowChatInfo(true)}
                    title="Chat Info"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages-container">
                <div className="chat-messages">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                      <div className="chat-message-content">
                        {msg.type === 'text' && (
                          <p>{msg.message}</p>
                        )}
                        {msg.type === 'file' && (
                          <div className="chat-file-message">
                            <File size={20} />
                            <div className="chat-file-info">
                              <span className="chat-file-name">{msg.message}</span>
                              <span className="chat-file-size">{(msg.file?.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button className="chat-download-btn">
                              <Download size={16} />
                            </button>
                          </div>
                        )}
                        {msg.type === 'image' && (
                          <div className="chat-image-message">
                            <img src={URL.createObjectURL(msg.file)} alt="Shared image" />
                          </div>
                        )}
                        
                        <div className="chat-message-meta">
                          <span className="chat-message-time">{msg.timestamp}</span>
                          {msg.sender === 'user' && (
                            <span className={`chat-message-status ${msg.status}`}>
                              {msg.status === 'sending' && <Clock size={12} />}
                              {msg.status === 'delivered' && <Check size={12} />}
                              {msg.status === 'read' && <Check size={12} className="double-check" />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="chat-message provider">
                      <div className="chat-message-content">
                        <div className="chat-typing-bubble">
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
              <div className="chat-input-container">
                <div className="chat-input-wrapper">
                  <div className="chat-input-actions">
                    <button 
                      className="chat-input-btn"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      title="Emoji"
                    >
                      <Smile size={20} />
                    </button>
                    <button 
                      className="chat-input-btn"
                      onClick={() => imageInputRef.current?.click()}
                      title="Send Image"
                    >
                      <Image size={20} />
                    </button>
                    <button 
                      className="chat-input-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Send File"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      className="chat-input-btn"
                      title="Camera"
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                  
                  <div className="chat-input-field">
                    <textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={1}
                      className="chat-textarea"
                    />
                    <button 
                      className="chat-send-btn"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  <button className="chat-voice-btn" title="Voice Message">
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
            <div className="chat-welcome-screen">
              <div className="chat-welcome-content">
                <div className="chat-welcome-icon">
                  <MessageCircle size={80} />
                </div>
                <h2>Welcome to Healthcare Chat</h2>
                <p>Connect with trusted doctors and midwives for personalized care and support</p>
                <div className="chat-welcome-features">
                  <div className="chat-feature">
                    <Stethoscope size={24} />
                    <span>Expert Medical Advice</span>
                  </div>
                  <div className="chat-feature">
                    <Baby size={24} />
                    <span>Prenatal & Postpartum Care</span>
                  </div>
                  <div className="chat-feature">
                    <Clock size={24} />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Info Sidebar */}
        {showChatInfo && selectedChat && (
          <div className="chat-info-sidebar">
            <div className="chat-info-header">
              <h3>Chat Information</h3>
              <button 
                className="chat-info-close-btn"
                onClick={() => setShowChatInfo(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="chat-info-content">
              <div className="chat-info-provider">
                <img src={getProviderById(selectedChat)?.avatar} alt="Provider" />
                <h4>{getProviderById(selectedChat)?.name}</h4>
                <p className="chat-info-specialty">
                  {getProviderIcon(getProviderById(selectedChat)?.type)}
                  {getProviderById(selectedChat)?.specialty}
                </p>
                <div className="chat-info-rating">
                  <Star size={16} fill="#fbbf24" />
                  <span>{getProviderById(selectedChat)?.rating} Rating</span>
                </div>
              </div>
              
              <div className="chat-info-details">
                <div className="chat-info-item">
                  <Clock size={16} />
                  <span>Experience: {getProviderById(selectedChat)?.experience}</span>
                </div>
                <div className="chat-info-item">
                  <MapPin size={16} />
                  <span>{getProviderById(selectedChat)?.location}</span>
                </div>
                <div className="chat-info-item">
                  <Calendar size={16} />
                  <span>Next: {getProviderById(selectedChat)?.nextAppointment}</span>
                </div>
                <div className="chat-info-item">
                  <Shield size={16} />
                  <span>Available for consultation</span>
                </div>
              </div>
              
              <div className="chat-info-actions">
                <button className="chat-info-action-btn primary">
                  <Phone size={16} />
                  Schedule Call
                </button>
                <button className="chat-info-action-btn secondary">
                  <FileText size={16} />
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voice Call Modal */}
        {showVoiceCall && (
          <div className="chat-modal-overlay" onClick={() => setShowVoiceCall(false)}>
            <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="chat-call-modal">
                <div className="chat-call-avatar">
                  <img src={getProviderById(selectedChat)?.avatar} alt="Provider" />
                  <div className="chat-call-ringing"></div>
                </div>
                <h3>Calling {getProviderById(selectedChat)?.name}</h3>
                <p>Connecting to voice call...</p>
                <div className="chat-call-actions">
                  <button className="chat-call-btn end-call">
                    <Phone size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Call Modal */}
        {showVideoCall && (
          <div className="chat-modal-overlay" onClick={() => setShowVideoCall(false)}>
            <div className="chat-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="chat-call-modal">
                <div className="chat-call-avatar">
                  <img src={getProviderById(selectedChat)?.avatar} alt="Provider" />
                  <div className="chat-call-ringing"></div>
                </div>
                <h3>Calling {getProviderById(selectedChat)?.name}</h3>
                <p>Connecting to video call...</p>
                <div className="chat-call-actions">
                  <button className="chat-call-btn end-call">
                    <Video size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button className="chat-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;