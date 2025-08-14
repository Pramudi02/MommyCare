import React from 'react';
import { Search, ShoppingBag, Package, Baby, Shield, Users, Headphones, Star, Smile } from 'lucide-react';
import './BabyProduct.css';

const BabyProduct = () => {
  const categories = ['All Products', 'Feeding', 'Comfort', 'Travel', 'Clothing', 'Safety'];
  const stats = [
    { number: '8', label: 'Product Categories', icon: <Package className="text-pink-400 mx-auto mb-2" size={28} /> },
    { number: '150+', label: 'Product Reviews', icon: <Star className="text-pink-400 mx-auto mb-2" size={28} /> },
    { number: '24/7', label: 'Expert Support', icon: <Headphones className="text-pink-400 mx-auto mb-2" size={28} /> }
  ];
  const products = [
    {
      id: 1,
      name: 'Breast Pump',
      description: 'Electric and manual breast pumps for convenient feeding. BPA-free materials with multiple suction levels.',
      tag: 'Essential',
      tagColor: 'bg-purple-500',
      buttonText: 'View Options',
      buttonColor: 'bg-pink-300',
      icon: <Baby className="text-pink-400" size={32} />
    },
    {
      id: 2,
      name: 'Baby Bottle',
      description: 'Anti-colic bottles with natural flow nipples. Available in various sizes and designs.',
      tag: 'Daily Use',
      tagColor: 'bg-purple-500',
      buttonText: 'Shop Bottles',
      buttonColor: 'bg-pink-400',
      icon: <ShoppingBag className="text-pink-400" size={32} />
    },
    {
      id: 3,
      name: 'Diaper',
      description: 'Ultra-soft, super-absorbent diapers. Available in all sizes with wetness indicator.',
      tag: 'Essential',
      tagColor: 'bg-purple-500',
      buttonText: 'Choose Size',
      buttonColor: 'bg-pink-400',
      icon: <Shield className="text-pink-400" size={32} />
    },
    {
      id: 4,
      name: 'Baby Carrier',
      description: 'Ergonomic carriers for safe and comfortable baby wearing. Multiple carrying positions.',
      tag: 'Bonding',
      tagColor: 'bg-purple-500',
      buttonText: 'Find Perfect Fit',
      buttonColor: 'bg-pink-400',
      icon: <Users className="text-pink-400" size={32} />
    },
    {
      id: 5,
      name: 'Diaper Bag',
      description: 'Spacious organized bags with multiple compartments. Stylish designs for modern parents.',
      tag: 'Organization',
      tagColor: 'bg-purple-500',
      buttonText: 'Browse Styles',
      buttonColor: 'bg-pink-400',
      icon: <Package className="text-pink-400" size={32} />
    },
    {
      id: 6,
      name: 'Baby Stroller',
      description: 'Lightweight, compact strollers with smooth maneuverability. Safety certified with comfort features.',
      tag: 'Mobility',
      tagColor: 'bg-purple-500',
      buttonText: 'Compare Models',
      buttonColor: 'bg-pink-400',
      icon: <Smile className="text-pink-400" size={32} />
    }
  ];
  return (
    <div className="baby-product-page bg-gray-50 p-4">
      <div className="baby-product-container  mx-auto">
        {/* Header */}
        <div className="headerBabyProduct">
          <div className="headerBabyProduct-icon">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="headerBabyProduct-title">Baby Products</h1>
          <p className="headerBabyProduct-description">
            Everything you need for your little one - from feeding essentials to comfort items, all carefully curated for your baby's safety and development.
          </p>
          
          {/* Search Bar inside Header */}
          <div className="header-search-container">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for baby products..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-full shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
        </div>
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                index === 0
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-pink-100 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              {stat.icon}
              <div className="text-3xl font-bold text-pink-500 mb-2">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Tag */}
              <div className="flex justify-start mb-4">
                <span className={`${product.tagColor} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                  {product.tag}
                </span>
              </div>
              {/* Icon */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-200 to-orange-300 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  {product.icon}
                </div>
              </div>
              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
              {/* Button */}
              <button className={`w-full ${product.buttonColor} text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md`}>
                {product.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BabyProduct;