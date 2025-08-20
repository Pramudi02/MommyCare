const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

class ChatService {
  // Create a new conversation between two users
  static async createConversation(userId1, userId2, chatType = 'direct') {
    try {
      // Check if conversation already exists
      const existingChat = await Chat.findOne({
        participants: { $all: [userId1, userId2] },
        chatType: 'direct'
      });

      if (existingChat) {
        return existingChat;
      }

      // Create new chat
      const chat = new Chat({
        participants: [userId1, userId2],
        chatType,
        startedAt: new Date(),
        lastActivity: new Date()
      });

      await chat.save();
      return chat;
    } catch (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }
  }

  // Get all conversations for a user
  static async getUserConversations(userId) {
    try {
      const conversations = await Chat.find({
        participants: userId,
        isActive: true
      })
      .populate('participants', 'firstName lastName role')
      .populate('lastMessage.senderId', 'firstName lastName role')
      .sort({ lastActivity: -1 });

      return conversations;
    } catch (error) {
      throw new Error(`Failed to get user conversations: ${error.message}`);
    }
  }

  // Get messages for a specific conversation
  static async getConversationMessages(conversationId, limit = 50, skip = 0) {
    try {
      const messages = await Message.find({ conversationId })
        .populate('senderId', 'firstName lastName role')
        .populate('recipientId', 'firstName lastName role')
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      throw new Error(`Failed to get conversation messages: ${error.message}`);
    }
  }

  // Send a message
  static async sendMessage(senderId, recipientId, content, messageType = 'text', file = null, replyTo = null) {
    try {
      // Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [senderId, recipientId] },
        chatType: 'direct'
      });

      if (!chat) {
        chat = await this.createConversation(senderId, recipientId);
      }

      // Create message
      const message = new Message({
        senderId,
        recipientId,
        content,
        messageType,
        conversationId: chat._id,
        file,
        replyTo,
        timestamp: new Date()
      });

      await message.save();

      // Update chat's last message
      await chat.updateLastMessage(message);

      // Populate message with user details
      await message.populate([
        { path: 'senderId', select: 'firstName lastName role' },
        { path: 'recipientId', select: 'firstName lastName role' }
      ]);

      return { message, chat };
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  // Search users for starting new conversations
  static async searchUsers(query, currentUserId, role = null) {
    try {
      let searchCriteria = {
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } }
        ],
        _id: { $ne: currentUserId }
      };

      if (role) {
        searchCriteria.role = role;
      }

      const users = await User().find(searchCriteria)
        .select('firstName lastName role')
        .limit(20);

      return users;
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  // Get unread message count for a user
  static async getUnreadCount(userId) {
    try {
      const count = await Message.countDocuments({
        recipientId: userId,
        read: false
      });

      return count;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  // Mark all messages in a conversation as read for a user
  static async markConversationAsRead(conversationId, userId) {
    try {
      await Message.updateMany(
        {
          conversationId,
          recipientId: userId,
          read: false
        },
        {
          $set: {
            read: true,
            readAt: new Date()
          }
        }
      );

      return true;
    } catch (error) {
      throw new Error(`Failed to mark conversation as read: ${error.message}`);
    }
  }

  // Toggle chat mute for a user
  static async toggleChatMute(conversationId, userId) {
    try {
      const chat = await Chat.findById(conversationId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      await chat.toggleMute(userId);
      return chat.isUserMuted(userId);
    } catch (error) {
      throw new Error(`Failed to toggle chat mute: ${error.message}`);
    }
  }

  // Toggle chat pin for a user
  static async toggleChatPin(conversationId, userId) {
    try {
      const chat = await Chat.findById(conversationId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      await chat.togglePin(userId);
      return chat.isPinnedForUser(userId);
    } catch (error) {
      throw new Error(`Failed to toggle chat pin: ${error.message}`);
    }
  }

  // Edit a message
  static async editMessage(messageId, userId, newContent) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      if (message.senderId.toString() !== userId) {
        throw new Error('Only sender can edit message');
      }

      // Check if message is older than 15 minutes
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      if (message.timestamp < fifteenMinutesAgo) {
        throw new Error('Message can only be edited within 15 minutes');
      }

      message.originalContent = message.content;
      message.content = newContent;
      message.isEdited = true;
      message.editedAt = new Date();

      await message.save();
      return message;
    } catch (error) {
      throw new Error(`Failed to edit message: ${error.message}`);
    }
  }

  // Add reaction to a message
  static async addMessageReaction(messageId, userId, emoji) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Remove existing reaction from this user
      message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
      
      // Add new reaction
      message.reactions.push({ userId, emoji });
      await message.save();

      return message.reactions;
    } catch (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
  }

  // Remove reaction from a message
  static async removeMessageReaction(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Remove reaction from this user
      message.reactions = message.reactions.filter(r => r.userId.toString() !== userId);
      await message.save();

      return message.reactions;
    } catch (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  }

  // Delete a message
  static async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      if (message.senderId.toString() !== userId) {
        throw new Error('Only sender can delete message');
      }

      await Message.findByIdAndDelete(messageId);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Get chat participants
  static async getChatParticipants(conversationId) {
    try {
      const chat = await Chat.findById(conversationId)
        .populate('participants', 'firstName lastName role');

      if (!chat) {
        throw new Error('Chat not found');
      }

      return chat.participants;
    } catch (error) {
      throw new Error(`Failed to get chat participants: ${error.message}`);
    }
  }

  // Get conversation statistics
  static async getConversationStats(conversationId) {
    try {
      const stats = await Message.aggregate([
        { $match: { conversationId: conversationId } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            textMessages: {
              $sum: { $cond: [{ $eq: ['$messageType', 'text'] }, 1, 0] }
            },
            imageMessages: {
              $sum: { $cond: [{ $eq: ['$messageType', 'image'] }, 1, 0] }
            },
            fileMessages: {
              $sum: { $cond: [{ $eq: ['$messageType', 'file'] }, 1, 0] }
            },
            audioMessages: {
              $sum: { $cond: [{ $eq: ['$messageType', 'audio'] }, 1, 0] }
            },
            videoMessages: {
              $sum: { $cond: [{ $eq: ['$messageType', 'video'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalMessages: 0,
        textMessages: 0,
        imageMessages: 0,
        fileMessages: 0,
        audioMessages: 0,
        videoMessages: 0
      };
    } catch (error) {
      throw new Error(`Failed to get conversation stats: ${error.message}`);
    }
  }
}

module.exports = ChatService;
