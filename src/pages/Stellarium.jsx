import { useEffect, useState } from "react";
import axios from "axios";
import { LuLock, LuBookmark } from "react-icons/lu";
import SavedCard from "../components/SavedCard";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;

const Stellarium = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedItems([]);
      setLoading(false);
      return;
    }
    let mounted = true;
    const loadSaved = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/users/${user.id}`);
        if (!mounted) return;
        setSavedItems(res.data.stellarium || []);
      } catch (err) {
        console.error("Error loading stellarium:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadSaved();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleDelete = async (date) => {
    const prev = savedItems;
    const updated = prev.filter((i) => i.date !== date);
    setSavedItems(updated);
    try {
      await axios.patch(`${BASE_URL}/users/${user.id}`, { stellarium: updated });
      const stored = localStorage.getItem("astroUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUser = { ...parsed, stellarium: updated };
        localStorage.setItem("astroUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setSavedItems(prev);
    }
  };

  if (loading) return <Loader />;

  if (!user)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-white/5 backdrop-blur-lg rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/10">
          <LuLock className="text-slate-400 text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Login Required</h2>
        <p className="text-slate-400 max-w-md mb-8">
          You need to be logged in to access your personal Stellarium collection.
        </p>
        <Link to="/login" className="px-8 py-3 bg-sky-400/10 border border-sky-400/50 text-sky-400 rounded-full font-bold hover:bg-sky-400/20 backdrop-blur-md transition-all shadow-lg shadow-sky-400/10">
          Log In / Sign Up
        </Link>
      </div>
    );

  if (savedItems.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white/5 backdrop-blur-lg rounded-full flex items-center justify-center mb-6 border border-white/10">
          <LuBookmark className="text-slate-400 text-4xl" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Stellarium is empty</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Save interesting cosmic discoveries here for your personal collection.
        </p>
        <Link to="/" className="px-6 py-3 bg-sky-400/10 border border-sky-400/50 text-sky-400 rounded-full font-bold hover:bg-sky-400/20 backdrop-blur-md transition-all">
          Go Explore
        </Link>
      </div>
    );

  return (
    <div className="pt-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">My Stellarium</h1>
        <p className="text-slate-400">Your curated collection of the cosmos.</p>
      </header>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {savedItems.map((item) => (
          <SavedCard key={`${item.date}`} item={item} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Stellarium;
