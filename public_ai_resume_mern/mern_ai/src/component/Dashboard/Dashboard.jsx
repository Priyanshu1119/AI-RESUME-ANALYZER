import styles from './Dashboard.module.css'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState } from 'react';
import axios from '../../utils/axios';
import { useContext } from 'react';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
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

    return (
        <div className={styles.Dashboard}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader}>
                    <h2>AI Resume Analyzer</h2>
                </div>

                <div className={styles.alertInfo}>
                    {!resumeFile && <p>Please upload your resume to get started.</p>}
                </div>

                <div className={styles.DashboardUploadResume}>
                    <label htmlFor="resumeUpload" className={styles.uploadLabel}>
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

                <div className={styles.jobDesc}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={styles.textArea}
                        placeholder='Paste Your Job Description'
                        rows={10}
                        cols={50}
                    />
                    <div className={styles.AnalyzeBtn} onClick={handleUpload}>
                        {loading ? "Analyzing..." : "Analyze"}
                    </div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div className={styles.DashboardRightTopCard}>
                    <div>Analyze With AI</div>
                    <img
                        className={styles.profileImg}
                        src={userInfo?.photo || avatarUrl}
                        alt="profile"
                        onError={(e) => { e.target.src = avatarUrl }}
                    />
                    <h2>{userInfo?.name}</h2>
                </div>

                {result && (
                    <div className={styles.DashboardRightTopCard}>
                        <div>Result</div>

                        {/* Score Label */}
                        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '6px' }}>
                            {getScoreLabel(result?.score)}
                        </p>

                        {/* Score Number */}
                        <p style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', color: getScoreColor(result?.score), margin: '4px 0' }}>
                            {result?.score}/100
                        </p>

                        {/* Progress Bar */}
                        <div style={{
                            width: '100%',
                            backgroundColor: '#e5e7eb',
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

                        {/* Feedback */}
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
                            <strong>Feedback:</strong> {result?.feedback?.replace(/\*\*/g, '')}
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