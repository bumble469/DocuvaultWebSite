import React, { useContext, useState, useEffect } from 'react';
import logo from '../../assets/images/logo1.png';
import { FaUpload, FaSearch, FaHistory, FaQuestionCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import sunicon from '../../assets/images/sunicon.png';
import moonicon from '../../assets/images/moonicon.png';
import aidoclight from '../../assets/images/ai-doc-light.png';
import aidocdark from '../../assets/images/ai-doc-dark.png';
import { useMediaQuery } from 'react-responsive';
import ThemeContext from '../../context/ThemeContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './components/profilemodal.jsx';
import UploadDocumentModal from './components/uploadmodal.jsx';
import ActivityHistoryModal from './components/activityhistorymodal.jsx';
import HelpandSupportModal from './components/helpandsupportmodal.jsx';

const Header = ({ setSearchQuery, showProfileModal, setShowProfileModal, showUploadModal, setShowUploadModal }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userImage, setUserImage] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const [uploadButton, setUploadButton] = useState(false);
  const [uploadButtonTooltip, setUploadButtonTooltip] = useState("");
  const [isOpenActivityHistoryModal, setIsOpenActivityHistoryModal] = useState(false);
  const [openHelpandSupportModal, setIsOpenHelpAndSupportModal] = useState(false)
  const [aiButton, setAIButton] = useState(false);
  const [aiButtonTooltip, setAIButtonTooltip] = useState("");

  useEffect(() => {
    const checkAadharLink = async () => {
      try {
        const response = await axios.post(`${API_URL}/check-user-adhar-link/`, {}, { withCredentials: true });
        if (response.data.aadhar_present === true) {
          setUploadButton(true);
          setAIButton(true)
        } else {
          setUploadButton(false);
          setAIButton(false)
          setUploadButtonTooltip("Please link aadhar to upload documents");
          setAIButtonTooltip("Please link aadhar to access AI features")
        }
      } catch (error) {
        toast.error("Some error occurred");
        console.error("Check Aadhar Link Error:", error);
      }
    };
    checkAadharLink();
  }, [showProfileModal]);
  
  const navigate = useNavigate();
  const toggleDarkMode = () => {
    toggleTheme();
  };

  useEffect(()=>{
    const fetchUserImage = async () => {
      try {
        const response = await axios.post(`${API_URL}/users/details/`, {}, { withCredentials: true });
        if (response.data.success === true) {
          setUserImage(response.data.user.profile_picture)
        } else {
          console.log("Failed with status:", response.data.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserImage()
  },[showProfileModal])

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/logout/`, {}, { withCredentials: true });
      if (response.data.success) {
        navigate('/');
        toast.success('Logout successful! Redirecting to login page...');
      } else {
        toast.error(`Logout failed: ${response.data.message}. Please try again.`);
      }
    } catch (error) {
      toast.error(`Logout failed. Please try again.`);
    }
  };

  return (
    <header className={`w-full p-2 ${theme === 'dark' ? 'bg-transparent text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <div className="flex items-center px-2 justify-between w-full">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-8 md:h-10 w-auto transition-transform duration-300 hover:scale-105 hover:brightness-80 cursor-pointer"
          />
          <div className={`h-10 border-l-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
          <div className="mt-2">
            <h4 className={`!text-sm md:!text-lg lg:!text-xl !font-extrabold leading-tight m-0 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>DOCUVAULT</h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>your personal document wallet</p>
          </div>
        </div>
        <div className={`${isMobile ? 'hidden' : 'flex flex-1 justify-center'}`}>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`text-sm px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white !text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-56 rounded-full w-full`}
            />
            <button className={`!rounded-full absolute right-2 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xl p-2`}>
              <FaSearch className='hover:scale-110 transition-transform'/>
            </button>
          </div>
        </div>

        {/* Right-aligned Links and Icons */}
        <div className="flex items-center space-x-1 ml-auto">
          <span title={uploadButtonTooltip}>
            <button
              disabled={!uploadButton}
              onClick={() => setShowUploadModal(true)}
              className={`!rounded-lg !text-xs md:!text-sm lg:!text-md flex items-center space-x-2 
                ${theme === 'dark' 
                  ? 'text-gray-100 bg-gray-800' 
                  : 'text-gray-800 bg-gray-100'} 
                !no-underline px-3 py-3 
                ${!uploadButton 
                  ? 'opacity-60' 
                  : 'hover:scale-103 transition-transform duration-200 hover:bg-gray-300 dark:hover:bg-gray-300'} 
                ${isMobile ? 'hidden' : 'block'}
              `}
            >
              <FaUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-xl`} />
              <span>Upload</span>
            </button>
          </span>

          {/* AI Icon */}
          <button
            disabled={!aiButton}
            title={!aiButton ? aiButtonTooltip : 'Explore power of ai'}
            onClick={()=>navigate('/ai-document-generation')} className={`relative !text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-yellow-600 hover:bg-blue-100'} transition-bg duration-200 p-2.5 m-1`}>
            {theme === 'dark' ? <img src={aidocdark} height={25} width={25} /> : <img src={aidoclight} height={25} width={25} />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`!text-sm md:!text-xl ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-gray-600 hover:bg-blue-100'} transition-bg duration-200 rounded-full p-2.5 m-1`}
          >
            {theme === 'dark' ? <img src={sunicon} height={25} width={25} /> : <img src={moonicon} height={25} width={25} />}
          </button>

          {/* Profile Icon */}
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className={`flex items-center justify-center rounded-full overflow-hidden p-1 m-1  ${theme === 'dark' ? 'text-yellow-400 hover:bg-blue-800' : 'text-gray-600 hover:bg-blue-100'} transition-bg duration-200`}
            style={{ height: '50px', width: '50px' }}
          >
           {userImage ? (
              <img 
              src={userImage} 
              alt="Profile" 
              className="object-cover w-full h-full rounded-full"
            />
           ):(
            <FaUser className="object-cover rounded-full h-8 w-8"/>
           )}
          </button>
        </div>
        {showProfileDropdown && (
          <div className={`absolute right-4 top-16 w-56 rounded-lg shadow-xl z-50 py-3 px-2 transition-all duration-300 ease-in-out ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center w-full px-2 py-2 rounded-md hover:bg-gray-200 transition-all duration-200">
              <FaUser className="mr-3 text-lg" /> View Profile
            </button>
            <button 
            onClick={()=>setIsOpenActivityHistoryModal(true)}
            className="flex items-center w-full px-2 py-2 rounded-md hover:bg-gray-200 transition-all duration-200">
              <FaHistory className="mr-3 text-lg" /> Activity History
            </button>
            <button 
              onClick={()=>setIsOpenHelpAndSupportModal(true)}
              className="flex items-center w-full px-2 py-2 rounded-md hover:bg-gray-200 transition-all duration-200">
              <FaQuestionCircle className="mr-3 text-lg" /> Help/Support
            </button>
            <button 
              onClick={() => setShowLogoutDialog(true)}
              className="flex items-center w-full px-2 py-2 rounded-md text-red-500 hover:bg-gray-200 transition-all duration-200">
                <FaSignOutAlt className="mr-3 text-lg" /> Logout
            </button>
          </div>
        )}
      </div>

      {isMobile && (
        <div className={`mobile-header flex justify-between items-center px-2 py-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md`}>
          {/* Search Bar */}
          <div className="relative flex-1 mr-2">
            <input
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className={`text-md px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 w-full rounded-md`}
            />
            <button className={`absolute right-3 top-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} !text-xl`}>
              <FaSearch />
            </button>
          </div>

          {/* Upload Link */}
          <div title={!uploadButton ? uploadButtonTooltip : ''}>
            <button
              disabled={!uploadButton}
              onClick={() => setShowUploadModal(true)}
              className={`text-md flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-200 hover:bg-gray-300'} !no-underline hover:scale-105 transition-transform duration-200 px-3 py-2 
              ${!uploadButton ? 'cursor-not-allowed opacity-50 blur-[1px]' : ''}`}
            >
              <FaUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-xl`} />
              <span>Upload</span>
            </button>
          </div>
        </div>
      )}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
      {showUploadModal && <UploadDocumentModal onClose={() => setShowUploadModal(false)} />}
      {isOpenActivityHistoryModal && <ActivityHistoryModal onClose={()=>setIsOpenActivityHistoryModal(false)} />}
      {openHelpandSupportModal && <HelpandSupportModal onClose={()=>setIsOpenHelpAndSupportModal(false)} />}
      {showLogoutDialog && (
         <div className="fixed inset-0 flex justify-center items-center z-50"
         style={{
           backdropFilter: 'blur(1px)', 
           backgroundColor: 'rgba(0, 0, 0, 0.5)', 
         }}>
          <div className="confirm-logout-dialog p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="!text-2xl font-semibold 0 mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-end !space-x-4">
              <button 
                onClick={() => setShowLogoutDialog(false)} 
                className="px-3 py-2 bg-gray-300 text-gray-800 !rounded-md hover:bg-gray-400 transition-all duration-200">
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 bg-red-800 text-white !rounded-md hover:bg-red-600 transition-all duration-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
