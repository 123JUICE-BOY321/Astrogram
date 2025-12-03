// src/components/Cards.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLayoutGrid,
  LuRefreshCcw,
  LuBookmark,
  LuCheck,
  LuArrowRight,
} from "react-icons/lu";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL;

const Cards = ({ initialFeed }) => {
  const [feed, setFeed] = useState(initialFeed || []);
  const [refreshing, setRefreshing] = useState(false);

  // REFRESH FEED
  const refreshFeed = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=15`
      );
      setFeed(res.data);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mt-12">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <LuLayoutGrid className="text-sky-400" />
          Explore Cosmos
        </h2>

        <div className="h-px bg-white/10 flex-grow"></div>

        <button
          onClick={refreshFeed}
          className="p-2 rounded-full bg-slate-800/70 border border-white/10 text-slate-300 hover:border-sky-400/50 hover:text-white hover:bg-slate-700/50 transition-all group"
          aria-label="Refresh feed"
        >
          <LuRefreshCcw
            className={`
              w-5 h-5 transition-transform duration-500
              ${refreshing ? "animate-spin" : "group-hover:rotate-180"}
            `}
          />
        </button>
      </div>

      {/* GRID */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {feed.map((item) => (
          <Card key={`${item.date}-${item.title}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Cards;

/* ---------------- Card component (Hero-style save logic) ---------------- */

const Card = ({ item }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);

  // read user from localStorage on mount (same pattern as Hero)
  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  // check if this item is already saved for the user
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
      // get latest user record
      const res = await axios.get(`${BASE_URL}/users/${user.id}`);
      const currentList = res.data.stellarium || [];
      const isSaved = currentList.some((s) => s.date === item.date);

      // compute updated list
      let updatedList;
      if (!isSaved) {
        updatedList = [...currentList, item];
      } else {
        updatedList = currentList.filter((s) => s.date !== item.date);
      }

      // persist
      await axios.patch(`${BASE_URL}/users/${user.id}`, {
        stellarium: updatedList,
      });

      // update localStorage & local state
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

  // small helpers
  const dateStr = new Date(item.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  // try to produce the original APOD article link, but guard against unexpected date formats
  let articleUrl = "#";
  try {
    const [y, m, d] = item.date.split("-");
    articleUrl = `https://apod.nasa.gov/apod/ap${y.slice(-2)}${m}${d}.html`;
  } catch (e) {
    // keep articleUrl as "#"
  }

  return (
    <div className="break-inside-avoid mb-6 group relative bg-slate-800/70 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-400/10 hover:-translate-y-1">
      {/* IMAGE / VIDEO */}
      <div className="relative overflow-hidden">
        {item.media_type === "video" ? (
          <div className="aspect-video">
            <iframe
              src={item.url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
              title={item.title || "video"}
            />
          </div>
        ) : (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* SAVE BUTTON */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleSave}
            disabled={processing}
            aria-label={saved ? `Unsave ${item.title}` : `Save ${item.title}`}
            className={`
              p-2 rounded-full backdrop-blur-md border shadow-lg transition-colors
              ${saved
                ? "bg-sky-400/20 text-sky-400 border-sky-400/50"
                : "bg-black/40 text-white border-white/10 hover:bg-sky-400/20 hover:text-sky-400"}
            `}
            title={saved ? "Unsave" : "Save"}
          >
            {saved ? <LuCheck /> : <LuBookmark />}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-white/10 px-2 py-0.5 rounded-full bg-white/5 backdrop-blur-sm">
          {dateStr}
        </span>

        <h3 className="font-bold text-lg text-white my-2 group-hover:text-sky-400 transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{item.explanation}</p>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <a
            href={articleUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-300 hover:text-white transition"
          >
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
