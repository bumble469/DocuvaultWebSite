import React, { useContext, useState } from 'react';
import logo from '../../assets/images/logo1.png';
import { FaUserCircle, FaUpload, FaSearch } from 'react-icons/fa';
import sunicon from '../../assets/images/sunicon.png';
import moonicon from '../../assets/images/moonicon.png';
import bellicondark from '../../assets/images/bellicon.png';
import belliconwhite from '../../assets/images/belliconwhite.png';
import { useMediaQuery } from 'react-responsive';
import ThemeContext from '../../context/ThemeContext.jsx';

const Header = ({ setSearchQuery }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleDarkMode = () => {
    toggleTheme();
  };

  return (
    <header className={`w-full shadow-sm p-1 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center px-2 justify-between w-full">
        {/* Logo with title text */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-8 md:h-12 w-auto transition-transform duration-300 hover:scale-105 hover:brightness-80 cursor-pointer"
          />
          <div className={`h-10 border-l-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
          <div className="mt-2">
            <h3 className={`!text-sm md:!text-xl lg:!text-2xl font-semibold leading-tight m-0 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>DOCUVAULT</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>your personal document wallet</p>
          </div>
        </div>

        {/* Search Bar (Centered) */}
        <div className={`${isMobile ? 'hidden' : 'flex flex-1 justify-center'}`}>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-sm px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-56 rounded-full w-full`}
            />
            <button className={`!rounded-full absolute right-2 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xl p-2`}>
              <FaSearch className='hover:scale-110 transition-transform'/>
            </button>
          </div>
        </div>

        {/* Right-aligned Links and Icons */}
        <div className="flex items-center space-x-1 ml-auto">
          {/* Upload Link */}
          <a
            href="#home"
            className={`rounded-sm !text-xs md:!text-sm lg:!text-md flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} !no-underline hover:scale-105 transition-transform duration-200 px-3 py-3 ${isMobile ? 'hidden' : 'block'}`}
          >
            <FaUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-xl`} />
            <span>Upload</span>
          </a>

          {/* Notifications Icon */}
          <button className={`relative !text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-yellow-600 hover:bg-blue-100'} transition-bg duration-200 p-2.5 m-1`}>
            {theme === 'dark' ? <img src={belliconwhite} height={25} width={25} /> : <img src={bellicondark} height={25} width={25} />}
            <span className="absolute top-1 right-1 bg-red-500 text-white !text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`!text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-gray-600 hover:bg-blue-100'} transition-bg duration-200 rounded-full p-2.5 m-1`}
          >
            {theme === 'dark' ? <img src={sunicon} height={25} width={25} /> : <img src={moonicon} height={25} width={25} />}
          </button>

          {/* Profile Icon */}
          <button className={`md:!text-3xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} transition duration-300 hover:bg-blue-100 p-2.5 m-1`}>
            <FaUserCircle />
          </button>
        </div>
      </div>

      {isMobile && (
        <div className={`mobile-header flex justify-between items-center px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
          {/* Search Bar */}
          <div className="relative flex-1 mr-2">
            <input
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className={`text-md px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-full rounded-full`}
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
