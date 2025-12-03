import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const LoginForm = ({ onLoginSuccess }) => {
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    try {
      const res = await axios.get(`${BASE_URL}/users?username=${username}`);
      const user = res.data[0];
      if (!user || user.password !== password) {
        setError("Invalid username or password");
        return;
      }
      onLoginSuccess(user);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
          Username
        </label>
        <input
          name="username"
          type="text"
          placeholder="Enter your username"
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sky-400 outline-none focus:ring-1 focus:ring-sky-400"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sky-400 outline-none focus:ring-1 focus:ring-sky-400"
          required
        />
      </div>
      {error && (<p className="text-red-400 text-xs font-bold text-center mt-3">{error}</p>)}
      <button type="submit" className="w-full bg-sky-400/20 text-sky-400 border border-sky-400/50 font-bold py-3 rounded-full hover:bg-sky-400/30 transition mt-2 shadow-lg shadow-sky-400/10">
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
