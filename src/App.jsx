import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/Auth/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Header from './components/Header/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
const AppContent = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  return(
    <>
      {location.pathname !== '/' && <Header setSearchQuery={setSearchQuery} showProfileModal={showProfileModal} setShowProfileModal={setShowProfileModal} /> }
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} showProfileModal={showProfileModal} />} />
      </Routes>
    </>
  )
}

export default App;
