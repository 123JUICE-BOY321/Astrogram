import React from 'react';
import { LuGithub } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="relative z-10 pt-25 overflow-hidden">
      <div className="flex flex-col items-center gap-6">
        
        <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 backdrop-blur-md group">
          <LuGithub className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>

        <div className="text-slate-600 text-xs font-medium tracking-wide">
          &copy; 2025 ASTROGRAM. All rights reserved.
        </div>

        <h1 className="text-[17vw] leading-none font-bold text-white/10 tracking-tighter">
            ASTROGRAM
        </h1>
      </div>
    </footer>
  );
};

export default Footer;