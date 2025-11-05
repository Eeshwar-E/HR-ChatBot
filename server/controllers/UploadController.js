const path = require("path");
const extractText = require("../utils/extractPdf");
const { evaluateCandidate } = require("./llmController");
const Evaluation = require('../models/Evaluation');

const handleUpload = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const filePath = path.join(__dirname, "..", req.file.path);

    // Extract resume text
    const resumeText = await extractText(filePath);

    // Send to LLM for evaluation
    const evalText = await evaluateCandidate(resumeText, role);

    // Parse the evaluation response
    const evalLines = evalText.split('\n');
    const strengths = [];
    const weaknesses = [];
    let score = 0;
    let comments = '';

    evalLines.forEach(line => {
      if (line.startsWith('- Strengths:')) {
        // Collect next 5 lines as strengths
        for (let i = 1; i <= 5 && i < evalLines.length; i++) {
          if (evalLines[i].trim().startsWith('-')) {
            strengths.push(evalLines[i].trim().substring(2));
          }
        }
      } else if (line.startsWith('- Weaknesses:')) {
        // Collect next 5 lines as weaknesses
        for (let i = 1; i <= 5 && i < evalLines.length; i++) {
          if (evalLines[i].trim().startsWith('-')) {
            weaknesses.push(evalLines[i].trim().substring(2));
          }
        }
      } else if (line.startsWith('- Score:')) {
        score = parseFloat(line.split(':')[1]) || 0;
      } else if (line.startsWith('- Comments:')) {
        comments = line.split(':')[1].trim();
      }
    });

    // Create evaluation document
    const evaluation = await Evaluation.create({
      user: req.user._id,
      resumeText,
      appliedRole: role,
      candidateName: name,
      candidateEmail: email,
      strengths,
      weaknesses,
      score,
      comments,
    });

    res.json({ 
      message: "Resume uploaded & evaluated ✅", 
      evaluation: {
        id: evaluation._id,
        strengths,
        weaknesses,
        score,
        comments
      }
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

module.exports = { handleUpload };
