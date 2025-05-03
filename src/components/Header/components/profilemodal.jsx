import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dummyimg from "../../../assets/images/dummyimg.png"
import { toast } from 'react-toastify';
import editimageicon from "../../../assets/images/editimageicon.png";
import { useNavigate } from 'react-router-dom';

const ProfileModal = ({ onClose }) => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ email: '', aadhar_number: '' });
  const API_URL = import.meta.env.VITE_API_URL;
  const [originalEmail, setOriginEmail] = useState();
  const [otpVerificationModal, setOtpVerificationModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isAadharLinked, setIsAadharLinked] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/details/`, {}, { withCredentials: true });
      if (response.data.success === true) {
        setUserData({
          full_name: response.data.user.full_name,
          username: response.data.user.username,
          email: response.data.user.email,
          aadhar_number: response.data.user.aadhar_number,
          profile_picture: response.data.user.profile_picture,
        });
        setOriginEmail(response.data.user.email);
        if(response.data.user.aadhar_number !== null){
          setIsAadharLinked(true);
        }
      } else {
        toast.error(`Error during profile update! ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
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
        
        const isEmailUpdated = userData.email !== originalEmail;

        if (isEmailUpdated) {
          const otpResponse = await axios.post(
            `${API_URL}/users/update/send_otp/`,
            { user_email: userData.email },
            { withCredentials: true }
          );

          if (otpResponse.data.success) {
              setOtpVerificationModal(true);
          } else {
            toast.error("Failed to send OTP. Please try again.");
          }
        } else {
          const response = await axios.post(
            `${API_URL}/users/update/`,
            { ...userData },
            { withCredentials: true }
          );
  
          if (response.data.success) {
            toast.success(`Profile Updated! ${response.data.message}`);
          } else {
            toast.error(`Profile update failed! ${response.data.message}`);
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const verifyOtpResponse = await axios.post(
        `${API_URL}/users/update/verify_otp/`,
        { user_email: userData.email, otp },
        { withCredentials: true }
      );

      if (verifyOtpResponse.data.success) {
        const response = await axios.post(
          `${API_URL}/users/update/`,
          { ...userData },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success(`Profile Updated! ${response.data.message}`);
          setOtpVerificationModal(false);
        } else {
          toast.error(`Profile update failed! ${response.data.message}`);
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
    }
  };

  const handleDeleteClick = async(password) => {
    try{
      const res1 = await axios.post(`${API_URL}/users/delete/checkpassword/`,{password},{withCredentials:true});
      if(res1.data.success == true){
        const response = await axios.post(`${API_URL}/users/delete/`,{},{withCredentials:true});
        if(response.data.success == true){
          setShowDeleteModal(false);
          setPassword('')
          toast.info("Account has been terminated! Thakyou for using our platform :)");
          navigate("/");
        }
        else{
          toast.error(`Could not terminate accound: ${response.data.message}`);
        }
      }else{
        toast.error(`Error: ${response.data.message}`);
      }
    }
    catch(err){
      console.log(err);
    }
  }

  return (
  <div
    className="fixed inset-0 flex justify-center items-center z-50 px-4"
    style={{
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }}
  >
    <div className="profile-modal w-lg max-w-3xl max-h-[90vh] overflow-y-auto rounded-md shadow-lg bg-white">
      <div className="px-4 pt-2 flex justify-end items-center">
        <button
          onClick={onClose}
          className="!text-3xl text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
      </div>

      <div className="p-4 pt-0 flex flex-col items-center" style={{ minHeight: '80%' }}>
        {/* Profile image and edit button */}
        <div className="relative flex flex-col items-center -mt-4">
          {userData.profile_picture ? (
            <img
            src={userData.profile_picture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 p-2 transition-transform duration-300 ease-in-out hover:scale-105"
          />
          ):(
            <img
            src={dummyimg}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 p-2 transition-transform duration-300 ease-in-out hover:scale-105"
          />
          )}
          <button
            title="Change image"
            className="relative left-10 bottom-10 transition-scale duration-100 hover:scale-105"
            onClick={() =>{
              document.getElementById('fileInput').click()
              setIsEditing(true)
            }}
          >
            <img src={editimageicon} height={35} width={35} />
          </button>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <h2 className="text-xl font-semibold text-gray-800">{userData.full_name}</h2>
        </div>

        <hr className="w-full border-t-2 border-gray-800" />

        {/* Details form and buttons */}
        <div className="details w-full max-w-md space-y-4">
          <div className="flex justify-end">
            <button
              className="edit-details py-2 px-2 text-black bg-gray-100 rounded transition-bg duration-200 hover:!bg-gray-400"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Details
            </button>
          </div>

          {[{ label: 'Full Name', name: 'full_name' }, { label: 'Username', name: 'username' }, { label: 'Email', name: 'email' }, { label: 'Aadhar Number', name: 'aadhar_number' }]
            .map(({ label, name }) => (
              <div key={name}>
                <label className="block text-gray-600 text-sm">{label}</label>
                {name === 'aadhar_number' && userData.aadhar_number === null && (
                  <div>
                    <label className="block text-xs font-bold !text-yellow-600 mb-2">
                    Link Aadhar to upload documents!
                    </label>
                  </div>
                )}
                <input
                  type={name === 'email' ? 'email' : 'text'}
                  name={name}
                  value={userData[name] || ''}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  disabled={name==='aadhar_number' && isAadharLinked}
                  className={`w-full p-2 rounded text-sm focus:outline-none focus:ring-2 ${
                    isEditing
                      ? '!border border-gray-400'
                      : 'bg-transparent !border-gray-600 opacity-40'
                  } ${name == 'aadhar_number' && isAadharLinked ? 'cursor-not-allowed opacity-60' : ''}`}
                />
                {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
              </div>
            ))}

          <hr className="w-full border-t-2 border-gray-800" />

          <div className="flex justify-between !space-x-4">
            <button
              className="px-4 py-2 text-red-600 border border-red-600 text-sm transition-bg duration-200 rounded hover:bg-red-100 w-full"
              onClick={() => {
                setShowDeleteModal(true);
                setIsEditing(false);
              }}
            >
              Deactivate Account
            </button>
            <button
              className="cancel-btn px-4 py-2 bg-white-600 text-gray-800 border transition-bg duration-200 hover:!bg-gray-400 text-sm rounded w-full"
              onClick={()=>{
                setIsEditing(false)
                fetchUserData()
                setErrors({})
              }}
            >
              Cancel
            </button>
          </div>

          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm rounded w-full"
            onClick={handleSave}
            disabled={!isEditing}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

    {/* OTP Modal */}
    {otpVerificationModal && (
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="email_update_otp_modal p-6 rounded-md shadow-lg w-full max-w-md bg-white">
          <h3 className="text-2xl font-bold">Enter OTP</h3>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="border border-gray-300 rounded-md p-2 text-gray-800 w-full mt-4"
          />
          <button
            className="w-full mt-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md"
            onClick={handleOtpSubmit}
          >
            Verify OTP
          </button>
        </div>
      </div>
    )}
    {showDeleteModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="delete-account-modal bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="heading text-lg font-semibold mb-4 text-black">
            Confirm Deletion
          </h2>
          <p className="text text-sm text-black mb-2">
            Please enter your password to confirm account deletion:
          </p>
          <input
            type="password"
            className="confirmpassinput w-full border p-2 rounded mb-4 text-sm text-black"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end !space-x-2">
            <button
              className="delete-account-cancel px-2 py-1 text-sm rounded bg-gray-200 hover:!bg-gray-400 text-gray-800"
              onClick={()=>{
                setShowDeleteModal(false);
                setPassword('');
              }}
            >
              Cancel
            </button>
            <button
              disabled={!password}
              className="p-2 text-red-600 border border-red-600 text-sm transition-bg duration-200 rounded hover:bg-red-100"
              onClick={() => {
                handleDeleteClick(password);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default ProfileModal;
