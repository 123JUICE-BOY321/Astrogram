import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setName(parsed.name);
  }, []);

  if (!user) return <Loader />;

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        name,
        ...(password ? { password } : {}),
      };
      await axios.put(`${BASE_URL}/users/${user.id}`, updatedUser);
      localStorage.setItem("astroUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Changes saved!");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure? This will delete your Stellarium collection forever.")) return;
    try {
      await axios.delete(`${BASE_URL}/users/${user.id}`);
      localStorage.removeItem("astroUser");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
      <div className="bg-slate-800/70 rounded-2xl border border-white/10 p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <img src={user.avatar} className="w-20 h-20 bg-black/20 rounded-full border border-white/20"/>
          <div>
            <h3 className="text-xl font-bold text-white">{user.name}</h3>
            <p className="text-slate-400">@{user.username}</p>
          </div>
        </div>
        <form onSubmit={saveChanges} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sky-400 outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              New Password (Optional)
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-sky-400 outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-2 bg-sky-400/20 text-sky-400 border border-sky-400/50 font-bold rounded-full hover:bg-sky-400/30 transition mt-2 shadow-lg shadow-sky-400/10">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className="bg-red-500/5 backdrop-blur-xs rounded-2xl border border-red-500/20 p-8">
        <h3 className="text-red-400 font-bold text-lg mb-2">Danger Zone</h3>
        <p className="text-slate-400 text-sm mb-6">
          Once you delete your account, there is no going back. All your saved Stellarium items will be lost.
        </p>
        <button onClick={deleteAccount} className="px-6 py-2 border border-red-500/50 text-red-400 font-bold rounded-full hover:bg-red-500/10 backdrop-blur-md">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings