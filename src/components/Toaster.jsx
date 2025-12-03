// src/components/Toaster.jsx
import React, { useState, useEffect } from "react";

// Global function placeholder (assigned later)
let triggerToast = () => {};

export const showToast = (message, type = "success") => {
  triggerToast(message, type);
};

const Toaster = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Assign the globally accessible function
    triggerToast = (message, type) => {
      setToast({ message, type });

      // Auto-hide after 3 seconds
      setTimeout(() => setToast(null), 3000);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999]">
      <div
        className={`
          px-5 py-3 rounded-xl shadow-xl text-white 
          backdrop-blur-xl border
          transition-all duration-300
          ${toast.type === "error" 
            ? "bg-red-500/30 border-red-500/40" 
            : "bg-green-500/30 border-green-500/40"}
        `}
      >
        {toast.message}
      </div>
    </div>
  );
};

export default Toaster;
