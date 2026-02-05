import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [resume, setResume] = useState(null);
  const [uploaded, setUploaded] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  // ✅ Upload Function
  const handleUpload = async () => {

    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", resume);

    try {

      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // ⭐ Store recommendations
      setRecommendations(data);
      localStorage.setItem("recommendations", JSON.stringify(data));

      localStorage.setItem("resumeName", resume.name);
      setUploaded(resume.name);

      alert("AI Recommendation Ready ✅");

    } catch (error) {
      console.error("Upload Error:", error);
      alert("Backend not connected!");
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white">

      {/* ✅ SIDEBAR */}
      <div className="w-64 bg-[#0f172a] p-6 border-r border-white/10">

        <h1 className="text-2xl font-bold mb-10">
          Internship Intelligence System
        </h1>

        <ul className="space-y-4 text-gray-300">

          <Link to="/dashboard">
            <li className="hover:text-white cursor-pointer">
              Dashboard
            </li>
          </Link>

          <Link to="/recommendations">
            <li className="hover:text-white cursor-pointer">
              AI Recommendations
            </li>
          </Link>

          <Link to="/profile">
            <li className="hover:text-white cursor-pointer">
              Profile
            </li>
          </Link>

        </ul>

      </div>

      {/* ✅ MAIN */}
      <div className="flex-1 p-10 overflow-auto">

        <h2 className="text-4xl font-bold mb-2">
          AI Internship Dashboard 👋
        </h2>

        <p className="text-gray-400 mb-8">
          Your AI Internship Assistant is ready.
        </p>

        {/* ✅ Upload Card */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 w-[420px] mb-10">

          <h3 className="text-xl font-semibold mb-2">
            Upload Your Resume
          </h3>

          <p className="text-gray-400 text-sm mb-4">
            Let AI analyze your skills and recommend the best internships.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
            className="mb-4 block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-indigo-500 file:text-white
            hover:file:bg-indigo-600"
          />

          <button
            onClick={handleUpload}
            className="px-6 py-2 rounded-lg font-semibold 
            bg-gradient-to-r from-indigo-500 to-cyan-500 
            hover:scale-105 transition"
          >
            Upload Resume
          </button>

          {uploaded && (
            <p className="text-green-400 mt-3">
              Uploaded: {uploaded}
            </p>
          )}

        </div>

        {/* ✅ AI RESULTS */}
        {recommendations.length > 0 && (

          <div>

            <h3 className="text-2xl font-bold mb-4">
              🔥 Top AI Internship Recommendations
            </h3>

            <div className="grid gap-6">

              {recommendations.map((job, index) => (

                <div
                  key={index}
                  className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-indigo-500 transition"
                >

                  <h4 className="text-xl font-semibold text-indigo-400">
                    {job["job title"]}
                  </h4>

                  <p className="text-gray-300">
                    {job["company name"]}
                  </p>

                  <div className="flex gap-6 mt-2 text-sm text-gray-400">
                    <span>📍 {job.cities}</span>
                    <span>💰 {job.stipend}</span>
                    <span>⏳ {job.duration}</span>
                  </div>

                  <div className="mt-3 text-green-400 font-semibold">
                    Match Score: {job["Match Score (%)"]}%
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>
    </div>
  );
}
