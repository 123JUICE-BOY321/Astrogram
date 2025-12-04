import axios from "axios";
import { useState, useEffect } from "react";
import {LuLayoutGrid, LuRefreshCcw} from "react-icons/lu";
import Card from "./Card";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const ExploreFeed = ({ initialFeed }) => {
  const [feed, setFeed] = useState(initialFeed || []);
  const [refreshing, setRefreshing] = useState(false);

  const refreshFeed = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=15`);
      setFeed(res.data);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <LuLayoutGrid className="text-sky-400" />
          Explore Cosmos
        </h2>
        <div className="h-px bg-white/20 flex-grow"></div>
        <button onClick={refreshFeed} className="p-2 rounded-full bg-slate-800/70 border border-white/10 text-slate-300 hover:border-sky-400/50 hover:text-white hover:bg-slate-700/50 transition-all group" aria-label="Refresh feed">
          <LuRefreshCcw className={`w-5 h-5 transition-transform duration-500 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`}/>
        </button>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {feed.map((item) => (
          <Card key={`${item.date}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ExploreFeed;