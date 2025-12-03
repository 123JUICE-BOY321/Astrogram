import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const RegisterForm = ({ onRegisterSuccess }) => {
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const name = e.target.name.value.trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    try {
      const taken = await axios.get(`${BASE_URL}/users?username=${username}`);
      if (taken.data.length > 0) {
        setError("This username is already in use.");
        return;
      }
      const newUser = {
        name,
        username,
        password,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
      };
      const res = await axios.post(`${BASE_URL}/users`, newUser);
      onRegisterSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
          Display Name
        </label>
        <input
          name="name"
          type="text"
          placeholder="e.g. Space Explorer"
          className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
          Username
        </label>
        <input
          name="username"
          type="text"
          placeholder="Must be unique"
          className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white"
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
          placeholder="Choose a strong password"
          className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 text-white"
          required
        />
      </div>
      {error && (<p className="text-red-400 text-xs font-bold text-center mt-3">{error}</p>)}
      <button type="submit" className="w-full bg-white/20 text-white border border-white/50 font-bold py-3 rounded-full hover:bg-white/30 transition mt-2 shadow-lg shadow-white/10">
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
