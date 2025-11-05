## CHATBOT Project

This project is an AI-powered Resume Evaluator and HR Chatbot system. It allows users to upload resumes, receive automated evaluations, and chat with an AI assistant for further HR-related queries. The system is built with a Node.js/Express backend, PostgreSQL database, and a React frontend (with two client variants).

### Main Functionalities

#### 1. Resume Upload & Evaluation

- Users can upload their resume (PDF format) via a web form.
- The backend extracts text from the PDF and sends it to a local LLM (phi3) for evaluation.
- The LLM returns a structured evaluation (strengths, weaknesses, score, comments) for the candidate and job role.
- The evaluation, resume text, and candidate details are stored in a PostgreSQL database.

#### 2. AI HR Chatbot

- After evaluation, users can chat with an AI HR assistant.
- The chatbot uses the resume evaluation and full chat history to provide context-aware responses.
- Multi-turn conversations are supported, with the LLM generating helpful, HR-focused replies.

#### 3. Frontend Features

- Modern React UI for uploading resumes and chatting with the bot.
- Progress bar and loading indicators during evaluation.
- Two client implementations: one with classic React, one with Vite + Tailwind CSS.

#### 4. Backend Features

- Express.js REST API for upload and chat endpoints.
- PDF text extraction using `pdf-parse`.
- LLM integration via HTTP API (phi3 and OpenAI).
- Database integration with PostgreSQL for storing candidate data.

#### 5. File Upload Handling

- Uses Multer for secure file uploads to the server.
- Uploaded files are stored in `server/uploads/`.

#### 6. Environment & Configuration

- Environment variables for database credentials (see `.env`).
- Easy local development with `npm start` (client) and `node server/index.js` (backend).

### How to Use

1. Start the backend server (`node server/index.js`).
2. Start the frontend client (`npm start` in `client/` or `my-client/`).
3. Upload a resume and interact with the AI HR assistant.

---

For more details, see the code in the `server/` and `client/` directories.
