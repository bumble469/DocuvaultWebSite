import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dummyimg from '../../../assets/images/docuvaultimage.jpg';
import { toast } from 'react-toastify';

const ProfileModal = ({ onClose }) => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ email: '', aadhar_number: '' });
  const API_URL = import.meta.env.VITE_API_URL;
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost:8000/users/details/", {}, { withCredentials: true });
        if (response.data.success === true) {
          setUserData({
            full_name: response.data.user.full_name,
            username: response.data.user.username,
            email: response.data.user.email,
            aadhar_number: response.data.user.aadhar_number || '',
            profile_picture: response.data.user.profile_picture || dummyimg,
          });
        } else {
          toast.error(`Error during profile update! ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadhar_number") {
      const numericValue = value.replace(/\D/g, '');
      setUserData((prev) => ({
        ...prev,
        [name]: numericValue.substring(0, 12),
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    validateForm();
  };

  const validateForm = () => {
    let valid = true;
    let emailError = '';
    let aadharError = '';

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (userData.email && !emailPattern.test(userData.email)) {
      emailError = 'Please enter a valid email address.';
      valid = false;
    }

    const aadharPattern = /^[0-9]{12}$/;
    if (userData.aadhar_number && !aadharPattern.test(userData.aadhar_number)) {
      aadharError = 'Aadhar number must be 12 digits and numeric.';
      valid = false;
    }

    setErrors({
      email: emailError,
      aadhar_number: aadharError,
    });

    return valid;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);
        setUserData((prev) => ({
          ...prev,
          profile_picture: base64Image,
        }));
        setImagePreview(base64Image);
        setIsEditing(true);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (validateForm()) {
        setIsEditing(false);
  
        // Make the API call to update user data
        const response = await axios.post(
          `${API_URL}/users/update`,
          { ...userData },
          { withCredentials: true }
        );
    
        if (response.data.success === true) {
          toast.success(`Profile Updated! ${response.data.message}`);
        } else {
          toast.error(`Profile update failed! ${response.data.message}`);
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };
  
  

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="profile-modal p-6 md:p-8 rounded-md shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 !text-3xl"
        >
          &times;
        </button>

        <div>
          <h3 className="text-2xl font-bold text-gray-800">Profile Details</h3>
          <hr className="border-0 h-[2px] bg-gray-400 rounded my-4" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-[30%] flex flex-col items-center">
            <div className="relative">
              <img
                src={imagePreview || userData.profile_picture}
                alt="Profile"
                className="w-32 h-32 md:w-38 md:h-38 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
            <button
              className="mt-4 p-2 bg-gray-400 hover:bg-gray-600 transition-all !rounded-xs text-sm md:text-base"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Change Picture
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </button>
          </div>

          <div className="flex flex-col w-full md:w-[70%] space-y-4">
            <div className="flex justify-center md:justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white !rounded-xs hover:bg-blue-600 transition-all text-sm md:text-base"
                onClick={() => setIsEditing(true)}
              >
                Edit Details
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="text-gray-600 text-sm w-32">Full Name:</label>
              <input
                type="text"
                name="full_name"
                value={userData.full_name || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`border border-gray-300 rounded-md p-2 text-gray-800 flex-1 focus:outline-none focus:ring-2 ${isEditing ? 'focus:ring-blue-400' : ''} text-sm md:text-base`}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="text-gray-600 text-sm w-32">Username:</label>
              <input
                type="text"
                name="username"
                value={userData.username || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`border border-gray-300 rounded-md p-2 text-gray-800 flex-1 focus:outline-none focus:ring-2 ${isEditing ? 'focus:ring-blue-400' : ''} text-sm md:text-base`}
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="text-gray-600 text-sm w-32">Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email || ''}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`border border-gray-300 rounded-md p-2 text-gray-800 flex-1 focus:outline-none focus:ring-2 ${isEditing ? 'focus:ring-blue-400' : ''} text-sm md:text-base`}
              />
            </div>
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label className="text-gray-600 text-sm w-32">Aadhar Number:</label>
              <div className="flex flex-col">
                <label className="text-gray-500 text-xs mb-1">Link Aadhar for document uploads</label>
                <input
                  type="text"
                  name="aadhar_number"
                  value={userData.aadhar_number || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  maxLength={12}
                  className="border border-gray-300 rounded-md p-2 text-gray-800 flex-1 focus:outline-none focus:ring-2 text-sm md:text-base"
                />
              </div>
              {errors.aadhar_number && <span className="text-red-500 text-xs mt-1">{errors.aadhar_number}</span>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="px-6 py-2 bg-green-600 text-white !rounded-xs hover:bg-green-700 transition-all text-sm md:text-base"
            onClick={handleSave}
          >
            {isEditing ? 'Save Changes' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
