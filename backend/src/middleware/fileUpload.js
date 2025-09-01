const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const chatUploadsDir = path.join(uploadsDir, 'chat');
const imageUploadsDir = path.join(chatUploadsDir, 'images');
const fileUploadsDir = path.join(chatUploadsDir, 'files');
const audioUploadsDir = path.join(chatUploadsDir, 'audio');
const videoUploadsDir = path.join(chatUploadsDir, 'videos');
const productUploadsDir = path.join(uploadsDir, 'products');

// Create directories if they don't exist
[uploadsDir, chatUploadsDir, imageUploadsDir, fileUploadsDir, audioUploadsDir, videoUploadsDir, productUploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for chat files
const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type
    let destination = chatUploadsDir;
    
    if (file.mimetype.startsWith('image/')) {
      destination = imageUploadsDir;
    } else if (file.mimetype.startsWith('audio/')) {
      destination = audioUploadsDir;
    } else if (file.mimetype.startsWith('video/')) {
      destination = videoUploadsDir;
    } else {
      destination = fileUploadsDir;
    }
    
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    
    // Sanitize filename
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    
    cb(null, `chat-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Enhanced file filter for chat uploads
const chatFileFilter = (req, file, cb) => {
  // Allow images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Allow audio files
  else if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  }
  // Allow video files
  else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  }
  // Allow documents
  else if (file.mimetype === 'application/pdf' ||
           file.mimetype === 'application/msword' ||
           file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
           file.mimetype === 'text/plain' ||
           file.mimetype === 'application/vnd.ms-excel' ||
           file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           file.mimetype === 'application/vnd.ms-powerpoint' ||
           file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    cb(null, true);
  }
  // Reject other file types
  else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, audio, video, and documents are allowed.`), false);
  }
};

// Configure storage for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    
    // Sanitize filename
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    
    cb(null, `product-${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for product images (only images allowed)
const productFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for products'), false);
  }
};

// Configure multer for chat file uploads
const chatUpload = multer({
  storage: chatStorage,
  fileFilter: chatFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for chat files
    files: 5 // Allow up to 5 files at once
  }
});

// Configure multer for product image uploads
const productUpload = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for product images
    files: 1 // Only one image per product
  }
});

// Middleware for single file upload
const uploadChatFile = chatUpload.single('file');

// Middleware for multiple file uploads
const uploadMultipleChatFiles = chatUpload.array('files', 5);

// Middleware for product image upload
const uploadProductImage = productUpload.single('image');

// Error handling middleware for file upload errors
const handleFileUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        status: 'error',
        message: 'File size too large. Maximum size is 50MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({
        status: 'error',
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        status: 'error',
        message: 'Unexpected file field in request.'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: 'File upload error: ' + error.message
    });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  
  next(error);
};

// Helper function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  // Determine file type category
  let fileType = 'file';
  if (file.mimetype.startsWith('image/')) {
    fileType = 'image';
  } else if (file.mimetype.startsWith('audio/')) {
    fileType = 'audio';
  } else if (file.mimetype.startsWith('video/')) {
    fileType = 'video';
  }
  
  return {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path.replace(/\\/g, '/'), // Normalize path separators
    fileType: fileType,
    url: `/uploads/chat/${fileType === 'image' ? 'images' : fileType === 'audio' ? 'audio' : fileType === 'video' ? 'videos' : 'files'}/${file.filename}`
  };
};

// Helper function to get multiple files info
const getMultipleFilesInfo = (files) => {
  if (!files || !Array.isArray(files)) return [];
  
  return files.map(file => getFileInfo(file));
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to delete multiple files
const deleteMultipleFiles = (filePaths) => {
  const results = [];
  
  filePaths.forEach(filePath => {
    results.push({
      path: filePath,
      deleted: deleteFile(filePath)
    });
  });
  
  return results;
};

// Helper function to validate file size
const validateFileSize = (fileSize, maxSize = 50 * 1024 * 1024) => {
  return fileSize <= maxSize;
};

// Helper function to validate file type
const validateFileType = (mimetype) => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Audio
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/webm',
    // Video
    'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv',
    // Documents
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  return allowedTypes.includes(mimetype);
};

// Helper function to get file extension from mimetype
const getFileExtension = (mimetype) => {
  const extensions = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/aac': '.aac',
    'audio/webm': '.webm',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogg',
    'video/avi': '.avi',
    'video/mov': '.mov',
    'video/wmv': '.wmv',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx'
  };
  
  return extensions[mimetype] || '';
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to check if file is image
const isImageFile = (mimetype) => {
  return mimetype.startsWith('image/');
};

// Helper function to check if file is audio
const isAudioFile = (mimetype) => {
  return mimetype.startsWith('audio/');
};

// Helper function to check if file is video
const isVideoFile = (mimetype) => {
  return mimetype.startsWith('video/');
};

// Helper function to check if file is document
const isDocumentFile = (mimetype) => {
  return !isImageFile(mimetype) && !isAudioFile(mimetype) && !isVideoFile(mimetype);
};

module.exports = {
  uploadChatFile,
  uploadMultipleChatFiles,
  uploadProductImage,
  upload: productUpload, // Default export for product uploads
  handleFileUploadError,
  getFileInfo,
  getMultipleFilesInfo,
  deleteFile,
  deleteMultipleFiles,
  validateFileSize,
  validateFileType,
  getFileExtension,
  formatFileSize,
  isImageFile,
  isAudioFile,
  isVideoFile,
  isDocumentFile,
  chatUploadsDir,
  imageUploadsDir,
  fileUploadsDir,
  audioUploadsDir,
  videoUploadsDir,
  productUploadsDir
};
