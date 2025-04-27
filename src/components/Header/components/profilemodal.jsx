import React, { useState } from 'react';

const ProfileModal = ({ onClose }) => {
  const user = {
    profile_picture: 'https://via.placeholder.com/150', // Hardcoded profile picture URL
    full_name: 'John Doe', // Hardcoded name
    username: 'johndoe', // Hardcoded username
    email: 'johndoe@example.com', // Hardcoded email
    aadhar_number: '1234-5678-9123', // Hardcoded Aadhar number
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50"
         style={{
           backdropFilter: 'blur(4px)', // Apply a subtle blur effect to the background
           backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
         }}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-200"
        >
          &times;
        </button>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        {/* Profile Details */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">{user.full_name}</h3>
          <p className="text-sm text-gray-500 mb-2">@{user.username}</p>
          <p className="text-sm text-gray-600 mb-4">{user.email}</p>

          {/* Display Aadhar number if it exists */}
          {user.aadhar_number && (
            <p className="text-sm text-gray-600 mb-4">Aadhar: {user.aadhar_number}</p>
          )}

          {/* Password field (masked) */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Password: </span>
            <span className="text-sm text-gray-500">********</span> {/* Hide the actual password for security */}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
