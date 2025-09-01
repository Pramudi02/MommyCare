# MommyCare Service Provider Product System

## Overview

The MommyCare Service Provider Product System allows service providers to create, manage, and showcase their baby care products through the platform. The system includes a complete backend API, database models, and frontend interface for product management.

## Features

### 🛍️ Product Management
- **Create Products**: Add new products with images, descriptions, and external links
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products from the platform
- **Product Categories**: Organize products into predefined categories
- **Status Management**: Track product approval status (pending, active, inactive, rejected)

### 📊 Analytics & Tracking
- **View Tracking**: Monitor how many times products are viewed
- **Click Tracking**: Track external link clicks
- **Product Statistics**: Get comprehensive analytics for service providers

### 🔐 Security & Permissions
- **Role-based Access**: Only service providers can manage their products
- **Authentication Required**: All management operations require valid JWT tokens
- **File Upload Security**: Secure image upload with validation

## Database Schema

### Product Collection
```javascript
{
  _id: ObjectId,
  serviceProvider: ObjectId, // Reference to User
  name: String, // Product name
  category: String, // One of predefined categories
  price: Number, // Product price
  description: String, // Product description
  externalLink: String, // URL to external store
  image: String, // Image filename
  tags: [String], // Product tags
  status: String, // pending, active, inactive, rejected
  review: {
    reviewedBy: ObjectId, // Admin who reviewed
    reviewedAt: Date,
    reviewNotes: String
  },
  views: Number, // View count
  clicks: Number, // Click count
  slug: String, // SEO-friendly URL slug
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Service Provider Routes (Protected)
- `GET /api/service-provider/products` - Get all products for service provider
- `POST /api/service-provider/products` - Create new product
- `PUT /api/service-provider/products/:id` - Update product
- `DELETE /api/service-provider/products/:id` - Delete product
- `GET /api/service-provider/products/stats` - Get product statistics

### Public Routes
- `GET /api/products` - Get all active products (for moms)
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get product categories with counts
- `POST /api/products/:id/click` - Track product click

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Product.js                 # Product database model
│   ├── controllers/
│   │   └── productController.js       # Product API logic
│   ├── routes/
│   │   ├── serviceProvider.js         # Service provider routes
│   │   └── products.js                # Public product routes
│   └── middleware/
│       └── fileUpload.js              # File upload handling

frontend/
└── src/
    └── service_provider/
        └── pages/
            ├── ProductForm.jsx        # Product creation/editing form
            └── ProductForm.css        # Form styling
```

## Setup Instructions

### 1. Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mommycare
   JWT_SECRET=your_jwt_secret
   BASE_URL=http://localhost:5000
   ```

3. **Start Server**:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

### 3. Database Setup

The Product collection will be automatically created when the first product is added. No manual database setup is required.

## Usage Guide

### For Service Providers

1. **Login** to your service provider account
2. **Navigate** to the products section
3. **Click** "Add New Product"
4. **Fill out** the product form:
   - Product name
   - Category selection
   - Price
   - Description
   - External link (where customers can purchase)
   - Upload product image
   - Add relevant tags
5. **Submit** the form
6. **Wait** for admin approval (products start as "pending")
7. **Monitor** your products through the dashboard

### For Moms (Public Access)

1. **Browse** products through the public API
2. **View** product details
3. **Click** external links to purchase
4. **Filter** by category or search

## Product Categories

- **Feeding**: Bottles, pacifiers, feeding accessories
- **Comfort**: Blankets, pillows, comfort items
- **Travel**: Car seats, strollers, travel accessories
- **Clothing**: Baby clothes, shoes, accessories
- **Safety**: Safety gates, monitors, safety equipment
- **Toys**: Educational toys, play items
- **Health**: Health monitoring, medical supplies
- **Bath & Care**: Bath products, care items
- **Sleep**: Cribs, sleep aids, bedding
- **Development**: Learning toys, development tools

## File Upload

- **Supported Formats**: JPG, PNG, GIF, WebP
- **Maximum Size**: 5MB per image
- **Storage**: Local file system (configurable for cloud storage)
- **Security**: File type validation and sanitization

## API Examples

### Create Product
```javascript
const formData = new FormData();
formData.append('name', 'Premium Baby Carrier');
formData.append('category', 'Travel');
formData.append('price', '89.99');
formData.append('description', 'Ergonomic baby carrier...');
formData.append('externalLink', 'https://store.com/product');
formData.append('image', imageFile);
formData.append('tags', 'Ergonomic,Adjustable,Comfortable');

const response = await fetch('/api/service-provider/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Get Active Products
```javascript
const response = await fetch('/api/products?category=Travel&page=1&limit=12');
const data = await response.json();
```

## Testing

Run the test script to verify the system:
```bash
node test-product-system.js
```

## Security Considerations

1. **Authentication**: All management operations require valid JWT tokens
2. **Authorization**: Service providers can only manage their own products
3. **File Upload**: Strict file type and size validation
4. **Input Validation**: All inputs are validated and sanitized
5. **Rate Limiting**: API endpoints are rate-limited to prevent abuse

## Future Enhancements

1. **Admin Review System**: Admin interface for product approval
2. **Product Analytics**: Detailed analytics dashboard
3. **Inventory Management**: Stock tracking and management
4. **Commission System**: Revenue sharing with service providers
5. **Product Reviews**: Customer review system
6. **Recommendation Engine**: AI-powered product recommendations
7. **Multi-language Support**: Internationalization
8. **Cloud Storage**: Integration with AWS S3 or similar
9. **CDN Integration**: Fast image delivery
10. **SEO Optimization**: Better search engine optimization

## Troubleshooting

### Common Issues

1. **File Upload Fails**:
   - Check file size (max 5MB)
   - Verify file format (images only)
   - Ensure uploads directory exists

2. **Authentication Errors**:
   - Verify JWT token is valid
   - Check user role is 'service_provider'
   - Ensure token is not expired

3. **Database Connection**:
   - Verify MongoDB is running
   - Check connection string
   - Ensure database permissions

### Support

For technical support or questions about the product system, please contact the development team or refer to the main MommyCare documentation.

## License

This product system is part of the MommyCare platform and follows the same licensing terms.
