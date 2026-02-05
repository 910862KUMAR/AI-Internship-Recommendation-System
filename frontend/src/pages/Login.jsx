import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if(!storedUser){
      alert("No user found. Please signup first.");
      return;
    }

    if(email === storedUser.email && password === storedUser.password){
      
      alert("Login Successful 🚀");

      // ✅ GO TO DASHBOARD
      navigate("/dashboard");

    }else{
      alert("Invalid Credentials ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 
      rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold mb-2 text-center">
          Access Your AI Portal
        </h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-transparent border border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-transparent border border-gray-600"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg font-semibold 
          bg-gradient-to-r from-indigo-500 to-cyan-500">
          Sign In
        </button>

        {/* SIGNUP LINK */}

        <p className="text-sm text-gray-400 text-center mt-4">
          New user?{" "}
          <span 
            onClick={() => navigate("/signup")}
            className="text-indigo-400 cursor-pointer hover:underline"
          >
            Create Account
          </span>
        </p>

      </div>
    </div>
  );
}
