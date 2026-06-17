const ResumeModel = require('../Models/resume');
const UserModel = require('../Models/user');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
    token: "BF1z1xtvLp4zT4uKbX6O0LSxZoICeN19HPiksixG",
});

exports.addResume = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { jobDesc, email } = req.body;

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        if (!jobDesc) return res.status(400).json({ message: "Job description is required" });
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Find user
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Parse PDF
        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(pdfBuffer);

        const prompt = `
            You are a resume screening assistant.
            Compare the following resume text with the provided Job Description and give a match score (0-100) and feedback.

            Resume:
            ${pdfData.text}

            Job Description:
            ${jobDesc}

            Return in this format:
            Score: XX
            Reason: ...
        `;

        const response = await cohere.chat({
            model: "command-a-03-2025",
            message: prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const result = response.text;

        const scoreMatch = result.match(/Score:\s*(\d+)/);
        const reasonMatch = result.match(/Reason:\s*([\s\S]*)/);

        const score = scoreMatch ? scoreMatch[1] : "0";
        const feedback = reasonMatch ? reasonMatch[1].trim() : result;

        const newResume = new ResumeModel({
            user: user._id,
            resume_name: req.file.originalname,
            job_desc: jobDesc,
            score,
            feedback,
        });

        await newResume.save();
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: "Analysis ready", score, feedback });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;
        const userDoc = await UserModel.findOne({ email: user });
        if (!userDoc) return res.status(404).json({ message: "User not found" });
        const resumes = await ResumeModel.find({ user: userDoc._id });
        res.status(200).json({ data: resumes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getResumeForAdmin = async (req, res) => {
    try {
        const resumes = await ResumeModel.find({}).populate('user', 'name email');
        res.status(200).json({ data: resumes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}