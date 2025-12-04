import { LuTrash2 } from "react-icons/lu";

const SavedCard = ({ item, onDelete }) => {
  const handleDelete = () => {
    onDelete(item.date);
  };

  return (
    <div className="break-inside-avoid mb-6 bg-slate-800/70 rounded-xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all group relative">
      {item.media_type === "video" ?
        (<div className="aspect-video">
          <iframe src={item.url} className="w-full h-full" allowFullScreen title={item.title}/>
        </div>):
        (<img src={item.url} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title}/>)}
      <button onClick={handleDelete}  className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-md rounded-full text-red-400 hover:bg-red-500/80 hover:text-white transition-colors shadow-lg border border-white/10">
        <LuTrash2 className="w-4 h-4" />
      </button>
      <div className="p-5 relative z-10">
        <h3 className="font-bold text-lg text-white mb-1 leading-snug">
          {item.title}
        </h3>
        <p className="text-slate-400 text-xs">{item.date}</p>
      </div>
    </div>
  );
};

export default SavedCard;
