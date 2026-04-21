import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DocumentsProvider } from './context/DocumentContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/Auth/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Header from './components/Header/index.jsx';
import AIDocument from './pages/AiDocument/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <DocumentsProvider>
          <AppContent />
        </DocumentsProvider>
      </Router>
    </ThemeProvider>
  );
}
const AppContent = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/status`, {
          withCredentials: true  
        });

        const data = res.data;  

        if (!data.logged_in && location.pathname !== "/") {
          window.location.href = "/";
        } else if (data.logged_in && location.pathname === "/") {
          window.location.href = "/dashboard";
        }

      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (!authChecked) return null;

  return (
    <>
      {!['/', '/ai-document-generation'].includes(location.pathname) && (
        <Header
          setSearchQuery={setSearchQuery}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
        />
      )}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} showProfileModal={showProfileModal} showUploadModal={showUploadModal} />} />
        <Route path='/ai-document-generation' element={<AIDocument />} />
      </Routes>
    </>
  );
};

export default App;
