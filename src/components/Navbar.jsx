import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {LuSparkles, LuSettings, LuLogOut} from "react-icons/lu";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("astroUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("astroUser");
    location.pathname === "/" ? navigate(0) : navigate("/");
  };

  const activeTab = "text-white bg-white/10 shadow-sm border border-white/20 shadow-white/5";
  const inactiveTab = "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent";

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xs border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-white/10">
                <LuSparkles className="text-white" size={16} />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-bold text-lg text-white tracking-wide leading-none">
                Astrogram
              </span>
              <span className="text-[10px] text-sky-200/60 font-medium tracking-wide leading-none mt-1">
                Your feed, but from space
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 bg-white/5 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/10">
            <Link to="/"
              className={`px-3 py-1.5 sm:px-5 rounded-full text-xs sm:text-sm font-medium transition-all 
                ${location.pathname === "/" ? activeTab : inactiveTab}`}>
              Discover
            </Link>
            <Link to="/stellarium"
              className={`px-3 py-1.5 sm:px-5 rounded-full text-xs sm:text-sm font-medium transition-all 
                ${location.pathname === "/stellarium" ? activeTab : inactiveTab}`}>
              Stellarium
            </Link>
          </div>

          {user ? 
          (<div className="relative group">
              <button className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 backdrop-blur-md bg-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-none mt-1">
                    @{user.username}
                  </p>
                </div>
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/20 bg-slate-800"/>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-slate-950/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 overflow-hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50">
                <Link to="/settings" className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-slate-300 transition-colors flex items-center gap-2 border-b border-white/5">
                  <LuSettings size={16} /> Settings
                </Link>
                <button onClick={logout} className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                  <LuLogOut size={16} /> Log Out
                </button>
              </div>
            </div>):
            (<Link to="/login" className="px-5 py-2 rounded-full bg-sky-400/10 border border-sky-400/50 backdrop-blur-md text-sky-400 font-bold text-sm hover:bg-sky-400/20 transition-all shadow-lg shadow-sky-400/10">
              Log In
            </Link>)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;