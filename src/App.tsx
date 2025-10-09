import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Login/RegisterPage';
import LoginPage from './pages/Login/LoginPage';
import OtpVerification from './components/OtpVerification';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/verify-otp-page' element={<OtpVerification/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
