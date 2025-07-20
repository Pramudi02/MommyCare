import React from 'react';
import { Search, Heart } from 'lucide-react';

const MainNavbar = ({ onSignUpClick, onLoginClick }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-50 to-pink-50 shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-400 to-pink-400 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              MommyCare
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search baby care tips, products..."
                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-full bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-blue-400 text-gray-700 text-sm sm:text-base"
              />
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              className="px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:bg-blue-100 rounded-full text-sm sm:text-base"
              onClick={onLoginClick}
            >
              Login
            </button>
            <button 
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-full hover:from-blue-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;