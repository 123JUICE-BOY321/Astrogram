import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <h1 className="text-4xl font-bold text-white">404</h1>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">
        Lost in Space
      </h2>

      <p className="text-slate-400 max-w-md mb-8">
        The page you’re looking for drifted into a black hole.
      </p>

      <Link
        to="/"
        className="px-8 py-3 bg-sky-400/10 border border-sky-400/50 text-sky-400 rounded-full font-bold hover:bg-sky-400/20 transition"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
