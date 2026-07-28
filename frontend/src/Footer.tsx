import { Sparkles } from 'lucide-react';
import matricaLogo from './assets/matrica-logo.png';

type FooterProps = {
  isDarkMode: boolean;
};

export default function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer
      className={`w-full mt-4 py-2.5 px-6 border-t transition-all duration-700 shrink-0 ${
        isDarkMode
          ? 'border-white/10 bg-black/85 text-slate-400 backdrop-blur-md'
          : 'border-slate-300 bg-white/95 text-slate-800 shadow-md backdrop-blur-md'
      }`}
    >
      <div className="w-full flex flex-row items-center justify-between gap-4 overflow-hidden whitespace-nowrap text-[11px]">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={matricaLogo}
            alt="Matrika Logo"
            className="h-5 w-5 object-contain drop-shadow-sm"
          />
          <span
            className={`brand-font font-black tracking-widest ${
              isDarkMode ? 'text-white' : 'text-slate-950 font-black'
            }`}
          >
            MATRIKA
          </span>
          <span className="opacity-40">•</span>
          <span
            className={`font-extrabold uppercase tracking-wider ${
              isDarkMode ? 'text-blue-400' : 'text-blue-700 font-black'
            }`}
          >
            Esports Intelligence © 2026
          </span>
        </div>

        {/* Center: Live Status & Metrics */}
        <div className="flex items-center gap-4 font-black uppercase tracking-wider shrink-0">
          <span className="flex items-center gap-1 text-emerald-500">
            <Sparkles size={11} className="animate-spin-slow" /> System Online
          </span>
          <span className="opacity-40">•</span>
          <span
            className={
              isDarkMode ? 'text-slate-300' : 'text-slate-900 font-extrabold'
            }
          >
            Valorant Telemetry API
          </span>
          <span className="opacity-40">•</span>
          <span
            className={
              isDarkMode ? 'text-slate-300' : 'text-slate-900 font-extrabold'
            }
          >
            250+ Pro Partners
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-4 font-bold uppercase tracking-wider shrink-0">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className={`hover:underline ${
              isDarkMode
                ? 'hover:text-[#00e5ff]'
                : 'hover:text-blue-700 font-black'
            }`}
          >
            Privacy
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className={`hover:underline ${
              isDarkMode
                ? 'hover:text-[#00e5ff]'
                : 'hover:text-blue-700 font-black'
            }`}
          >
            Terms
          </a>
          <a
            href="#api"
            onClick={(e) => e.preventDefault()}
            className={`hover:underline ${
              isDarkMode
                ? 'hover:text-[#00e5ff]'
                : 'hover:text-blue-700 font-black'
            }`}
          >
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
