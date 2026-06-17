import axios from "axios";

const instance = axios.create({
    baseURL: "https://ai-resume-analyzer-hyjc.onrender.com",
});

export default instance;