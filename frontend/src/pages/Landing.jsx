import { useNavigate } from "react-router-dom";

export default function Landing() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#04121a] to-[#020617] text-white">

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold text-green-400">
          Internship Intelligence System
        </h1>

        <div className="space-x-4">
          <button
            onClick={()=>navigate("/login")}
            className="px-5 py-2 rounded-lg border border-green-400 hover:bg-green-400 hover:text-black transition"
          >
            Login
          </button>

          <button
            onClick={()=>navigate("/signup")}
            className="px-5 py-2 rounded-lg bg-green-400 text-black font-semibold hover:scale-105 transition"
          >
            Sign Up
          </button>
        </div>
      </div>


      {/* HERO SECTION */}

      <div className="flex flex-col md:flex-row items-center justify-between px-10 mt-16">

        {/* LEFT SIDE */}

        <div className="max-w-xl">

          <h2 className="text-5xl font-bold leading-tight mb-6">
            AI-Powered <span className="text-green-400">
            Internship Recommendation</span> Platform
          </h2>

          <p className="text-gray-400 mb-8">
            Transform the way students discover internships. 
            Our intelligent system analyzes skills, resumes, 
            and preferences to deliver highly personalized 
            internship opportunities aligned with national 
            career development goals.
          </p>

          {/* FEATURE PILLS */}

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg">
              AI Matching
            </span>

            <span className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg">
              Resume Analysis
            </span>

            <span className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg">
              Smart Recommendations
            </span>

            <span className="bg-green-400/10 text-green-400 px-4 py-2 rounded-lg">
              Skill Gap Detection
            </span>
          </div>

          {/* CTA BUTTON */}

          <button
            onClick={()=>navigate("/login")}
            className="px-8 py-4 text-lg rounded-xl font-semibold
            bg-green-400 text-black
            hover:scale-105 transition
            shadow-lg shadow-green-400/40"
          >
            Get Started →
          </button>

        </div>


        {/* RIGHT SIDE GLASS CARD */}

        <div className="mt-16 md:mt-0 bg-white/5 backdrop-blur-lg 
        border border-white/10 p-8 rounded-2xl w-[380px]">

          <h3 className="text-2xl font-semibold mb-4 text-green-400">
            Quick Overview
          </h3>

          <p className="text-gray-400 mb-6">
            A centralized AI platform designed to enhance internship 
            accessibility, improve skill alignment, and support 
            workforce readiness.
          </p>

          <div className="space-y-4">

            <div className="bg-white/5 p-4 rounded-lg">
              🤖 Intelligent AI Engine
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              📄 Resume-Based Matching
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              🎯 Personalized Internships
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              📊 Career Insights
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
