import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import docuvaultimage from '../../assets/images/docuvaultimage.jpg';
import logoimage from '../../assets/images/logowithtext.png';
import OTPModal from './components/otpmodal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => { setIsModalOpen(false) };
  const [isLoading, setIsLoading] = useState(false);
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
  const API_URL = import.meta.env.VITE_API_URL;

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };
  

  const clearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateField = (name, value) => {
    let error = '';
  
    if (isLogin) {
      if (name === 'username' && !value) error = 'Username is required';
      if (name === 'password' && !value) error = 'Password is required';
    } else {
      if (name === 'fullName' && !value) error = 'Full Name is required';
      if (name === 'email' && !value) error = 'Email is required';
      if (name === 'username' && !value) error = 'Username is required';
      if (name === 'password') {
        if (!value) {
          error = 'Password is required';
        } else {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
          if (!passwordRegex.test(value)) {
            error = 'Password must have at least one uppercase letter, one special character, and one digit';
          }
        }
      }
      if (name === 'confirmPassword') {
        if (value !== formData.password) error = 'Passwords do not match';
      }
    }
  
    return error;
  };  

  const validate = () => {
    const newErrors = {};
  
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
  
    return newErrors;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        if (isLogin) {
          const response = await axios.post(`${API_URL}/users/login/`, {
            username: formData.username,
            password: formData.password,
          }, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          });
          if (response.data.success) {
            toast.success('Login successful! 🎉');
            const token = response.data.access_token;
            setIsLoading(false);
            setFormData(prev => ({ ...prev, fullName: '', email: '', username: '', password: '', confirmPassword: '' }));
            navigate('/dashboard');
          } else {
            toast.error(`Error: ${response.data.message || 'An error occurred. Please try again.'}`);
            setIsLoading(false);
          }
        } else {
          const response = await axios.post(`${API_URL}/users/send_otp/`, {
            full_name: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            aadhar_number: null,
            profile_picture: null,
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });          
          if(response.data.success) {
            toast.info(`Second Step: ${response.data.message}`);
            openModal(); 
            setIsLoading(false);
          }
          else{
            toast.error(`Error: ${response.data.message || 'An error occurred. Please try again.'}`);
            setIsLoading(false);
          }
        }
      } catch (error) {
        toast.error(`Invalid credentials. Please try again. ❌`);
      }
      finally{
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="auth h-screen w-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, rgb(222, 220, 210), rgb(140, 138, 135))'
      }}
    >
      {/* Card with form + image */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl md:h-[85vh] shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md">
        {/* Left: Form */}
        <div className={`w-full md:w-1/2 max-h-[85vh] overflow-y-auto px-8 pt-4 ${isLogin ? 'flex flex-col justify-center':'mb-4'}`}>
          {/* Form Header */}
          <div className="flex items-center justify-evenly mb-4 !text-black">
            <img src={logoimage} alt="DocuVault" className="h-20 w-auto bg-gray-100 rounded-lg p-2 shadow-md" />
            <div className='ml-6'>
              <h4 className="text-xl font-semibold text-left text-gray-800">
                {isLogin ? 'Log into Docuvault' : 'Create new account in Docuvault'}
              </h4>
              <div className="border-t-2 border-gray-500 my-4 shadow-lg mx-auto w-full opacity-75"></div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-5 mt-6 !text-black">
            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium !text-gray-700">Full Name</label>
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
                <label className="block text-sm font-medium !text-gray-700">Email</label>
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
              <label className="block text-sm font-medium !text-gray-700">Username</label>
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
              <label className="block text-sm font-medium !text-gray-700">Password</label>
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
                <label className="block text-sm font-medium !text-gray-700">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 p-1 border-b border-gray-400 w-full focus:outline-none bg-transparent"
                  placeholder="Re-enter your password"
                />
                {formData.confirmPassword && (
                  <>
                    <span className="absolute right-8 top-8 text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(!showPassword)}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                    <X className="absolute right-2 top-8 w-4 h-4 cursor-pointer text-gray-500" onClick={() => clearField('confirmPassword')} />
                  </>
                )}
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              disabled={isLoading || Object.keys(errors).some((key) => errors[key])}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
                </svg>
              ) : isLogin ? (
                'Log In'
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              {isLogin ? 'Don\'t have an account? ' : 'Already have an account? '}
              <button
                onClick={toggleAuthMode}
                className="ml-1 text-blue-500 font-semibold hover:text-blue-600 transition duration-200"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${docuvaultimage})` }} />
      </div>

      {isModalOpen && (
      <OTPModal isOpen={isModalOpen} onClose={closeModal} setIsLogin={setIsLogin} email={formData.email} />
    )}
    </div>
  );
};

export default Auth;
