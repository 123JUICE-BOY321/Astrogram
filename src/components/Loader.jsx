import { LuLoaderCircle, LuRocket } from "react-icons/lu";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-sky-400/50 blur-2xl rounded-full animate-pulse"></div>
        <div className="relative w-24 h-24 bg-slate-900/80 rounded-full border border-white/10 flex items-center justify-center shadow-2xl">
          <LuLoaderCircle className="w-10 h-10 text-sky-400 animate-spin" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sky-400 rounded-full flex items-center justify-center animate-bounce">
          <LuRocket className="w-4 h-4 text-slate-900 fill-current" />
        </div>
      </div>
      <p className="text-slate-400 text-xl animate-pulse tracking-wide">
        Preparing launch sequence...
      </p>
    </div>
  );
};

export default Loader;
