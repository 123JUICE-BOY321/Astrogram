import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  useEffect(() => {
      const stored = localStorage.getItem("astroUser");
      if (stored) {
        navigate("/");
      }
  }, []);

  const handleSuccess = (user) => {
    localStorage.setItem("astroUser", JSON.stringify(user));
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-slate-800/70 p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Join Astrogram
        </h2>
        <div className="flex mb-6 bg-black/30 rounded-full p-1">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition
              ${tab === "login" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            Log In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition
              ${tab === "register" ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
            Sign Up
          </button>
        </div>
        {tab === "login" ?
         (<LoginForm onLoginSuccess={handleSuccess} />):
         (<RegisterForm onRegisterSuccess={handleSuccess} />
)}
      </div>
    </div>
  );
};

export default Login;
