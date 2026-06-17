import { useState } from 'react'
import './App.css'
import SideBar from './component/SideBar/SideBar'
import {Routes, Route} from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className='App' style={{
      background: darkMode ? '#0f172a' : '#f1f5f9',
      minHeight: '100vh',
      color: darkMode ? '#f1f5f9' : '#0f172a',
      transition: 'all 0.3s ease'
    }}>
      <SideBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/dashboard' element={<Dashboard darkMode={darkMode}/>} />
        <Route path='/history' element={<History />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App