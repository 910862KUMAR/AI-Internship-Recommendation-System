export default function Profile() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="p-10 text-white bg-[#020617] min-h-screen">

            <h1 className="text-4xl font-bold mb-8">
                👤 Profile
            </h1>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 w-[400px]">

                <p><b>Name:</b> {user?.name}</p>
                <p><b>Email:</b> {user?.email}</p>

            </div>

        </div>
    );
}
