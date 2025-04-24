import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import docuvaultimage from '../../assets/images/docuvaultimage.jpg';
import logoimage from '../../assets/images/logowithtext.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const toggleAuthMode = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearField = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-br from-slate-100 via-blue-100 to-gray-200">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl w-[92%] max-w-md px-8 py-6 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">

          {/* Form Header */}
          <div className="flex flex items-center justify-evenly mb-4">
            <img src={logoimage} alt="DocuVault" className="h-22 w-auto bg-gray-100 rounded-lg p-2 shadow-md" />
            <div className='ml-6'>
              <h4 className="text-xl font-semibold text-left text-gray-800">
                {isLogin ? 'Log into Docuvault' : 'Create new account in Docuvault'}
              </h4>
              <div className="border-t-2 border-gray-500 my-4 shadow-lg mx-auto w-[100%] opacity-75"></div>
            </div>
          </div>

          {/* Form Fields */}
          <form className="space-y-5">
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
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
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
      </div>

      {/* Right: Image */}
      <div
        className="hidden lg:block w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${docuvaultimage})` }}
      />
    </div>
  );
};

export default Auth;
