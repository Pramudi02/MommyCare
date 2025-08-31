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
  Camera,
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
  Heart,
  Share
} from 'lucide-react';
import './chat.css';

const ChatBox = ({ isOpen, onClose, selectedProvider = null, isFloating = false }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
  
  // User authentication (you'll need to get this from your auth context)
  const [currentUser, setCurrentUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Get user token from localStorage or auth context
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('✅ Mom connected to chat server');
        console.log('🔗 Socket ID:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
      });

      // listeners will be attached in another effect to avoid stale closures

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  // Re-bind socket listeners whenever selection/current user changes
  useEffect(() => {
    if (!socket) return;

    socket.off('new_message');
    socket.off('typing_indicator');
    socket.off('message_status_update');
    socket.off('conversation_joined');

    socket.on('new_message', (data) => {
      const msg = data.message || {};
      const conversationId = data.conversationId;
      
      console.log('🔔 New message received:', {
        conversationId,
        activeConversationId,
        messageContent: msg.content,
        senderId: msg.senderId,
        currentUserId: currentUser?._id
      });
      
      // Only append messages for the currently active conversation
      if (activeConversationId && conversationId === activeConversationId) {
        console.log('✅ Message belongs to active conversation - adding to chat');
        const inferredType = msg.messageType || msg.type;
        const inferredUrl = msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl || null;
        const inferredName = msg.fileName || msg.filename || msg.name || msg.content || (inferredType === 'image' ? 'Image' : 'File');
        const newMessage = {
          id: msg.id,
          // Determine sender based on current user vs message sender
          sender: msg.senderId === currentUser?._id ? 'user' : 'provider',
          message: inferredType === 'text' ? (msg.content || '') : inferredName,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
          type: inferredType || 'text',
          status: msg.status || 'delivered',
          replyTo: msg.replyTo ? {
            sender: msg.replyTo.sender,
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
      console.log('✅ Mom joined conversation:', data.conversationId);
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
        console.log('🔑 Token found:', !!token);
        console.log('🔑 Token value:', token ? token.substring(0, 20) + '...' : 'None');
        
        if (token) {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('👤 User info response status:', response.status);
          
          if (response.ok) {
            const userData = await response.json();
            console.log('✅ User data received:', userData);
            setCurrentUser(userData.user);
          } else {
            console.error('❌ Failed to get user info:', response.status);
            const errorData = await response.text();
            console.error('❌ Error data:', errorData);
          }
        } else {
          console.error('❌ No token found in localStorage or sessionStorage');
        }
      } catch (error) {
        console.error('❌ Error fetching user info:', error);
      }
    };

    getUserInfo();
  }, []);

  // Fetch healthcare providers (doctors/midwives)
  const fetchHealthcareProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setHealthcareProviders([]);
        return;
      }
      
      console.log('🏥 Fetching healthcare providers...');
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
      
      // Use the new providers endpoint to get all doctors and midwives
      const response = await fetch('http://localhost:5000/api/chat/providers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Healthcare providers data received:', data);
        console.log('📊 Data structure:', {
          success: data.success,
          hasData: !!data.data,
          isArray: Array.isArray(data.data),
          dataLength: data.data?.length || 0
        });
        
        if (data.success && data.data && Array.isArray(data.data)) {
          setHealthcareProviders(data.data);
          console.log('✅ Set healthcare providers:', data.data.length, 'providers');
        } else {
          console.error('❌ Invalid data format:', data);
          setHealthcareProviders([]);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch healthcare providers:', response.status, errorText);
        setHealthcareProviders([]);
      }
    } catch (error) {
      console.error('Error fetching healthcare providers:', error);
      setHealthcareProviders([]);
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
        console.log('📨 Raw messages from API:', data.data);
        
        // Transform API messages to match frontend structure and sort by timestamp
        const messages = data.data
          .map(msg => ({
            id: msg.id,
            sender: msg.sender,
            message: (msg.messageType === 'text') ? msg.content : (msg.fileName || msg.filename || msg.name || msg.content || (msg.messageType === 'image' ? 'Image' : 'File')),
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            originalTimestamp: new Date(msg.timestamp), // Keep original timestamp for sorting
            type: msg.messageType,
            status: msg.read ? 'read' : 'delivered',
            replyTo: msg.replyTo ? {
              sender: msg.replyTo.sender,
              message: msg.replyTo.content
            } : null,
            fileUrl: msg.fileUrl || msg.url || msg.attachmentUrl || msg.mediaUrl
          }))
          .sort((a, b) => a.originalTimestamp - b.originalTimestamp); // Sort by timestamp (oldest first)
        
        console.log('📨 Sorted messages:', messages.length, 'messages');
        setChatMessages(messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      console.log('🚀 Chat opened - fetching initial data...');
      fetchHealthcareProviders();
      fetchConversations();
    }
  }, [isOpen]);

  // Filter providers based on search and type
  const filteredProviders = healthcareProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || provider.role === filterType;
    return matchesSearch && matchesType;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Debug activeConversationId changes
  useEffect(() => {
    console.log('🔄 activeConversationId changed:', activeConversationId);
  }, [activeConversationId]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.isOpen) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.isOpen]);

  // Set selected chat when provider is passed from Communication page
  useEffect(() => {
    if (selectedProvider) {
      setSelectedChat(selectedProvider.id);
    }
  }, [selectedProvider]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (message.trim() && selectedChat) {
      // Check if user is authenticated
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please log in to send messages');
        return;
      }
      
      if (!currentUser) {
        console.error('Current user not loaded');
        alert('Please wait while we load your profile');
        return;
      }
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Find the provider to send message to
        const provider = healthcareProviders.find(p => p.id === selectedChat);
        if (!provider) return;

        // Create message object for frontend
        const newMessage = {
          id: Date.now(),
          sender: 'user',
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          originalTimestamp: new Date(), // Keep original timestamp for sorting
          type: 'text',
          status: 'sending',
          replyTo: replyingTo ? {
            sender: replyingTo.sender,
            message: replyingTo.message
          } : null
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
        const messageToSend = message.trim();
        setMessage('');
      
        console.log('📤 Sending message to:', selectedChat);
        console.log('📤 Message content:', messageToSend);
        console.log('📤 Current user ID:', currentUser?._id);
        
        // Send message to backend
        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientId: selectedChat,
            content: messageToSend,
            messageType: 'text',
            replyTo: replyingTo ? replyingTo.id : null
          })
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('Message sent successfully:', data);
          
          // Update message status to sent
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'sent', id: data.data.id }
              : msg
          ));

          // Clear reply state after sending
          setReplyingTo(null);
          
          // Ensure we know the conversationId by refetching conversations
          try {
            console.log('🔄 Refreshing conversations after sending message...');
            const convRes = await fetch('http://localhost:5000/api/chat/conversations', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (convRes.ok) {
              const convData = await convRes.json();
              setConversations(convData.data);
              const conversation = convData.data.find(c => c.participants.some(p => p.id === selectedChat));
              if (conversation) {
                console.log('✅ Found conversation after sending:', conversation.id);
                setActiveConversationId(conversation.id);
                if (socket) {
                  console.log('🔌 Joining conversation after sending:', conversation.id);
                  socket.emit('join_conversation', conversation.id);
                }
              } else {
                console.log('❌ No conversation found after sending message');
              }
            }
          } catch (e) {
            console.error('Error refreshing conversations:', e);
          }
        } else {
          const errorData = await response.text();
          console.error('Failed to send message:', response.status, errorData);
          
          // Show user-friendly error message
          let errorMessage = 'Failed to send message';
          try {
            const errorJson = JSON.parse(errorData);
            errorMessage = errorJson.message || errorMessage;
          } catch (e) {
            // If not JSON, use the raw error text
            errorMessage = errorData || errorMessage;
          }
          
          alert(`Error: ${errorMessage}`);
          
          // If failed, update status to error
          setChatMessages(prev => prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'error' }
              : msg
          ));
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Update message status to error
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
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipientId', selectedChat);
        formData.append('messageType', 'file');
        formData.append('content', file.name);

        // Add message to frontend immediately
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalTimestamp: new Date(), // Keep original timestamp for sorting
        type: 'file',
        file: file,
        status: 'sending'
      };
        
      setChatMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        return updatedMessages.sort((a, b) => {
          const timeA = a.originalTimestamp || new Date(a.timestamp);
          const timeB = b.originalTimestamp || new Date(b.timestamp);
          return timeA - timeB; // Oldest first
        });
      });

        // Send file message to backend
        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          // Update message status to sent
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
        
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recipientId', selectedChat);
        formData.append('messageType', 'image');
        formData.append('content', 'Image');

        // Add message to frontend immediately
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        message: 'Image',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        originalTimestamp: new Date(), // Keep original timestamp for sorting
        type: 'image',
        file: file,
        status: 'sending'
      };
        
      setChatMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        return updatedMessages.sort((a, b) => {
          const timeA = a.originalTimestamp || new Date(a.timestamp);
          const timeB = b.originalTimestamp || new Date(b.timestamp);
          return timeA - timeB; // Oldest first
        });
      });

        // Send image message to backend
        const response = await fetch('http://localhost:5000/api/chat/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          // Update message status to sent
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

  // Handle message hover for context menu
  const handleMessageHover = (messageId) => {
    setHoveredMessage(messageId);
  };

  const handleMessageLeave = () => {
    setHoveredMessage(null);
  };

  // Handle context menu open
  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    
    // Get message element position
    const messageElement = e.currentTarget;
    const rect = messageElement.getBoundingClientRect();
    
    // Position context menu to the left of the message
    let menuX = rect.left - 300; // 300px to the left of message
    let menuY = rect.top;
    
    // Ensure menu doesn't go off-screen
    if (menuX < 10) {
      menuX = 10; // Keep at least 10px from left edge
    }
    
    if (menuY < 10) {
      menuY = 10; // Keep at least 10px from top edge
    }
    
    setContextMenu({
      isOpen: true,
      messageId,
      x: menuX,
      y: menuY
    });
  };

  // Handle context menu close
  const closeContextMenu = () => {
    setContextMenu({
      isOpen: false,
      messageId: null,
      x: 0,
      y: 0
    });
  };

  // Handle context menu actions
  const handleContextMenuAction = (action, messageId) => {
    const message = chatMessages.find(msg => msg.id === messageId);
    
    switch (action) {
      case 'like':
        // Toggle like status
        setChatMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isLiked: !msg.isLiked }
            : msg
        ));
        break;
      case 'reply':
        // Set message to reply to
        setReplyingTo(message);
        closeContextMenu();
        break;
      case 'copy':
        // Copy message to clipboard
        navigator.clipboard.writeText(message.message);
        break;
      case 'forward':
        // Forward message (you can implement this later)
        console.log('Forward message:', message.message);
        break;
      case 'delete':
          // Delete message permanently from database and frontend
          const deleteMessage = async () => {
            try {
              const token = localStorage.getItem('token') || sessionStorage.getItem('token');
              
              // Only allow deleting own messages
              if (message.sender !== 'user') {
                alert('You can only delete your own messages.');
                return;
              }
              
              const response = await fetch(`http://localhost:5000/api/chat/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                // Remove from frontend after successful database deletion
                setChatMessages(prev => prev.filter(msg => msg.id !== messageId));
                console.log('Message deleted permanently from database:', message.message);
              } else if (response.status === 403) {
                // Forbidden: not allowed to delete
                let serverMessage = 'You are not allowed to delete this message.';
                try {
                  const contentType = response.headers.get('content-type') || '';
                  if (contentType.includes('application/json')) {
                    const data = await response.json();
                    serverMessage = data.message || serverMessage;
                  } else {
                    const text = await response.text();
                    if (text) serverMessage = text;
                  }
                } catch {}
                alert(serverMessage);
              } else {
                let errorText = 'Failed to delete message. Please try again.';
                try {
                  const ct = response.headers.get('content-type') || '';
                  if (ct.includes('application/json')) {
                    const data = await response.json();
                    errorText = data.message || errorText;
                  } else {
                    const text = await response.text();
                    if (text) errorText = text;
                  }
                } catch {}
                console.error('Failed to delete message from database');
                alert(errorText);
              }
            } catch (error) {
              console.error('Error deleting message:', error);
              alert('Error deleting message. Please try again.');
            }
          };
          
          deleteMessage();
          break;
      case 'share':
        // Share message (you can implement this later)
        console.log('Share message:', message.message);
        break;
      default:
        break;
    }
    
    closeContextMenu();
  };

  // Handle cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-overlay ${isFloating ? 'chat-overlay-floating' : ''}`} onClick={onClose}>
      <div className={`chat-container ${isFloating ? 'chat-container-floating' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Chat Sidebar */}
        <div className="chat-sidebar">
          {/* Header */}
          <div className="chat-sidebar-header">
            <div className="chat-header-title">
              <MessageCircle size={24} />
              <h2>Healthcare Chat</h2>
            </div>
            {!isFloating && (
              <button className="chat-header-menu-btn" onClick={onClose}>
                <X size={20} />
              </button>
            )}
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
            {loading ? (
              <div className="chat-loading">
                <p>Loading healthcare providers...</p>
              </div>
            ) : filteredProviders.length > 0 ? (
              filteredProviders.map(provider => (
              <div
                key={provider.id}
                className={`chat-provider-item ${selectedChat === provider.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('👆 Provider selected:', provider.name, provider.id);
                  setSelectedChat(provider.id);
                  
                  // Clear current messages when switching providers
                  setChatMessages([]);
                  
                  // Fetch messages for this conversation
                  const conversation = conversations.find(c => 
                    c.participants.some(p => p.id === provider.id)
                  );
                  
                  if (conversation) {
                    console.log('✅ Found existing conversation:', conversation.id);
                    setActiveConversationId(conversation.id);
                    if (socket) {
                      console.log('🔌 Joining conversation via socket:', conversation.id);
                      socket.emit('join_conversation', conversation.id);
                    }
                    fetchMessages(conversation.id);
                  } else {
                    console.log('❌ No existing conversation found - setting activeConversationId to null');
                    setActiveConversationId(null);
                  }
                }}
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
                      {getProviderIcon(provider.role)}
                      <span>{provider.specialty}</span>
                    </div>
                  </div>
                  
                  <div className="chat-provider-meta">
                    <p className="chat-last-message">{provider.lastMessage || 'No messages yet'}</p>
                    <div className="chat-message-meta">
                      <span className="chat-time">{provider.lastMessageTime || 'New'}</span>
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
              ))
            ) : (
              <div className="chat-no-providers">
                <p>No healthcare providers found</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  {healthcareProviders.length === 0 ? 'No providers loaded from database' : 'No providers match your search'}
                </p>
              </div>
            )}
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
                    <span className="chat-availability">
                      {getStatusText(getProviderById(selectedChat)?.status)}
                    </span>
                  </div>
                </div>
                
                <div className="chat-header-actions">
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
                  {chatMessages.length > 0 ? (
                    chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`chat-message ${msg.sender}`}
                      onMouseEnter={() => handleMessageHover(msg.id)}
                      onMouseLeave={handleMessageLeave}
                      onContextMenu={(e) => handleContextMenu(e, msg.id)}
                    >
                      <div className="chat-message-content">
                        {msg.type === 'text' && (
                          <>
                            {msg.replyTo && (
                              <div className="chat-reply-context">
                                <div className="chat-reply-indicator">
                                  <span className="chat-reply-sender-name">
                                    {msg.replyTo.sender === 'user' ? 'You' : getProviderById(selectedChat)?.name}
                                  </span>
                                  <span className="chat-reply-message-text">{msg.replyTo.message}</span>
                                </div>
                              </div>
                            )}
                            <p>{msg.message}</p>
                          </>
                        )}
                        {msg.type === 'file' && (
                          <>
                            {msg.replyTo && (
                              <div className="chat-reply-context">
                                <div className="chat-reply-indicator">
                                  <span className="chat-reply-sender-name">
                                    {msg.replyTo.sender === 'user' ? 'You' : getProviderById(selectedChat)?.name}
                                  </span>
                                  <span className="chat-reply-message-text">{msg.replyTo.message}</span>
                                </div>
                              </div>
                            )}
                            <div className="chat-file-message">
                              <File size={20} />
                              <div className="chat-file-info">
                                <span className="chat-file-name">{msg.message}</span>
                                <span className="chat-file-size">{(msg.file?.size ? (msg.file.size / 1024 / 1024).toFixed(2) + ' MB' : '')}</span>
                              </div>
                              {msg.fileUrl && (
                                <a className="chat-download-btn" href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                  <Download size={16} />
                                </a>
                              )}
                            </div>
                          </>
                        )}
                        {msg.type === 'image' && (
                          <>
                            {msg.replyTo && (
                              <div className="chat-reply-context">
                                <div className="chat-reply-indicator">
                                  <span className="chat-reply-sender-name">
                                    {msg.replyTo.sender === 'user' ? 'You' : getProviderById(selectedChat)?.name}
                                  </span>
                                  <span className="chat-reply-message-text">{msg.replyTo.message}</span>
                                </div>
                              </div>
                            )}
                            <div className="chat-image-message">
                              <img src={msg.fileUrl ? msg.fileUrl : (msg.file ? URL.createObjectURL(msg.file) : '')} alt="Shared image" />
                            </div>
                          </>
                        )}
                        
                        <div className="chat-message-meta">
                          <span className="chat-message-time">{msg.timestamp}</span>
                          {msg.sender === 'user' && (
                            <span className={`chat-message-status ${msg.status}`}>
                              {msg.status === 'sending' && <Clock size={12} />}
                                {msg.status === 'sent' && <Check size={12} />}
                              {msg.status === 'delivered' && <Check size={12} />}
                              {msg.status === 'read' && <Check size={12} className="double-check" />}
                                {msg.status === 'error' && <AlertCircle size={12} />}
                            </span>
                          )}
                        </div>
                        
                        {/* Like icon that appears on hover */}
                        {hoveredMessage === msg.id && (
                          <div className="chat-message-actions">
                            <button 
                              className={`chat-like-btn ${msg.isLiked ? 'liked' : ''}`}
                              onClick={() => handleContextMenuAction('like', msg.id)}
                              title="Message options"
                            >
                              ⋮
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="chat-no-messages">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  
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
                {/* Reply Preview */}
                {replyingTo && (
                  <div className="chat-reply-preview">
                    <div className="chat-reply-content">
                      <div className="chat-reply-sender">
                        <span className="chat-reply-label">Replying to:</span>
                        <span className="chat-reply-name">{replyingTo.sender === 'user' ? 'You' : getProviderById(selectedChat)?.name}</span>
                      </div>
                      <div className="chat-reply-message">
                        {replyingTo.message}
                      </div>
                    </div>
                    <button 
                      className="chat-reply-cancel"
                      onClick={handleCancelReply}
                      title="Cancel reply"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                <div className="chat-input-wrapper">
                  <div className="chat-input-actions">
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
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera size={20} />
                    </button>
                  </div>
                  
                  <div className="chat-input-field">
                    <textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        // Handle typing indicator
                        if (e.target.value.length > 0) {
                          handleTyping(true);
                        } else {
                          handleTyping(false);
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      onBlur={() => handleTyping(false)}
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
                  {getProviderIcon(getProviderById(selectedChat)?.role)}
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
                <button className="chat-info-action-btn secondary">
                  <FileText size={16} />
                  View Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Context Menu */}
        {contextMenu.isOpen && (
          <div 
            className="chat-context-menu"
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 10001
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="context-menu-actions">
              <button 
                className="context-action-btn"
                onClick={() => handleContextMenuAction('reply', contextMenu.messageId)}
              >
                <ArrowLeft size={16} />
                Reply
              </button>
              <button 
                className="context-action-btn"
                onClick={() => handleContextMenuAction('copy', contextMenu.messageId)}
              >
                <FileText size={16} />
                Copy
              </button>
              <button 
                className="context-action-btn"
                onClick={() => handleContextMenuAction('forward', contextMenu.messageId)}
              >
                <ArrowRight size={16} />
                Forward
              </button>
              <button 
                className="context-action-btn"
                onClick={() => handleContextMenuAction('delete', contextMenu.messageId)}
              >
                <Trash2 size={16} />
                Delete for me
              </button>
              <button 
                className="context-action-btn"
                onClick={() => handleContextMenuAction('share', contextMenu.messageId)}
              >
                <Share size={16} />
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;