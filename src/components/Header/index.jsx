import React, { useContext, useState } from 'react';
import logo from '../../assets/images/logo1.png';
import { FaMoon, FaSun, FaUserCircle, FaUpload, FaSearch, FaBell } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import ThemeContext from '../../context/ThemeContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Access the theme and toggleTheme from the context
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Toggle the theme on button click
  const toggleDarkMode = () => {
    toggleTheme();
  };

  return (
    <header className={`w-full shadow-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center py-2 px-2">
        {/* Logo with title text */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-8 md:h-12 w-auto transition-transform duration-300 hover:scale-105 hover:brightness-80 cursor-pointer"
          />
          <div className={`h-10 border-l-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
          <div className="mt-2">
            <h3 className={`!text-sm md:!text-2xl lg:!text-3xl font-semibold leading-tight m-0 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Docuvault</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>your personal document wallet</p>
          </div>
        </div>
        {/* Links and icons */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Search Bar */}
          <div className={`relative ${isMobile ? 'hidden' : 'block'}`}>
            <input
              type="text"
              placeholder="Search documents..."
              className={`text-sm px-2 md:px-3 lg:px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-56`}
            />
            <button className={`absolute right-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} !text-xl`}>
              <FaSearch />
            </button>
          </div>

          {/* Upload Link */}
          <a
            href="#home"
            className={`rounded !text-sm md:!text-md lg:!text-lg flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} !no-underline hover:scale-105 transition-transform duration-200 px-3 py-2 ${isMobile ? 'hidden' : 'block'}`}
          >
            <FaUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-xl`} />
            <span>Upload</span>
          </a>

          {/* Notifications Icon */}
          <button className={`relative !text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-yellow-600 hover:bg-blue-100'} transition-bg duration-200 m-2 p-2`}>
            <FaBell />
            <span className="absolute top-0 right-0 bg-red-500 text-white !text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`!text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-gray-600 hover:bg-blue-100'} transition-bg duration-200 m-2 rounded-full p-2`}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          {/* Profile Icon */}
          <button className={`md:!text-3xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} transition duration-300 hover:text-gray-500 m-2`}>
            <FaUserCircle />
          </button>
        </div>
      </div>
      {isMobile && (
        <div className={`mobile-header flex justify-between items-center px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search documents..."
              className={`text-md px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-full`}
            />
            <button className={`absolute right-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} !text-xl`}>
              <FaSearch />
            </button>
          </div>

          {/* Upload Link */}
          <a
            href="#home"
            className={`text-md flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} !no-underline hover:scale-105 transition-transform duration-200 px-3 py-2`}
          >
            <FaUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-xl`} />
            <span>Upload</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
