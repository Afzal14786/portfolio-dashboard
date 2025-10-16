import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Login/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import OtpVerification from './components/OtpVerification';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/verify-otp-page' element={<OtpVerification/>}/>
          <Route path='/forgot-password' element={<ResetPassword/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
