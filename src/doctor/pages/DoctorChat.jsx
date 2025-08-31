import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Image, 
  File, 
  MoreVertical, 
  Search, 
  X,
  Camera,
  Download,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Shield,
  Calendar,
  FileText,
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
  
  // State for users and messages
  const [users, setUsers] = useState([]);
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
  const cameraInputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('✅ Doctor connected to chat server');
        console.log('🔗 Socket ID:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Doctor disconnected from chat server');
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
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
    socket.off('conversation_joined');

    socket.on('new_message', (data) => {
      const msg = data.message || {};
      const conversationId = data.conversationId;
      
      console.log('🔔 Doctor received new message:', {
        messageId: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        conversationId: conversationId,
        activeConversationId: activeConversationId,
        currentUserId: currentUser?._id
      });
      
      // Only append messages for the currently active conversation
      if (activeConversationId && conversationId === activeConversationId) {
        const inferredType = msg.messageType || msg.type;
        const inferredUrl = msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl || null;
        const inferredName = msg.fileName || msg.filename || msg.name || msg.content || (inferredType === 'image' ? 'Image' : 'File');
        const newMessage = {
          id: msg.id,
          // Determine sender based on current user vs message sender
          sender: msg.senderId === currentUser?._id ? 'doctor' : 'user',
          message: inferredType === 'text' ? (msg.content || '') : inferredName,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
          type: inferredType,
          status: msg.status || 'delivered',
          fileUrl: inferredUrl || undefined
        };
        
        console.log('Adding message to active conversation:', newMessage);
        
        // Add new message and sort by timestamp to maintain correct order
        setChatMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => {
            const timeA = a.originalTimestamp || new Date(a.timestamp);
            const timeB = b.originalTimestamp || new Date(b.timestamp);
            return timeA - timeB; // Oldest first
          });
        });
      } else if (!selectedChat && conversationId) {
        // Auto-select the user who sent the message and load conversation messages
        const userId = msg.senderId === currentUser?._id ? msg.recipientId : msg.senderId;
        const userExists = users.some(u => u.id === userId);
        if (userExists) {
          console.log('Auto-selecting user:', userId);
          setSelectedChat(userId);
          setActiveConversationId(conversationId);
          fetchMessages(conversationId);
          const inferredType = msg.messageType || msg.type;
          const inferredUrl = msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl || null;
          const inferredName = msg.fileName || msg.filename || msg.name || msg.content || (inferredType === 'image' ? 'Image' : 'File');
                  const newMessage = {
          id: msg.id,
          sender: 'user',
          message: inferredType === 'text' ? (msg.content || '') : inferredName,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
          type: inferredType,
          status: msg.status || 'delivered',
          fileUrl: inferredUrl || undefined
        };
          setChatMessages(prev => {
            const updatedMessages = [...prev, newMessage];
            return updatedMessages.sort((a, b) => {
              const timeA = a.originalTimestamp || new Date(a.timestamp);
              const timeB = b.originalTimestamp || new Date(b.timestamp);
              return timeA - timeB; // Oldest first
            });
          });
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

    socket.on('conversation_joined', (data) => {
      console.log('✅ Doctor joined conversation:', data.conversationId);
    });

    return () => {
      socket.off('new_message');
      socket.off('typing_indicator');
      socket.off('message_status_update');
      socket.off('conversation_joined');
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

  // Fetch users based on filter type
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      let endpoint = 'http://localhost:5000/api/chat/search?query=.';
      if (filterType === 'moms') {
        endpoint += '&role=mom';
      } else if (filterType === 'midwives') {
        endpoint += '&role=midwife';
      } else {
        // For 'all', fetch both moms and midwives
        endpoint += '&role=mom,midwife';
      }
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Raw API response:', data);
        
        const usersList = data.data.map(user => ({
          id: user.id,
          name: user.name,
          type: user.role,
          specialty: user.role === 'mom' ? 'Pregnancy Care' : 'Midwifery Care',
          role: user.role,
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
          rating: 4.8,
          experience: user.role === 'mom' ? 'First-time mom' : 'Experienced midwife',
          location: 'Local Area',
          avatar: `https://ui-avatars.com/api/?name=${user.name}&background=${
            user.role === 'mom' ? 'ff6b6b' : '10b981'
          }&color=fff`,
          isTyping: false,
          availability: 'Available now',
          nextAppointment: 'TBD'
        }));
        
        console.log('Processed users list:', usersList);
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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
        console.log('Fetched conversations:', data.data);
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
      
      console.log('Fetching messages for conversation:', conversationId);
      
      const response = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched messages data:', data);
        
        const messages = data.data.map(msg => ({
          id: msg.id,
          sender: msg.sender === 'user' ? 'doctor' : 'user',
          message: (msg.messageType === 'text') ? msg.content : (msg.fileName || msg.filename || msg.name || msg.content || (msg.messageType === 'image' ? 'Image' : 'File')),
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
          type: msg.messageType,
          status: msg.read ? 'read' : 'delivered',
          fileUrl: msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl
        }))
        .sort((a, b) => a.originalTimestamp - b.originalTimestamp); // Sort by timestamp (oldest first)
        
        console.log('Processed messages:', messages);
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, [filterType]);

  // Filter users based on search and filter type
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply filter type
    if (filterType === 'moms') {
      return matchesSearch && user.role === 'mom';
    } else if (filterType === 'midwives') {
      return matchesSearch && user.role === 'midwife';
    } else {
      // 'all' - show both moms and midwives
      return matchesSearch && (user.role === 'mom' || user.role === 'midwife');
    }
  });

  console.log('Filter type:', filterType);
  console.log('All users:', users);
  console.log('Filtered users:', filteredUsers);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (message.trim() && selectedChat && currentUser) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const user = users.find(u => u.id === selectedChat);
        if (!user) {
          console.error('User not found for selectedChat:', selectedChat);
          return;
        }

        console.log('Sending message to user:', user);

        const newMessage = {
          id: Date.now(),
          sender: 'doctor',
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(), // Keep original timestamp for sorting
          type: 'text',
          status: 'sending'
        };
        
        // Add message to frontend immediately and sort by timestamp
        setChatMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => {
            const timeA = a.originalTimestamp || new Date(a.timestamp);
            const timeB = b.originalTimestamp || new Date(b.timestamp);
            return timeA - timeB; // Oldest first
          });
        });
        setMessage('');

        console.log('Sending message to backend:', {
          recipientId: selectedChat,
          content: message.trim(),
          messageType: 'text'
        });

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
          console.log('Message sent successfully:', data);
          
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
              console.log('Refreshed conversations:', convData.data);
              setConversations(convData.data);
              const conversation = convData.data.find(c => c.participants.some(p => p.id === selectedChat));
              if (conversation) {
                console.log('Found conversation:', conversation);
                setActiveConversationId(conversation.id);
                if (socket) socket.emit('join_conversation', conversation.id);
              } else {
                console.log('No conversation found for selectedChat:', selectedChat);
              }
            }
          } catch (e) {
            console.error('Error refreshing conversations:', e);
          }
        } else {
          const errorData = await response.text();
          console.error('Failed to send message:', response.status, errorData);
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
          originalTimestamp: new Date(), // Keep original timestamp for sorting
          type: 'file',
          file: file,
          status: 'sending'
        };
        
        // Add message to frontend immediately and sort by timestamp
        setChatMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => {
            const timeA = a.originalTimestamp || new Date(a.timestamp);
            const timeB = b.originalTimestamp || new Date(b.timestamp);
            return timeA - timeB; // Oldest first
          });
        });

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
          originalTimestamp: new Date(), // Keep original timestamp for sorting
          type: 'image',
          file: file,
          status: 'sending'
        };
        
        // Add message to frontend immediately and sort by timestamp
        setChatMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => {
            const timeA = a.originalTimestamp || new Date(a.timestamp);
            const timeB = b.originalTimestamp || new Date(b.timestamp);
            return timeA - timeB; // Oldest first
          });
        });

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

  // Get user by ID
  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  // Get user icon based on role
  const getUserIcon = (role) => {
    return role === 'mom' ? '🤱' : '👩‍⚕️';
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
              placeholder="Search moms and midwives..."
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
            className={`doctor-chat-filter-btn ${filterType === 'moms' ? 'active' : ''}`}
            onClick={() => setFilterType('moms')}
          >
            <MessageCircle size={16} />
            MOMS
          </button>
          <button 
            className={`doctor-chat-filter-btn ${filterType === 'midwives' ? 'active' : ''}`}
            onClick={() => setFilterType('midwives')}
          >
            <MessageCircle size={16} />
            MIDWIVES
          </button>
        </div>

        {/* Users List */}
        <div className="doctor-chat-users-list">
          {loading ? (
            <div className="doctor-chat-loading">
              <p>Loading moms and midwives...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className={`doctor-chat-user-item ${selectedChat === user.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('Selecting user:', user.id);
                  setSelectedChat(user.id);
                  setChatMessages([]); // Clear messages when selecting new chat
                  
                  const conversation = conversations.find(c => 
                    c.participants.some(p => p.id === user.id)
                  );
                  
                  console.log('Found conversation:', conversation);
                  
                  if (conversation) {
                    console.log('✅ Found conversation for user:', conversation.id);
                    setActiveConversationId(conversation.id);
                    if (socket) {
                      console.log('🔌 Joining conversation via socket:', conversation.id);
                      socket.emit('join_conversation', conversation.id);
                    }
                    fetchMessages(conversation.id);
                  } else {
                    console.log('❌ No conversation found for user:', user.id);
                    setActiveConversationId(null);
                  }
                }}
              >
                <div className="doctor-chat-user-avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>
                
                <div className="doctor-chat-user-info">
                  <div className="doctor-chat-user-header">
                    <h3>{user.name}</h3>
                    <div className="doctor-chat-user-type">
                      <span>{getUserIcon(user.role)}</span>
                      <span>{user.specialty}</span>
                    </div>
                  </div>
                  
                  <div className="doctor-chat-user-meta">
                    <p className="doctor-chat-last-message">{user.lastMessage || 'No messages yet'}</p>
                    <div className="doctor-chat-message-meta">
                      <span className="doctor-chat-time">{user.lastMessageTime || 'New'}</span>
                      {user.unreadCount > 0 && (
                        <span className="doctor-chat-unread-badge">{user.unreadCount}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Role indicator */}
                  <div className="doctor-chat-role-indicator">
                    <span className={`doctor-chat-role-badge ${user.role}`}>
                      {user.role === 'mom' ? '🤱 Mom' : '👩‍⚕️ Midwife'}
                    </span>
                  </div>
                  
                  {user.isTyping && (
                    <div className="doctor-chat-typing-indicator">
                      <span>typing...</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="doctor-chat-no-users">
              <p>No moms or midwives found</p>
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
                  <img src={getUserById(selectedChat)?.avatar} alt="Patient" />
                </div>
                
                <div className="doctor-chat-header-details">
                  <h3>{getUserById(selectedChat)?.name || 'Patient'}</h3>
                  <span className="doctor-chat-availability">
                    {getUserById(selectedChat)?.role === 'mom' ? '🤱 Mom' : '👩‍⚕️ Midwife'}
                  </span>
                </div>
              </div>
              
              <div className="doctor-chat-header-actions">
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
                              <span className="doctor-chat-file-size">{(msg.file?.size ? (msg.file.size / 1024 / 1024).toFixed(2) + ' MB' : '')}</span>
                            </div>
                            {msg.fileUrl && (
                              <a className="doctor-chat-download-btn" href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                <Download size={16} />
                              </a>
                            )}
                          </div>
                        )}
                        {msg.type === 'image' && (
                          <div className="doctor-chat-image-message">
                            <img src={msg.fileUrl ? msg.fileUrl : (msg.file ? URL.createObjectURL(msg.file) : '')} alt="Shared image" />
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
                                  <div className="doctor-chat-message user">
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
                    onClick={() => cameraInputRef.current?.click()}
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
            <input
              ref={cameraInputRef}
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              accept="image/*"
              capture="environment"
            />
          </>
        ) : (
          /* Welcome Screen */
          <div className="doctor-chat-welcome-screen">
            <div className="doctor-chat-welcome-content">
              <div className="doctor-chat-welcome-icon">
                <MessageCircle size={80} />
              </div>
              <h2>Welcome to Healthcare Chat</h2>
              <p>Connect with moms and midwives for personalized care and support</p>
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
              <img src={getUserById(selectedChat)?.avatar} alt="Patient" />
              <h4>{getUserById(selectedChat)?.role === 'mom' ? 'Mom' : 'Midwife'}</h4>
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
    </div>
  );
};

export default DoctorChat;
