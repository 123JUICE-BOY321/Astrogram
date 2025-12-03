import { useEffect, useState } from "react";
import axios from "axios";
import {LuZap, LuBookmarkPlus,LuCheck} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const Hero = ({ item }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    if (!user) return
    const checkSaved = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${user.id}`)
        const list = res.data.stellarium || [];
        const isSaved = list.some(s => s.date === item.date)
        setSaved(isSaved);
      } catch (err) {
        console.error(err);
      }
    };
    checkSaved();
  }, [item.date, user]);

  const toggleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (processing) return;
    setProcessing(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/${user.id}`);
      const currentList = res.data.stellarium || [];
      const isSaved = currentList.some(s => s.date === item.date);
      let updatedList;
      if (!isSaved) {
        updatedList = [...currentList, item];
      } else {
        updatedList = currentList.filter(s => s.date !== item.date);
      }
      const updatedUser = {
        ...res.data,
        stellarium: updatedList,
      };
      await axios.patch(`${BASE_URL}/users/${user.id}`, {stellarium: updatedList,});
      localStorage.setItem("astroUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaved(!isSaved);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="mb-12 relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
      {item.media_type === "video" ? 
      (<iframe src={item.url} className="w-full h-[65vh]" loading="lazy" allowFullScreen/>): 
      (<img src={item.hdurl || item.url} alt={item.title} className="w-full h-[65vh] object-cover object-center"/>)}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
          <LuZap className="w-3 h-3" />
          Daily Discovery
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight max-w-4xl drop-shadow-lg">
          {item.title}
        </h1>
        <p className="text-slate-200 text-lg max-w-2xl mb-4 leading-relaxed line-clamp-2 drop-shadow-md">
          {item.explanation}
        </p>
        <button
          onClick={toggleSave}
          disabled={processing}
          className={`px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 backdrop-blur-md border shadow-lg shadow-black/20 
            ${saved ? "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}
        >
          {saved ? <LuCheck className="w-5 h-5" /> : <LuBookmarkPlus className="w-5 h-5" />}
          {saved ? "Saved to Stellarium" : "Save to Stellarium"}
        </button>
      </div>
    </section>
  );
};

export default Hero;