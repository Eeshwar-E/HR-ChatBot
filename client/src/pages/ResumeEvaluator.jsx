import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import ModelSelector from "../components/ModelSelector";

const ResumeEvaluator = ({ token }) => {
  const [model, setModel] = useState("phi3");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null); // store actual file for preview
  const [pdfPopupOpen, setPdfPopupOpen] = useState(false);

  // Custom wrapper: get file for preview from UploadForm
  const handleFormResponse = (data, fileObj) => {
    setResponse(data);
    setResumeFile(fileObj || null);
  };

  // Get PDF preview URL if available
  const pdfUrl = resumeFile ? URL.createObjectURL(resumeFile) : null;
  const isEvaluated = !!response;

  return (
    <main style={{
      maxWidth: 1300,
      margin: "0 auto",
      padding: "32px 14px 0 14px",
      display: isEvaluated ? "flex" : "flex",
      flexDirection: isEvaluated ? "row" : "column",
      alignItems: isEvaluated ? "flex-start" : "center",
      justifyContent: isEvaluated ? "flex-start" : "center",
      gap: isEvaluated ? "38px" : 0
    }}>
      <div style={{
        flex: "1 1 0",
        minWidth: isEvaluated ? "48%" : 0,
        maxWidth: isEvaluated ? "48%" : 600,
        width: isEvaluated ? "48%" : "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: isEvaluated ? "flex-start" : "center"
      }}>
        <h2 style={{
          fontSize: 34,
          margin: "14px 0 10px 0",
          fontWeight: 700,
          letterSpacing: "0.03em",
          color: "#255476",
          textAlign: isEvaluated ? "left" : "center"
        }}>
          Resume Evaluator
        </h2>
        <ModelSelector model={model} setModel={setModel} />
        {/* Pass setResumeFile to UploadForm to get local PDF */}
        <UploadForm
          onResponse={(data, fileObj) => handleFormResponse(data, fileObj)}
          setLoading={setLoading}
          model={model}
          token={token}
        />
        
        {loading && (
          <div style={{ marginTop: 20, textAlign: "center", width: "100%" }}>Loading...</div>
        )}
        {response && (
          <div style={{
            border: "1px solid #bbb", borderRadius: "10px", padding: "22px",
            background: "#f8fbff", marginTop: 24, maxWidth: 700,
            boxShadow: "0 2px 12px 0 #0001"
          }}>
            <h3 style={{ marginTop: 0 }}>Evaluation Result:</h3>
            {typeof response === "object" && "evaluation" in response ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <strong>Score:</strong> {response.evaluation.score}/10
                </div>
                <div style={{ marginBottom: 14 }}>
                  <strong>Strengths:</strong>
                  <ul>
                    {(response.evaluation.strengths || []).map((x, i) => <li key={"s"+i}>{x}</li>)}
                  </ul>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <strong>Weaknesses:</strong>
                  <ul>
                    {(response.evaluation.weaknesses || []).map((x, i) => <li key={"w"+i}>{x}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>Comments:</strong><br />
                  <span>{response.evaluation.comments}</span>
                </div>
              </>
            ) : (
              <div style={{ color: "red" }}>
                {typeof response === "string" ? response : "Failed to process resume."}
              </div>
            )}
          </div>
        )}
      </div>
      {isEvaluated && pdfUrl && (
        <div style={{
          flex: "1 1 0",
          maxWidth: "52%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: 8
        }}>
          <div style={{
            width: "96%",
            maxWidth: 480,
            cursor: "pointer",
            border: "2px solid #aac6f5",
            borderRadius: "13px",
            overflow: "hidden",
            background: "#f3f8ff"
          }}
            onClick={() => setPdfPopupOpen(true)}
          >
            <iframe
              title="Resume PDF"
              src={pdfUrl}
              style={{
                width: "100%",
                height: "680px",
                border: "none",
                borderRadius: "10px"
              }}
            />
          </div>
        </div>
      )}
      {pdfPopupOpen && pdfUrl && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(36,58,90,0.34)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}
          onClick={() => setPdfPopupOpen(false)}
        >
          <div style={{
            background: "#fff",
            borderRadius: "22px",
            boxShadow: "0 5px 45px #223c9855",
            padding: "20px",
            maxWidth: "92vw",
            maxHeight: "93vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <iframe
              title="Resume PDF Full"
              src={pdfUrl}
              style={{
                width: "80vw",
                height: "80vh",
                border: "none",
                borderRadius: "14px",
                background: "#fafcff"
              }}
            />
            <button
              onClick={e => { e.stopPropagation(); setPdfPopupOpen(false); }}
              style={{
                marginTop: 14,
                background: "#637cff",
                padding: "9px 18px",
                color: "#fff",
                borderRadius: 10,
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px #bcdcff44"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ResumeEvaluator;
