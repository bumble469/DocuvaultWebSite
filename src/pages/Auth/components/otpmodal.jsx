import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OTPModal = ({ isOpen, onClose, setIsLogin, email }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };;

  const handleOTPVerify = async (otpValue) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/users/verify_otp/', {
        email: email,
        otp: otpValue,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('OTP verified successfully! 🎉');
        setIsLogin(true);
        onClose();
        setOtp('');
      } else {
        toast.error('OTP verification failed. Please try again. ❌', response.data);
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again. ❌');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOTPVerify(otp); 
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50"
        style={{
          backdropFilter: 'blur(1px)', // This applies the blur effect to the background
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark overlay
        }}>
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h3 className="!text-black text-xl font-semibold mb-4 text-center">Enter OTP</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium !text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleChange}
                  className="!text-black mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your 6-digit OTP"
                  maxLength="6"
                  autoFocus
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={()=>{
                    setOtp('');
                    onClose();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  disabled={isLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OTPModal;
