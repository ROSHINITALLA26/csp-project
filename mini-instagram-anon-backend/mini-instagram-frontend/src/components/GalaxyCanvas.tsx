import { useEffect, useRef, useState } from "react";

export default function GalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [voiceStars, setVoiceStars] = useState<any[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [activeStar, setActiveStar] = useState<number | null>(null);
  const [rippleRadius, setRippleRadius] = useState<number>(0);
  const rippleRef = useRef<number>(0);
  const numStars = 300;
  const bgStarsRef = useRef<any[]>([]);

  // 🎨 Draw animated galaxy background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bgStarsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        brightness: Math.random(),
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const drawBackground = () => {
      const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      g.addColorStop(0, "#080016");
      g.addColorStop(1, "#000010");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      for (const s of bgStarsRef.current) {
        s.pulse += 0.03;
        const flicker = 0.5 + 0.5 * Math.sin(s.pulse);
        ctx.beginPath();
        const dist = Math.hypot(s.x - mouseX, s.y - mouseY);
        const glow = mouseActive && dist < 150 ? (150 - dist) / 150 : 0;
        const alpha = Math.min(1, s.brightness + flicker * 0.3 + glow);
        ctx.fillStyle = `rgba(255,255,${200 + Math.random() * 55},${alpha})`;
        ctx.shadowBlur = 8 + glow * 10;
        ctx.shadowColor = "white";
        ctx.arc(s.x, s.y, s.size + glow * 2, 0, Math.PI * 2);
        ctx.fill();
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
      }
    };

    const drawVoiceStars = () => {
      for (let i = 0; i < voiceStars.length; i++) {
        const v = voiceStars[i];
        const isActive = i === activeStar;
        const flicker = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 + v.x);
        const pulseSize = isActive ? 10 : 6;
        const pulseGlow = isActive ? 35 : 20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 215, 0, ${flicker})`;
        ctx.shadowBlur = pulseGlow;
        ctx.shadowColor = isActive ? "orange" : "gold";
        ctx.arc(v.x, v.y, pulseSize + flicker * 2, 0, Math.PI * 2);
        ctx.fill();

        // 🌊 Draw ripple (soundwave effect)
        if (isActive && rippleRadius > 0) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 200, 50, ${1 - rippleRadius / 120})`;
          ctx.lineWidth = 2;
          ctx.arc(v.x, v.y, rippleRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      drawBackground();
      drawStars();
      drawVoiceStars();
      requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    });
    canvas.addEventListener("mouseleave", () => (mouseActive = false));

    // 🔊 Play voice star on click
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const index = voiceStars.findIndex(
        (s) => Math.hypot(s.x - clickX, s.y - clickY) < 12
      );

      if (index !== -1) {
        const star = voiceStars[index];

        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }

        const audio = new Audio(star.mediaUrl);
        audio.play();
        setCurrentAudio(audio);
        setActiveStar(index);

        // 🌊 Reset ripple animation
        rippleRef.current = 0;
        const rippleInterval = setInterval(() => {
          rippleRef.current += 2;
          setRippleRadius(rippleRef.current);
          if (rippleRef.current > 120) rippleRef.current = 0;
        }, 50);

        audio.onended = () => {
          setActiveStar(null);
          setRippleRadius(0);
          clearInterval(rippleInterval);
        };
      }
    });

    return () => window.removeEventListener("resize", resize);
  }, [voiceStars, currentAudio, activeStar, rippleRadius]);

  // 🎧 Fetch stored voice stars
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts/voices");
        const data = await res.json();
        const stars = data.map((v: any) => ({
  x: v.starPosition?.x || Math.random() * window.innerWidth,
  y: v.starPosition?.y || Math.random() * window.innerHeight,
  mediaUrl: `http://localhost:5000${v.mediaUrl}`,
}));

        setVoiceStars(stars);
      } catch (err) {
        console.error("Error fetching voices:", err);
      }
    };
    fetchVoices();
  }, []);

  // 🎙 Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("media", blob, "voice.webm");
        formData.append("kind", "voice");
        formData.append("text", "Echo voice note");

        const res = await fetch("http://localhost:5000/posts", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        const data = await res.json();
        if (data.mediaUrl) {
          setVoiceStars((prev) => [
            ...prev,
            {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              mediaUrl: `http://localhost:5000${data.mediaUrl}`,
            },
          ]);
        }
      };

      recorder.start();
      setRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      alert("Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 cursor-pointer" />
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-3xl font-bold tracking-wider">🌌 Echo Chamber</h1>
        <p className="text-sm text-gray-300 mt-2 animate-pulse">
          Tap a golden star to listen — feel the ripples ✨
        </p>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full shadow-lg transition-all text-lg font-semibold"
          >
            🎤 Record Voice
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-full shadow-lg transition-all text-lg font-semibold animate-pulse"
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}
