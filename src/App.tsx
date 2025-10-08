import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/Login/RegisterPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/register' element={<RegisterPage/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
