import React from 'react'
import styles from './SideBar.module.css';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const SideBar = ({ darkMode, setDarkMode }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { setLogin, setUserInfo } = useContext(AuthContext);

    const handleLogout = () => {
        setLogin(false);
        setUserInfo(null);
        localStorage.removeItem("isLogin");
        navigate('/');
    }

    return (
        <div className={styles.sideBar} style={{
            background: darkMode ? '#1e293b' : '',
            transition: 'all 0.3s ease'
        }}>
            <div className={styles.sideBarIcon}>
                <ArticleIcon sx={{ fontSize: 54, marginBottom: 2 }} />
                <div className={styles.sideBarTopContent}>Resume Screening</div>
            </div>

            <div className={styles.sideBarOptionsBlock}>

                <Link to={'/dashboard'} className={[styles.sideBarOption, location.pathname === '/dashboard' ? styles.selectedOption : null].join(' ')}>
                    <DashboardIcon sx={{ fontSize: 22 }} />
                    <div>Dashboard</div>
                </Link>

                <Link to={'/history'} className={[styles.sideBarOption, location.pathname === '/history' ? styles.selectedOption : null].join(' ')}>
                    <ManageSearchIcon sx={{ fontSize: 22 }} />
                    <div>History</div>
                </Link>

                <Link to={'/admin'} className={[styles.sideBarOption, location.pathname === '/admin' ? styles.selectedOption : null].join(' ')}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 22 }} />
                    <div>Admin</div>
                </Link>

                <div onClick={() => setDarkMode(!darkMode)} className={styles.sideBarOption} style={{ cursor: 'pointer' }}>
                    {darkMode
                        ? <LightModeIcon sx={{ fontSize: 22 }} />
                        : <DarkModeIcon sx={{ fontSize: 22 }} />
                    }
                    <div>{darkMode ? 'Light Mode' : 'Dark Mode'}</div>
                </div>

                <div onClick={handleLogout} className={styles.sideBarOption}>
                    <LogoutIcon sx={{ fontSize: 22 }} />
                    <div>LogOut</div>
                </div>

            </div>
        </div>
    )
}

export default SideBar