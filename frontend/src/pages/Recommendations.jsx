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

                    <div key={index}
                        className="bg-white/5 p-6 rounded-xl mb-6 border border-white/10">

                        <h2 className="text-2xl font-bold text-indigo-400">
                            {job["job title"]}
                        </h2>

                        <p>{job["company name"]}</p>

                        <p className="text-gray-400">
                            📍 {job.cities} | 💰 {job.stipend} | ⏳ {job.duration}
                        </p>

                        <p className="text-green-400 mt-2">
                            Match Score: {job["Match Score (%)"]}%
                        </p>

                    </div>
                ))
            )}
        </div>
    );
}
