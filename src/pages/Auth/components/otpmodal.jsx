import { React, useState } from 'react';

const OTPModal = ({isOpen, onClose}) => {
    const[otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setOtp(e.target.value);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('OTP must be 6 digits long');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 2000);
    }

    return(
        <>
        {isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">Enter OTP</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your 6-digit OTP"
                    maxLength="6"
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>
  
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </>
    )
}
export default OTPModal;