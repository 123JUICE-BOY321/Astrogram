import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import ExploreFeed from "../components/ExploreFeed";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const Discover = () => {
  const [heroData, setHeroData] = useState(null);
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const apodReq = axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
      const feedReq = axios.get(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=15`);
      const [apodRes, feedRes] = await Promise.all([apodReq, feedReq]);
      setHeroData(apodRes.data);
      setFeedData(feedRes.data);
    } catch (err) {
      console.error("Discover API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Hero item={heroData}/>
      <ExploreFeed initialFeed={feedData} />
    </div>
  );
};

export default Discover;