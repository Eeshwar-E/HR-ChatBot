const path = require("path");
const extractText = require("../utils/extractPdf");
const { evaluateCandidate } = require("./llmController");
const pool = require("../utils/db");

const handleUpload = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const filePath = path.join(__dirname, "..", req.file.path);

    // Extract resume text
    const resumeText = await extractText(filePath);

    // Send to LLM for evaluation
    const evaluation = await evaluateCandidate(resumeText, role);

    // Insert into DB
    await pool.query(
      "INSERT INTO candidates (name, email, resume_text, applied_role, evaluation) VALUES ($1, $2, $3, $4, $5)",
      [name, email, resumeText, role, evaluation]
    );

    res.json({ message: "Resume uploaded & evaluated ✅", evaluation: evaluation});
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process resume" });
  }
};

module.exports = { handleUpload };
