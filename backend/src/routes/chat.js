const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  updateMessageStatus,
  markConversationAsRead,
  searchConversations,
  toggleChatMute,
  toggleChatPin,
  getChatParticipants,
  editMessage,
  addMessageReaction,
  removeMessageReaction,
  getAllHealthcareProviders,
  deleteMessage
} = require('../controllers/chatController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         content:
 *           type: string
 *         messageType:
 *           type: string
 *           enum: [text, image, file, audio, video]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         sender:
 *           type: string
 *           enum: [user, provider]
 *         senderId:
 *           type: string
 *         recipientId:
 *           type: string
 *         read:
 *           type: boolean
 *         file:
 *           type: object
 *         attachments:
 *           type: array
 *         isEdited:
 *           type: boolean
 *         editedAt:
 *           type: string
 *           format: date-time
 *         reactions:
 *           type: array
 *         replyTo:
 *           type: string
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [direct, group]
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               avatar:
 *                 type: string
 *         lastMessage:
 *           $ref: '#/components/schemas/ChatMessage'
 *         unreadCount:
 *           type: number
 *         isMuted:
 *           type: boolean
 *         isPinned:
 *           type: boolean
 *         metadata:
 *           type: object
 */

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get user conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 */
router.get('/conversations', protect, getUserConversations);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get conversation messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of conversation messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/conversations/:conversationId/messages', protect, getConversationMessages);

/**
 * @swagger
 * /api/chat/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file, audio, video]
 *                 default: text
 *               replyTo:
 *                 type: string
 *               file:
 *                 type: object
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 */
router.post('/messages', protect, sendMessage);

/**
 * @swagger
 * /api/chat/messages/{messageId}/status:
 *   patch:
 *     summary: Update message status
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [sent, delivered, read]
 *     responses:
 *       200:
 *         description: Message status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 */
router.patch('/messages/:messageId/status', protect, updateMessageStatus);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/read:
 *   patch:
 *     summary: Mark conversation as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.patch('/conversations/:conversationId/read', protect, markConversationAsRead);

/**
 * @swagger
 * /api/chat/search:
 *   get:
 *     summary: Search for users to start conversations
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [mom, doctor, midwife, service_provider]
 *     responses:
 *       200:
 *         description: List of users matching search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       avatar:
 *                         type: string
 */
router.get('/search', protect, searchConversations);

/**
 * @swagger
 * /api/chat/providers:
 *   get:
 *     summary: Get all healthcare providers (doctors and midwives)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [doctor, midwife]
 *         description: Filter by specific role (optional)
 *     responses:
 *       200:
 *         description: List of healthcare providers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       specialty:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       status:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       experience:
 *                         type: string
 *                       location:
 *                         type: string
 *                       availability:
 *                         type: string
 *                 total:
 *                   type: number
 */
router.get('/providers', protect, getAllHealthcareProviders);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/mute:
 *   patch:
 *     summary: Toggle chat mute
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat mute toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isMuted:
 *                       type: boolean
 */
router.patch('/conversations/:conversationId/mute', protect, toggleChatMute);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/pin:
 *   patch:
 *     summary: Toggle chat pin
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat pin toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isPinned:
 *                       type: boolean
 */
router.patch('/conversations/:conversationId/pin', protect, toggleChatPin);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/participants:
 *   get:
 *     summary: Get chat participants
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chat participants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       avatar:
 *                         type: string
 */
router.get('/conversations/:conversationId/participants', protect, getChatParticipants);

/**
 * @swagger
 * /api/chat/messages/{messageId}/edit:
 *   patch:
 *     summary: Edit a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     content:
 *                       type: string
 *                     isEdited:
 *                       type: boolean
 *                     editedAt:
 *                       type: string
 *                       format: date-time
 */
router.patch('/messages/:messageId/edit', protect, editMessage);

/**
 * @swagger
 * /api/chat/messages/{messageId}/reactions:
 *   post:
 *     summary: Add reaction to message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emoji
 *             properties:
 *               emoji:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reactions:
 *                       type: array
 */
router.post('/messages/:messageId/reactions', protect, addMessageReaction);

/**
 * @swagger
 * /api/chat/messages/{messageId}/reactions:
 *   delete:
 *     summary: Remove reaction from message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reaction removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reactions:
 *                       type: array
 */
router.delete('/messages/:messageId/reactions', protect, removeMessageReaction);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Delete a message permanently
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Message not found
 *       403:
 *         description: Unauthorized to delete this message
 */
router.delete('/messages/:messageId', protect, deleteMessage);

module.exports = router;
