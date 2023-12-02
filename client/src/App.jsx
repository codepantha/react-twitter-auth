import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import OtpPage from './OtpPage';
import './globals.css';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
