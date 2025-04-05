import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UploadResume = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Only PDF, DOC, and DOCX files are allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload Your Resume</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        {error && <p>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadResume;
