import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/Auth/index.jsx';
import Dashboard from './pages/Dashboard/index.jsx';
import Header from './components/Header/index.jsx';
import { ToastContainer } from 'react-toastify';
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
  return(
    <>
      {location.pathname !== '/' && <Header /> }
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App;
