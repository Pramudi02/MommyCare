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

  // Auto-scroll when messages are loaded
  useEffect(() => {
    if (chatMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages.length]);

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
          console.log('🔍 Current user ID:', currentUser.id);
          console.log('🔍 Message sender ID:', data.senderId);
          console.log('🔍 Active conversation ID:', activeConversationId);
          
          // Only add message if it's for the current conversation
          if (data.senderId !== currentUser.id) {
            const msg = data.message || {};
            const conversationId = data.conversationId;
            
            console.log('🔔 New message received:', {
              conversationId,
              activeConversationId,
              messageContent: msg.content,
              senderId: msg.senderId,
              currentUserId: currentUser?.id
            });
            
            // Only append messages for the currently active conversation
            console.log('🔍 Comparing conversation IDs:', conversationId, '===', activeConversationId);
            if (activeConversationId && conversationId === activeConversationId) {
              console.log('✅ Message belongs to active conversation - adding to chat');
              const inferredType = msg.messageType || msg.type;
              const inferredUrl = msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl || null;
              const inferredName = msg.fileName || msg.filename || msg.name || msg.content || (inferredType === 'image' ? 'Image' : 'File');
              const newMessage = {
                id: msg.id,
                // Determine sender based on current user vs message sender
                sender: msg.senderId === currentUser?.id ? 'midwife' : 'provider',
                message: inferredType === 'text' ? (msg.content || '') : inferredName,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
                type: inferredType || 'text',
                status: msg.status || 'delivered',
                replyTo: msg.replyTo ? {
                  sender: msg.replyTo.sender === 'user' ? 'midwife' : 'provider',
                  message: msg.replyTo.content
                } : null,
                fileUrl: inferredUrl || undefined
              };
              
              // Add new message and sort by timestamp to maintain correct order
              setChatMessages(prev => {
                const updatedMessages = [...prev, newMessage];
                return updatedMessages.sort((a, b) => {
                  const timeA = a.originalTimestamp || new Date(a.timestamp);
                  const timeB = b.originalTimestamp || new Date(b.timestamp);
                  return timeA - timeB; // Oldest first
                });
              });
            } else {
              console.log('❌ Message does not belong to active conversation - ignoring');
            }
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
  }, [currentUser, activeConversationId]);

  // Fetch real data from database
  useEffect(() => {
    if (currentUser) {
      fetchHealthcareProviders();
      fetchConversations();
      
      // If there's a selected chat, load its messages
      if (selectedChat) {
        fetchChatMessages(selectedChat.id);
      }
    }
  }, [currentUser, selectedChat]);

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
        message: messageToSend,
        sender: 'midwife', // This will show as outgoing message
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalTimestamp: new Date(),
        type: 'text',
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
    console.log('🔍 Selecting chat with provider:', provider);
    setSelectedChat(provider);
    setActiveConversationId(provider.id);
    console.log('🔍 Set active conversation ID to:', provider.id);
    
    // Fetch real messages from database
    fetchChatMessages(provider.id);
  };

  const fetchChatMessages = async (recipientId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // First, get the conversation between current user and recipient
      const conversationResponse = await fetch(`http://localhost:5000/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (conversationResponse.ok) {
        const conversationData = await conversationResponse.json();
        console.log('🔍 Looking for conversation with recipient:', recipientId);
        console.log('🔍 Available conversations:', conversationData.data);
        
        const conversation = conversationData.data?.find(conv => {
          const hasRecipient = conv.participants.some(p => p._id.toString() === recipientId.toString());
          console.log('🔍 Checking conversation:', conv._id, 'participants:', conv.participants, 'hasRecipient:', hasRecipient);
          return hasRecipient;
        });
        
        if (conversation) {
          console.log('✅ Found conversation:', conversation._id);
          // Now fetch messages using the conversation ID
          const messagesResponse = await fetch(`http://localhost:5000/api/chat/conversations/${conversation._id}/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            console.log('✅ Fetched messages:', messagesData.data?.length || 0, 'messages');
            console.log('📨 Raw messages data:', messagesData.data);
            
            // Transform API messages to match frontend structure like mom chatbox
            const messages = messagesData.data
              .map(msg => ({
                id: msg.id,
                // Map sender correctly: 'user' means current user (midwife), 'provider' means other person
                sender: msg.sender === 'user' ? 'midwife' : 'provider',
                message: (msg.messageType === 'text') ? msg.content : (msg.fileName || msg.filename || msg.name || msg.content || (msg.messageType === 'image' ? 'Image' : 'File')),
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
                type: msg.messageType,
                status: msg.read ? 'read' : 'delivered',
                replyTo: msg.replyTo ? {
                  sender: msg.replyTo.sender === 'user' ? 'midwife' : 'provider',
                  message: msg.replyTo.content
                } : null,
                fileUrl: msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl
              }))
              .sort((a, b) => a.originalTimestamp - b.originalTimestamp); // Sort by timestamp (oldest first)
            
            console.log('📨 Processed messages:', messages.length, 'messages');
            console.log('📨 Transformed messages:', messages);
            setChatMessages(messages);
          } else {
            console.error('Failed to fetch messages');
            setChatMessages([]);
          }
        } else {
          console.log('No existing conversation found, starting fresh');
          setChatMessages([]);
        }
      } else {
        console.error('Failed to fetch conversations');
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
              <div className="midwife-chat-page-messages">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`midwife-chat-page-message ${
                      msg.sender === 'midwife' ? 'outgoing' : 'incoming'
                    }`}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    <div className="midwife-chat-page-message-content">
                      {msg.replyTo && (
                        <div className="midwife-chat-page-message-reply">
                          <span>Replying to: {msg.replyTo.message}</span>
                        </div>
                      )}
                      <div className="midwife-chat-page-message-text">{msg.message}</div>
                      <div className="midwife-chat-page-message-time">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
