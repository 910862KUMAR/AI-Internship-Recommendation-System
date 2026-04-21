export default function Recommendations() {

    const recommendations =
        JSON.parse(localStorage.getItem("recommendations")) || [];

    return (
        <div className="p-10 text-white bg-[#020617] min-h-screen">

            <h1 className="text-4xl font-bold mb-8">
                🔥 AI Internship Recommendations
            </h1>

            {recommendations.length === 0 ? (
                <p>No recommendations yet. Upload resume first.</p>
            ) : (
                recommendations.map((job, index) => (

                    <div
                        key={index}
                        className="bg-white/5 p-6 rounded-xl mb-6 border border-white/10"
                    >

                        <h2 className="text-2xl font-bold text-indigo-400">
                            {job["job title"]}
                        </h2>

                        <p>{job["company name"]}</p>

                        <p className="text-gray-400">
                            📍 {job.cities} | 💰 {job.stipend} | ⏳ {job.duration}
                        </p>

                        {/* DOMAIN */}
                        {job.domain && (
                            <p className="text-cyan-400 mt-2">
                                🧠 Domain: {job.domain}
                            </p>
                        )}

                        {/* MATCHED SKILLS */}
                        {job.matched_skills && (
                            <p className="text-yellow-400">
                                🛠 Skills: {job.matched_skills.join(", ")}
                            </p>
                        )}

                        {/* MATCH SCORE */}
                        <p className="text-green-400 mt-2">
                            Match Score: {job["Match Score (%)"]}%
                        </p>

                        {/* RANK */}
                        {job.rank && (
                            <p className="text-indigo-400 mt-2">
                                🏆 Rank: #{job.rank}
                            </p>
                        )}

                        {/* SKILL GAP */}
                        {job.skill_gap && job.skill_gap.length > 0 && (
                            <p className="text-red-400 mt-1">
                                ⚠️ Skill Gap: {job.skill_gap.join(", ")}
                            </p>
                        )}

                        {/* LEARNING RECOMMENDATION */}
                        {job.learning_recommendation && job.learning_recommendation.length > 0 && (
                            <p className="text-blue-400 mt-1">
                                📚 Learn: {job.learning_recommendation.join(", ")}
                            </p>
                        )}

                        {/* RESUME AI SCORE */}
                        {job.resume_ai_score && (
                            <p className="text-purple-400 mt-1">
                                🤖 Resume AI Score: {job.resume_ai_score}%
                            </p>
                        )}

                        {/* APPLY LINK */}
                        {job.apply_link && (
                            <div className="mt-3">
                                <a
                                    href={job.apply_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-green-400 underline hover:text-green-300"
                                >
                                    🚀 Apply Internship
                                </a>
                            </div>
                        )}

                    </div>
                ))
            )}

        </div>
    );
}