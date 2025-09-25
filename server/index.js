const express = require("express");
const cors = require("cors");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoutes);
app.use("/chat", chatRoutes);

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
