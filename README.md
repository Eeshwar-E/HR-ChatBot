## CHATBOT Project

This project is an AI-powered **Resume Evaluator** system. It allows users to upload resumes and receive automated evaluations using the Gemini API. The system is built with a Node.js/Express backend, PostgreSQL database, and a React frontend.

### Main Functionalities

#### 1. Resume Upload & Evaluation

- Users can upload their resume (PDF format) via a web form.
- The backend extracts text from the PDF and sends it to Gemini API for evaluation.
- The Gemini model returns a structured evaluation (strengths, weaknesses, score, comments) for the candidate and job role.
- The evaluation, resume text, and candidate details are stored in a PostgreSQL database.

#### 2. Frontend Features

- Modern React UI for uploading resumes and viewing evaluation results.
- Progress bar and loading indicators during evaluation.
- Two client implementations: one with classic React, one with Vite + Tailwind CSS.

#### 4. Backend Features

- Express.js REST API for upload and evaluation endpoints.
- PDF text extraction using `pdf-parse`.
- Gemini API integration for resume analysis.
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
3. Use the **Login/Signup** page to create an account, or recover access if you forget your credentials.
   - If you forget your password, switch to the **Forgot** tab and submit your email. A reset token will be displayed and can be used on the **Reset** tab to choose a new password.
4. Upload a resume and view the AI evaluation results.

---

For more details, see the code in the `server/` and `client/` directories.
