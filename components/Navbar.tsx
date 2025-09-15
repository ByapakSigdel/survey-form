"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const { lang, setLang } = useLanguage();
  const toggle = () => setLang(lang === 'en' ? 'np' : 'en');
  return (
    <header className="w-full border-b border-neutral-800/60 bg-neutral-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/50 sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-2">
          <a href="https://www.hundredstudios.tech" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
            <Image src="/logo-light-1.png" alt="Hundred Studios" width={260} height={80} className="h-10 md:h-12 w-auto opacity-90 group-hover:opacity-100 transition" />
            <span className="sr-only">Hundred Studios</span>
          </a>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link href="#survey" className="relative group text-neutral-300 hover:text-white transition-colors">
            <span>{lang === 'en' ? 'Survey' : 'सर्वे'}</span>
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-gradient-to-r from-neutral-500 to-white transition-all duration-500 group-hover:w-full" />
          </Link>
          <Link href="#about" className="relative group text-neutral-300 hover:text-white transition-colors">
            <span>{lang === 'en' ? 'About' : 'बारेमा'}</span>
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-gradient-to-r from-neutral-500 to-white transition-all duration-500 group-hover:w-full" />
          </Link>
          <button onClick={toggle} className="text-xs rounded-full border border-neutral-700/70 px-4 py-1.5 hover:border-neutral-500 hover:bg-neutral-800/60 active:scale-[0.97] transition-colors shadow-[0_0_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
            {lang === 'en' ? 'नेपाली' : 'English'}
          </button>
        </nav>
        <button onClick={toggle} className="md:hidden text-xs rounded-full border border-neutral-700/70 px-3 py-1.5 hover:border-neutral-500 hover:bg-neutral-800/60 active:scale-[0.97] transition-colors">
          {lang === 'en' ? 'नेपाली' : 'EN'}
        </button>
      </div>
    </header>
  );
}
