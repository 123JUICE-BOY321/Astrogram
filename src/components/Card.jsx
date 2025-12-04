import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {LuBookmark, LuCheck, LuArrowRight} from "react-icons/lu";

const BASE_URL = import.meta.env.VITE_API_URL;

const Card = ({ item }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return;
    }
    const checkSaved = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${user.id}`);
        const list = res.data.stellarium || [];
        const isSaved = list.some((s) => s.date === item.date);
        setSaved(isSaved);
      } catch (err) {
        console.error("Check saved error:", err);
      }
    };
    checkSaved();
  }, [user, item.date]);

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
      const isSaved = currentList.some((s) => s.date === item.date);
      let updatedList;
      if (!isSaved) {
        updatedList = [...currentList, item];
      } else {
        updatedList = currentList.filter((s) => s.date !== item.date);
      }
      await axios.patch(`${BASE_URL}/users/${user.id}`, {
        stellarium: updatedList,
      });
      const updatedUser = { ...res.data, stellarium: updatedList };
      localStorage.setItem("astroUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSaved(!isSaved);
    } catch (err) {
      console.error("Toggle save error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const dateStr = new Date(item.date).toLocaleDateString("en-US", {month: "short", day: "numeric",});
  let articleUrl = "#";
  try {
    const [y, m, d] = item.date.split("-");
    articleUrl = `https://apod.nasa.gov/apod/ap${y.slice(-2)}${m}${d}.html`;
  } catch (e) {
    console.error("Error constructing article URL:", e);
  }

  return (
    <div className="break-inside-avoid mb-6 group relative bg-slate-800/70 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-400/10 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {item.media_type === "video" ?
          (<div className="aspect-video">
            <iframe src={item.url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy" title={item.title || "video"}/>
          </div>):
          (<img src={item.url} alt={item.title} loading="lazy" className="w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleSave}
            disabled={processing}
            aria-label={saved ? `Unsave ${item.title}` : `Save ${item.title}`}
            className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-colors
              ${saved ? "bg-sky-400/20 text-sky-400 border-sky-400/50" : "bg-black/40 text-white border-white/10 hover:bg-sky-400/20 hover:text-sky-400"}`}
            title={saved ? "Unsave" : "Save"}>
            {saved ? <LuCheck /> : <LuBookmark />}
          </button>
        </div>
      </div>
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/10 px-2 py-0.5 rounded-full bg-white/5 backdrop-blur-sm">
          {dateStr}
        </span>
        <h3 className="font-bold text-lg text-white my-2 group-hover:text-sky-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{item.explanation}</p>
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <a href={articleUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-300 hover:text-white transition">
            Read More
          </a>
          <a href={articleUrl} target="_blank" rel="noreferrer">
            <LuArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;