import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {

    const user = {
      name,
      email,
      password
    };

    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup Successful ✅");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 
      rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold mb-2 text-center">
          Create Your AI Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e)=>setName(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-transparent border border-gray-600"
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-transparent border border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-transparent border border-gray-600"
        />

        <button 
          onClick={handleSignup}
          className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500">
          Sign Up
        </button>

      </div>
    </div>
  );
}
