import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import docuvaultimage from '../../assets/images/docuvaultimage.jpg';
import logoimage from '../../assets/images/logowithtext.png';
import OTPModal from './components/otpmodal';
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {setIsModalOpen(true)};
  const closeModal = () => {setIsModalOpen(false)};
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const toggleAuthMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));  // Clear error on input change
  };

  const clearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    setErrors(prev => ({ ...prev, [field]: '' })); // Clear error when clearing field
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    if (!isLogin && !formData.fullName) newErrors.fullName = 'Full name is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      openModal();
      console.log('Form submitted');
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, rgb(222, 220, 210), rgb(140, 138, 135))'
      }}
    >
      {/* Card with form + image */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl md:h-[85vh] shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md">
        {/* Left: Form */}
        <div className={`w-full md:w-1/2 max-h-[85vh] overflow-y-auto px-8 pt-4 ${isLogin ? 'flex flex-col justify-center':''}`}>
          {/* Form Header */}
          <div className="flex items-center justify-evenly mb-4">
            <img src={logoimage} alt="DocuVault" className="h-20 w-auto bg-gray-100 rounded-lg p-2 shadow-md" />
            <div className='ml-6'>
              <h4 className="text-xl font-semibold text-left text-gray-800">
                {isLogin ? 'Log into Docuvault' : 'Create new account in Docuvault'}
              </h4>
              <div className="border-t-2 border-gray-500 my-4 shadow-lg mx-auto w-full opacity-75"></div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                  placeholder="John Doe"
                />
                {formData.fullName && (
                  <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('fullName')} />
                )}
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                  placeholder="you@example.com"
                />
                {formData.email && (
                  <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('email')} />
                )}
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                placeholder="Enter your username"
              />
              {formData.username && (
                <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('username')} />
              )}
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                placeholder="Enter your password"
              />
              {formData.password && (
                <>
                  <span className="absolute right-8 top-8 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                  <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('password')} />
                </>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                  placeholder="Re-enter your password"
                />
                {formData.confirmPassword && (
                  <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('confirmPassword')} />
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
              disabled={Object.keys(errors).some((key) => errors[key])}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Switch Link */}
          <p className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={toggleAuthMode}
              className="text-blue-500 hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* Right: Image */}
        <div
          className="w-full md:w-1/2 bg-cover bg-center md:block"
          style={{ backgroundImage: `url(${docuvaultimage})` }}
        />
      </div>
      <OTPModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Auth;
