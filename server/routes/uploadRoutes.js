const express = require("express");
const router = express.Router();
const multer = require("multer");
const { handleUpload } = require("../controllers/UploadController");

const storage = multer.diskStorage({
  destination: "server/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("resume"), handleUpload);

module.exports = router;

