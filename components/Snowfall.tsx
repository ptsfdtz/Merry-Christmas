import React, { useEffect, useRef } from "react";

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wind: number;
      vx: number;
      vy: number;
    }[] = [];

    const particleCount = width < 768 ? 60 : 200;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        vx: 0,
        vy: 0,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient for snow
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(1, "rgba(200, 230, 255, 0.4)");
      ctx.fillStyle = gradient;

      ctx.beginPath();

      particles.forEach((p) => {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
      });

      ctx.fill();
      update();
      requestAnimationFrame(draw);
    };

    const update = () => {
      particles.forEach((p) => {
        // Natural movement
        p.y += p.speed;
        p.x += p.wind;

        // Mouse interaction (Repulsion)
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDistance = 150;

        if (distance < forceDistance) {
          const force = (forceDistance - distance) / forceDistance;
          const angle = Math.atan2(dy, dx);
          const push = force * 4; // Push strength

          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push;
        }

        // Apply velocity with damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Wrap around
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
          p.vx = 0;
          p.vy = 0;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    const animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} id="snow-canvas" className="pointer-events-none" />
  );
};

export default Snowfall;
