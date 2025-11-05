const express = require("express");
const router = express.Router();
const multer = require("multer");
const { handleUpload } = require("../controllers/UploadController");
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: "server/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Protected upload endpoint - requires authentication
router.post("/", auth, upload.single("resume"), handleUpload);

module.exports = router;

