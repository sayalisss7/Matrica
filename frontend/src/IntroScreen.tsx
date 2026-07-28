import { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Github, Twitter, Youtube } from 'lucide-react';
import matricaLogo from './assets/matrica-logo.png';
import gameImg from './assets/game.png';
import img4 from './assets/4.png';
import img2 from './assets/2.png';
import img3 from './assets/3.png';
import valorantBg from './assets/valorant-bg.jpg';

type IntroScreenProps = {
  onEnter: () => void;
  isDarkMode: boolean;
};

export default function IntroScreen({ onEnter, isDarkMode }: IntroScreenProps) {
  const [isDiving, setIsDiving] = useState(false);

  const bgClass = isDarkMode
    ? 'bg-[#05070d] text-white'
    : 'bg-slate-900 text-white';

  const handleEnter = () => {
    if (isDiving) return;
    setIsDiving(true);
    setTimeout(() => {
      onEnter();
    }, 850);
  };

  return (
    <div
      className={`relative flex flex-col min-h-screen w-full overflow-hidden select-none transition-all duration-700 ${bgClass} ${
        isDiving ? 'scale-110 opacity-0 blur-md' : 'scale-100 opacity-100'
      }`}
    >
      {/* Hyper-speed Portal Dive Explosion Overlay */}
      {isDiving && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-gradient-to-r from-[#00e5ff] via-white to-[#00ff88] animate-ping opacity-90 blur-xl scale-[4] transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e5ff]/50 via-white/80 to-[#00ff88]/50 animate-pulse" />
        </div>
      )}

      {/* Background Wallpaper Layer with Cinematic Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 animate-pulse-slow"
        style={{ backgroundImage: `url('${valorantBg}')` }}
      />
      
      {/* Dynamic E-Sports Radial Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00e5ff]/15 via-transparent to-black/80" />
      
      {/* Scanline & Cyber Particle Effect */}
      <div className="scanlines opacity-50" />

      {/* TOP NAVBAR: Logo + E-Sports Quote (Nav links and Contact Us button removed) */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src={matricaLogo}
            alt="MATRIKA Logo"
            className="h-10 w-10 object-contain drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-logo-glow"
          />
          <div className="flex flex-col">
            <span className="brand-font text-2xl font-black tracking-[0.25em] text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              MATRIKA
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#00e5ff]">
              Esports Intelligence
            </span>
          </div>
        </div>

        {/* E-Sports Inspirational Quote */}
        <div className="hidden md:flex items-center gap-2 max-w-2xl text-center mx-auto">
          <span className="text-xs sm:text-sm font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-white to-[#00ff88] drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            "In esports, legends aren't born—they are forged in the fires of strategy, reflex, and relentless determination."
          </span>
        </div>
      </header>

      {/* CENTER CINEMATIC STAGE: 4-Character Squad Lineup & Background Typography */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Massive Background Typography Layered Behind Characters */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden z-0">
          <div className="text-center w-full transform -translate-y-6">
            <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter text-white/10 select-none leading-none drop-shadow-2xl">
              ESPORTS GENERATION
            </h1>
            <h2 className="mt-[-0.3em] text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff]/30 via-white/20 to-[#00ff88]/30 select-none leading-none drop-shadow-[0_0_40px_rgba(0,229,255,0.3)]">
              eSports MATRIKA
            </h2>
          </div>
        </div>

        {/* 4-Character Squad Standing Order: 2, 1, existing image (gameImg), and then 3 */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-6xl mx-auto my-auto w-full">
          {/* Cyber Halo / Aura behind Squad */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-[#00e5ff]/25 via-[#00ff88]/15 to-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          
          {/* Squad Character Lineup (Side by Side in requested order: 2 -> 1 -> game.png -> 3) */}
          <div className="relative z-10 flex items-end justify-center -space-x-4 sm:-space-x-8 md:-space-x-12 lg:-space-x-16 px-4">
            {/* Character 1: Image 2.png (Far Left) */}
            <div className="relative z-10 group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-40">
              <img
                src={img2}
                alt="Squad Character 2"
                className="w-auto h-52 sm:h-72 md:h-80 lg:h-96 object-contain drop-shadow-[0_15px_35px_rgba(0,229,255,0.35)] transition-all duration-700"
              />
            </div>

            {/* Character 2: Image 4.png (Inner Left) */}
            <div className="relative z-20 group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-40">
              <img
                src={img4}
                alt="Squad Character 4"
                className="w-auto h-60 sm:h-80 md:h-96 lg:h-[410px] object-contain drop-shadow-[0_20px_40px_rgba(0,255,136,0.4)] transition-all duration-700"
              />
            </div>

            {/* Character 3: Existing Image game.png (Center Hero) */}
            <div className="relative z-30 group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-40">
              <img
                src={gameImg}
                alt="Squad Leader Character"
                className="w-auto h-72 sm:h-96 md:h-[430px] lg:h-[480px] object-contain drop-shadow-[0_25px_50px_rgba(0,229,255,0.6)] transition-all duration-700 animate-smooth-zoom"
              />
            </div>

            {/* Character 4: Image 3.png (Right Side) */}
            <div className="relative z-20 group cursor-pointer transition-all duration-500 hover:scale-110 hover:z-40">
              <img
                src={img3}
                alt="Squad Character 3"
                className="w-auto h-60 sm:h-80 md:h-96 lg:h-[410px] object-contain drop-shadow-[0_20px_40px_rgba(245,158,11,0.4)] transition-all duration-700"
              />
            </div>
          </div>

          {/* Glowing CTA Button: Let's dive into Matrika */}
          <div className="mt-8 z-40">
            <button
              onClick={handleEnter}
              disabled={isDiving}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#00e5ff] via-[#00ff88] to-[#00e5ff] bg-[length:200%_100%] animate-gradient text-black font-black text-base sm:text-lg uppercase tracking-[0.2em] shadow-[0_0_35px_rgba(0,229,255,0.8)] hover:shadow-[0_0_60px_rgba(0,255,136,1)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="animate-spin-slow text-black" size={22} />
              <span>Let's dive into Matrika</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-black" size={22} />
            </button>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER BAR */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-12 py-6 border-t border-white/10 bg-black/60 backdrop-blur-lg">
        {/* Left Stats Section */}
        <div className="flex items-center gap-8 sm:gap-12">
          <div className="flex flex-col">
            <span className="brand-font text-2xl sm:text-3xl font-black text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              250+
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Partners Worldwide
            </span>
          </div>

          <div className="flex flex-col">
            <span className="brand-font text-2xl sm:text-3xl font-black text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.6)]">
              20+
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Pro Teams Connected
            </span>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="brand-font text-2xl sm:text-3xl font-black text-[#f59e0b] drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">
              99.9%
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              AI Telemetry Accuracy
            </span>
          </div>
        </div>

        {/* Right Social Circular Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-300 hover:text-[#00e5ff] hover:border-[#00e5ff] hover:bg-[#00e5ff]/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] transition-all duration-300"
            title="Discord"
          >
            <MessageSquare size={18} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-300 hover:text-[#ff2a2a] hover:border-[#ff2a2a] hover:bg-[#ff2a2a]/20 hover:shadow-[0_0_15px_rgba(255,42,42,0.6)] transition-all duration-300"
            title="YouTube"
          >
            <Youtube size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-300 hover:text-[#00e5ff] hover:border-[#00e5ff] hover:bg-[#00e5ff]/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] transition-all duration-300"
            title="Twitter / X"
          >
            <Twitter size={18} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-slate-300 hover:text-[#00ff88] hover:border-[#00ff88] hover:bg-[#00ff88]/20 hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] transition-all duration-300"
            title="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}
