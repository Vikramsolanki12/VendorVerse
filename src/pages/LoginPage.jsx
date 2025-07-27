import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate(role === "vendor" ? "/vendor" : "/supplier");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-md shadow-2xl text-white space-y-6">
        <h1 className="text-3xl font-extrabold text-center tracking-wide">
          {isSignup ? "Join VendorVerse" : "Welcome to VendorVerse"}
        </h1>

        <select
          className="bg-white/20 backdrop-blur border border-white/30 rounded px-4 py-2 w-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="vendor">Vendor</option>
          <option value="supplier">Supplier</option>
        </select>

        <input
          className="bg-white/20 backdrop-blur border border-white/30 rounded px-4 py-2 w-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="bg-white/20 backdrop-blur border border-white/30 rounded px-4 py-2 w-full text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded transition-all duration-200"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>

        <p
          className="text-sm text-center cursor-pointer hover:text-purple-400 transition"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Log In"
            : "New to VendorVerse? Sign Up"}
        </p>
      </div>
    </div>
  );
}
