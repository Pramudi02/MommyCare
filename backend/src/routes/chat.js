const express = require('express');
const router = express.Router();
const {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  updateMessageStatus,
  markConversationAsRead,
  deleteMessage,
  getUnreadCount,
  searchConversations
} = require('../controllers/chatController');
const { uploadChatFile, handleFileUploadError, getFileInfo } = require('../middleware/fileUpload');

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         sender:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             avatar: { type: string }
 *             role: { type: string }
 *             specialty: { type: string }
 *         recipient:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             avatar: { type: string }
 *             role: { type: string }
 *         content:
 *           type: string
 *           description: Message content
 *         messageType:
 *           type: string
 *           enum: [text, file, image]
 *           description: Type of message
 *         status:
 *           type: string
 *           enum: [sending, sent, delivered, read]
 *           description: Message status
 *         read:
 *           type: boolean
 *           description: Whether message has been read
 *         readAt:
 *           type: string
 *           format: date-time
 *           description: When message was read
 *         conversationId:
 *           type: string
 *           description: Generated conversation ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Conversation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Chat ID
 *         conversationId:
 *           type: string
 *           description: Generated conversation ID
 *         participant:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             name: { type: string }
 *             email: { type: string }
 *             role: { type: string }
 *             avatar: { type: string }
 *             specialty: { type: string }
 *         lastMessage:
 *           type: object
 *           properties:
 *             content: { type: string }
 *             sender: { type: string }
 *             timestamp: { type: string, format: date-time }
 *             messageType: { type: string }
 *         unreadCount:
 *           type: number
 *           description: Number of unread messages
 *         lastActivity:
 *           type: string
 *           format: date-time
 *         startedAt:
 *           type: string
 *           format: date-time
 *     
 *     FileUpload:
 *       type: object
 *       properties:
 *         filename:
 *           type: string
 *           description: Generated filename
 *         originalName:
 *           type: string
 *           description: Original file name
 *         mimetype:
 *           type: string
 *           description: File MIME type
 *         size:
 *           type: number
 *           description: File size in bytes
 *         path:
 *           type: string
 *           description: File storage path
 */

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get user conversations
 *     description: Retrieve all conversations for the authenticated user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/conversations', getUserConversations);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/messages:
 *   get:
 *     summary: Get conversation messages
 *     description: Retrieve all messages for a specific conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The conversation identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Internal server error
 */
router.get('/conversations/:conversationId/messages', getConversationMessages);

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a message
 *     description: Send a new message to a recipient
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
 *                 description: ID of the recipient
 *               content:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [text, file, image]
 *                 default: text
 *                 description: Type of message
 *               file:
 *                 type: object
 *                 description: File information (if messageType is file or image)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Bad request - Invalid input
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Recipient not found
 *       500:
 *         description: Internal server error
 */
router.post('/send', sendMessage);

/**
 * @swagger
 * /api/chat/upload:
 *   post:
 *     summary: Upload file for chat
 *     description: Upload a file (image or document) for chat messaging
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (max 10MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/FileUpload'
 *       400:
 *         description: Bad request - No file or invalid file type
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       413:
 *         description: File too large - Maximum size is 10MB
 *       500:
 *         description: Internal server error
 */
router.post('/upload', uploadChatFile, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    const fileInfo = getFileInfo(req.file);
    
    res.json({
      status: 'success',
      data: fileInfo
    });
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload file'
    });
  }
});

/**
 * @swagger
 * /api/chat/messages/{messageId}/status:
 *   patch:
 *     summary: Update message status
 *     description: Update the status of a message (delivered, read)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The message identifier
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
 *                 enum: [delivered, read]
 *                 description: New message status
 *     responses:
 *       200:
 *         description: Message status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *       400:
 *         description: Bad request - Invalid status
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
router.patch('/messages/:messageId/status', updateMessageStatus);

/**
 * @swagger
 * /api/chat/conversations/{conversationId}/read:
 *   patch:
 *     summary: Mark conversation as read
 *     description: Mark all messages in a conversation as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The conversation identifier
 *     responses:
 *       200:
 *         description: Conversation marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Conversation marked as read
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Internal server error
 */
router.patch('/conversations/:conversationId/read', markConversationAsRead);

/**
 * @swagger
 * /api/chat/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     description: Delete a message (only sender can delete)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The message identifier
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Message deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Message not found or unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/messages/:messageId', deleteMessage);

/**
 * @swagger
 * /api/chat/unread-count:
 *   get:
 *     summary: Get unread message count
 *     description: Get the total unread message count and count by conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUnread:
 *                       type: number
 *                       description: Total unread messages
 *                       example: 5
 *                     unreadByConversation:
 *                       type: object
 *                       description: Unread count by conversation ID
 *                       example:
 *                         user1_user2: 2
 *                         user1_user3: 3
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/unread-count', getUnreadCount);

/**
 * @swagger
 * /api/chat/search:
 *   get:
 *     summary: Search conversations
 *     description: Search for users to start conversations with
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for name, specialty, or email
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id: { type: string }
 *                           name: { type: string }
 *                           email: { type: string }
 *                           role: { type: string }
 *                           avatar: { type: string }
 *                           specialty: { type: string }
 *                       hasExistingChat:
 *                         type: boolean
 *                         description: Whether user has existing chat
 *                       conversationId:
 *                         type: string
 *                         description: Existing conversation ID if any
 *       400:
 *         description: Bad request - Missing search query
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchConversations);

// Error handling for file upload
router.use(handleFileUploadError);

module.exports = router;
