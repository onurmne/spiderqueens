import React from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { Language, UserProfile } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { CountdownTimer } from './CountdownTimer';
import { RewardSettings, DEFAULT_REWARD_SETTINGS } from '../lib/api';
import { Crown, Zap, Shield, Sparkles, ShoppingBag, PlusCircle, UserCheck } from 'lucide-react';

interface HeaderProps {
  t: TranslationDictionary;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  onOpenStore: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  rewardSettings?: RewardSettings;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  currentLang,
  onSelectLang,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenStore,
  onOpenAuth,
  onOpenProfile,
  rewardSettings = DEFAULT_REWARD_SETTINGS,
}) => {
  const isLoggedIn = Boolean(
    userProfile && 
    userProfile.email && 
    userProfile.email.trim() !== '' && 
    !userProfile.email.includes('guest') && 
    !userProfile.email.includes('voter@spiderqueens.com')
  );

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F12]/95 backdrop-blur-md border-b border-white/10 shadow-2xl w-full">
      {/* Countdown Timer Strip */}
      <CountdownTimer t={t} rewardSettings={rewardSettings} />

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('clash')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-pink-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg shadow-pink-600/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-sm sm:text-lg tracking-tighter">SQ</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-2xl font-black tracking-tighter text-white">
                  SPIDER<span className="text-pink-500">QUEENS</span>
                </span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 animate-pulse hidden sm:inline" />
              </div>
              <p className="hidden md:block text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              id="nav-clash"
              onClick={() => setActiveTab('clash')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'clash'
                  ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              ⚔️ {t.navClash}
            </button>

            <button
              id="nav-leaderboard"
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              👑 {t.navLeaderboard}
            </button>

            <button
              id="nav-browse"
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              🕸️ {t.navBrowse}
            </button>

            <button
              id="nav-join"
              onClick={() => setActiveTab('join')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              ✨ {t.navJoin}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Super Vote Balance Badge */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-1 shadow-inner">
              <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                <Zap className="w-3 h-3 fill-current sm:hidden text-amber-400" />
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)] animate-pulse hidden sm:block" />
                <span className="font-mono text-[11px] sm:text-xs">
                  {userProfile.super_votes_credit} <span className="hidden sm:inline">{t.superVote}</span>
                </span>
              </div>
              <button
                id="btn-buy-super-votes"
                onClick={onOpenStore}
                className="ml-1 text-[11px] sm:text-xs font-extrabold text-white bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-110 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.buyVotes}</span>
              </button>
            </div>

            {/* Auth / Profile Button */}
            <button
              id="btn-user-auth-profile"
              onClick={isLoggedIn ? onOpenProfile : onOpenAuth}
              className={`px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs font-extrabold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer max-w-[110px] sm:max-w-none ${
                isLoggedIn
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-300 hover:bg-pink-500/20'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 border-pink-500/40 text-white shadow-md'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isLoggedIn ? 'text-pink-400' : 'text-white'}`} />
              <span className="text-[11px] sm:text-xs truncate">
                {isLoggedIn
                  ? userProfile.full_name || userProfile.email.split('@')[0]
                  : t.loginRegisterBtn}
              </span>
            </button>

            {/* Language Selector */}
            <LanguageSelector currentLang={currentLang} onSelectLang={onSelectLang} />
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around gap-1 mt-2.5 pt-2 border-t border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('clash')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'clash' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400'
            }`}
          >
            ⚔️ {t.navClash}
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'leaderboard' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400'
            }`}
          >
            👑 {t.navLeaderboard}
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'browse' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400'
            }`}
          >
            🕸️ {t.navBrowse}
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${
              activeTab === 'join' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'text-gray-400'
            }`}
          >
            ✨ {t.navJoin}
          </button>
        </div>

      </div>
    </header>
  );
};
