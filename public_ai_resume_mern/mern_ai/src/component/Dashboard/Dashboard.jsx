import styles from './Dashboard.module.css'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState } from 'react';
import axios from '../../utils/axios';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = ({ darkMode }) => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'User')}&background=4f46e5&color=fff&rounded=true&size=128`;

    const handleOnChangeFile = (e) => {
        setResumeFile(e.target.files[0]);
        setUploadFileText(e.target.files[0].name);
    }

    const handleUpload = async () => {
        if (!resumeFile) return alert("Please upload your resume!");
        if (!jobDesc) return alert("Please paste a job description!");

        try {
            setLoading(true);
            setResult(null);

            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("jobDesc", jobDesc);
            formData.append("email", userInfo?.email);

            const res = await axios.post('/api/resume/addResume', formData);
            setResult(res.data);
        } catch (err) {
            console.log(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#f59e0b';
        if (score >= 40) return '#f97316';
        return '#ef4444';
    }

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent Match! 🎉';
        if (score >= 60) return 'Good Match 👍';
        if (score >= 40) return 'Average Match 😐';
        return 'Poor Match ❌';
    }

    const cardStyle = {
        background: darkMode ? '#1e293b' : '#ffffff',
        color: darkMode ? '#f1f5f9' : '#0f172a',
        transition: 'all 0.3s ease',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px'
    }

    return (
        <div className={styles.Dashboard} style={{
            background: darkMode ? '#0f172a' : '#f1f5f9',
            transition: 'all 0.3s ease'
        }}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader} style={cardStyle}>
                    <h2 style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>AI Resume Analyzer</h2>
                </div>

                <div className={styles.alertInfo}>
                    {!resumeFile && <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Please upload your resume to get started.</p>}
                </div>

                <div className={styles.DashboardUploadResume} style={cardStyle}>
                    <label htmlFor="resumeUpload" className={styles.uploadLabel} style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                        <CreditScoreIcon sx={{ fontSize: 22 }} />
                        {uploadFiletext}
                    </label>
                    <input
                        id="resumeUpload"
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleOnChangeFile}
                    />
                </div>

                <div className={styles.jobDesc} style={cardStyle}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={styles.textArea}
                        placeholder='Paste Your Job Description'
                        rows={10}
                        cols={50}
                        style={{
                            background: darkMode ? '#0f172a' : '#ffffff',
                            color: darkMode ? '#f1f5f9' : '#0f172a',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <div className={styles.AnalyzeBtn} onClick={handleUpload}>
                        {loading ? "Analyzing..." : "Analyze"}
                    </div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: '10px', color: darkMode ? '#94a3b8' : '#64748b' }}>Analyze With AI</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            className={styles.profileImg}
                            src={userInfo?.photo || avatarUrl}
                            alt="profile"
                            onError={(e) => { e.target.src = avatarUrl }}
                        />
                    </div>
                    <h2 style={{ textAlign: 'center', color: darkMode ? '#f1f5f9' : '#0f172a' }}>{userInfo?.name}</h2>
                </div>

                {result && (
                    <div style={cardStyle}>
                        <div style={{ textAlign: 'center', marginBottom: '10px', color: darkMode ? '#94a3b8' : '#64748b' }}>Result</div>

                        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '6px', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                            {getScoreLabel(result?.score)}
                        </p>

                        <p style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: getScoreColor(result?.score), margin: '4px 0' }}>
                            {result?.score}/100
                        </p>

                        <div style={{
                            width: '100%',
                            backgroundColor: darkMode ? '#334155' : '#e5e7eb',
                            borderRadius: '999px',
                            height: '12px',
                            margin: '10px 0 16px 0',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${result?.score}%`,
                                backgroundColor: getScoreColor(result?.score),
                                height: '100%',
                                borderRadius: '999px',
                                transition: 'width 1s ease-in-out'
                            }} />
                        </div>

                        <p style={{ fontSize: '13px', color: darkMode ? '#cbd5e1' : '#374151', lineHeight: '1.6' }}>
                            <strong>Feedback:</strong> {result?.feedback?.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '')}
                        </p>
                    </div>
                )}

                {loading && (
                    <Skeleton variant="rectangular" sx={{ borderRadius: "20px" }} width={280} height={280} />
                )}
            </div>
        </div>
    )
}

export default WithAuthHOC(Dashboard);