import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, stars = [];
    let animationFrameId;

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 3000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.05 + 0.005,
          twinkleSpeed: Math.random() * 0.01 + 0.002,
          twinkleDir: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity > 1) { star.opacity = 1; star.twinkleDir *= -1; }
        else if (star.opacity < 0.2) { star.opacity = 0.2; star.twinkleDir *= -1; }
        
        star.y -= star.speed;
        if (star.y < 0) { star.y = height; star.x = Math.random() * width; }
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-gradient-to-b from-slate-900 to-black"
    />
  );
};

export default Starfield;