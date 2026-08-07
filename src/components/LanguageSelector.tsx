import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
}

const LANGUAGES: { code: Language; name: string; flag: string; nativeName: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900/80 border border-pink-500/30 hover:border-pink-500 text-slate-200 text-xs sm:text-sm font-medium transition-all shadow-sm backdrop-blur-sm cursor-pointer"
      >
        <span className="text-sm sm:text-base">{selectedLanguage.flag}</span>
        <span className="hidden md:inline-block">{selectedLanguage.nativeName}</span>
        <span className="uppercase text-[10px] sm:text-xs text-pink-400 font-bold">{selectedLanguage.code}</span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#0F0F12] border border-pink-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  onClick={() => {
                    onSelectLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 font-semibold border-l-2 border-pink-500'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
