const path = require("path");
const extractText = require("../utils/extractPdf");
const { evaluateCandidate } = require("../controllers/llmController");
const Evaluation = require("../models/Evaluation");

const handleUpload = async (req, res) => {
  try {
    const { name, email, role, model } = req.body;
    const filePath = path.join(__dirname, "..", req.file.path);

    // Extract PDF text
    let resumeText = await extractText(filePath);
    if (!resumeText || resumeText.length === 0) {
      throw new Error("Resume text extraction failed.");
    }

    // Enforce Gemini input length limit for stability/speed
    let safeResumeText = resumeText;
    if (model === "gemini" && resumeText.length > 1800) {
      safeResumeText = resumeText.slice(0, 1800);
    }

    let evalResult;
    try {
      // Now returns a structured object with score, strengths, weaknesses, comments
      evalResult = await evaluateCandidate(safeResumeText, role, model);
    } catch (llmError) {
      console.error("LLM error:", llmError);
      return res.status(500).json({ error: "Resume analysis failed: " + (llmError.message || "Unknown LLM error") });
    }

    // LOG output for debugging
    console.log("LLM Evaluation Output:\n", evalResult);

    // Defensive: Ensure shape and keys
    const { strengths = [], weaknesses = [], score = 0, comments = "" } = evalResult || {};

    if (
      (!Array.isArray(strengths) || strengths.length === 0) &&
      (!Array.isArray(weaknesses) || weaknesses.length === 0) &&
      !comments &&
      !score
    ) {
      return res.status(500).json({ error: "Resume analysis failed: LLM did not return a valid result." });
    }

    const evaluation = await Evaluation.create({
      user: req.user.id,
      resumeText: safeResumeText,
      appliedRole: role,
      candidateName: name,
      candidateEmail: email,
      strengths,
      weaknesses,
      score,
      comments,
    });

    res.json({
      message: "Resume uploaded & evaluated",
      evaluation: {
        id: evaluation.id,
        strengths,
        weaknesses,
        score,
        comments,
      }
    });
  } catch (err) {
    console.error("Upload error", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

module.exports = { handleUpload };
